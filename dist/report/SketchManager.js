/**
 * WIP class to manage sketch actions directly on the map
 *
 * Replaces the SketchTools class
 *
 * Note: this class has been mainly generated with AI, a full review is necessary.
 *
 * @example of initilization (client code):
 * const sketchManager = new SketchManager({
 *   map,
 *   source: vectorSource,
 *   buttons: {
 *     drawPoint: '#btn-point',
 *     drawLine: '#btn-line',
 *     drawPolygon: '#btn-polygon',
 *     modify: '#btn-modify',
 *     select: '#btn-select',
 *     delete: '#btn-delete'
 *   },
 *   callbacks: {
 *     onFeatureAdded: (feature) => console.log('Feature added!', feature),
 *     onBack: () => console.log('User cancelled')
 *   }
 * });
 */
import FeatureClass from 'ol/Feature';
import { click } from 'ol/events/condition';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Translate from 'ol/interaction/Translate';
import BaseObject from 'ol/Object';
import { unByKey } from 'ol/Observable';
import { getUid } from 'ol/util';
const DEFAULT_SELECTION_HIT_TOLERANCE = 10;
const noop = () => { };
function isSelectionMode(mode) {
    return mode === 'select' || mode === 'modify';
}
function getSquaredDistance(left, right) {
    const dx = left[0] - right[0];
    const dy = left[1] - right[1];
    return (dx * dx) + (dy * dy);
}
function getClosestPointOnFeature(feature, coordinate) {
    const geometry = feature.getGeometry();
    if (!geometry) {
        return null;
    }
    if (typeof geometry.intersectsCoordinate === 'function' && geometry.intersectsCoordinate(coordinate)) {
        return coordinate;
    }
    const closestPoint = [Number.NaN, Number.NaN];
    geometry.closestPointXY(coordinate[0], coordinate[1], closestPoint, Number.POSITIVE_INFINITY);
    return Number.isFinite(closestPoint[0]) && Number.isFinite(closestPoint[1])
        ? closestPoint
        : null;
}
/**
 * Framework-agnostic sketch tools for OpenLayers 10
 * Provides drawing, modification, selection, and deletion of vector features.
 */
export class SketchManager extends BaseObject {
    /**
     * Creates a new SketchManager instance
     */
    constructor(options) {
        super();
        this.isActive = false;
        this.currentMode = null;
        this.undoStack = [];
        // OpenLayers interactions
        this.drawInteraction = null;
        // Track initial geometries to support modify/translate undo
        this.modifyStartGeometries = new globalThis.Map();
        this.translateStartGeometries = new globalThis.Map();
        // UI event handlers (stored for cleanup)
        this.boundHandlers = [];
        this.listenerKeys = [];
        if (!options.map) {
            throw new Error('SketchManager requires a map instance');
        }
        if (!options.source) {
            throw new Error('SketchManager requires a vector source');
        }
        this.map = options.map;
        this.source = options.source;
        this.layerFilter = options.layerFilter;
        this.modifyInteractionScope = options.modifyInteractionScope ?? 'source';
        this.selectionHitTolerance = options.selectionHitTolerance ?? DEFAULT_SELECTION_HIT_TOLERANCE;
        this.useSourceSelectionFallback = options.useSourceSelectionFallback ?? true;
        this.enableUndo = options.enableUndo ?? true;
        this.maxUndoStackSize = options.maxUndoStackSize ?? 50;
        this.buttons = {
            back: options.buttons?.back ?? null,
            drawPoint: options.buttons?.drawPoint ?? null,
            drawLine: options.buttons?.drawLine ?? null,
            drawPolygon: options.buttons?.drawPolygon ?? null,
            drawCircle: options.buttons?.drawCircle ?? null,
            modify: options.buttons?.modify ?? null,
            select: options.buttons?.select ?? null,
            delete: options.buttons?.delete ?? null,
            undo: options.buttons?.undo ?? null,
        };
        this.callbacks = {
            onBack: options.callbacks?.onBack ?? noop,
            onFeatureAdded: options.callbacks?.onFeatureAdded ?? noop,
            onFeatureSelected: options.callbacks?.onFeatureSelected ?? noop,
            onFeatureModified: options.callbacks?.onFeatureModified ?? noop,
            onFeatureDeleted: options.callbacks?.onFeatureDeleted ?? noop,
            onActiveChange: options.callbacks?.onActiveChange ?? noop,
            onModeChange: options.callbacks?.onModeChange ?? noop,
        };
        this.initializeInteractions();
        if (options.autoBindUI !== false) {
            this.bindUIElements();
        }
        this.setActive(false);
    }
    /**
     * Initialize all OpenLayers interactions
     */
    initializeInteractions() {
        this.selectInteraction = new Select({
            condition: click,
            hitTolerance: this.selectionHitTolerance,
            layers: this.layerFilter ? this.layerFilter : undefined,
        });
        this.selectInteraction.setActive(false);
        this.map.addInteraction(this.selectInteraction);
        this.modifyInteraction = this.modifyInteractionScope === 'selection'
            ? new Modify({
                features: this.selectInteraction.getFeatures(),
            })
            : new Modify({
                source: this.source,
            });
        this.modifyInteraction.setActive(false);
        this.map.addInteraction(this.modifyInteraction);
        this.translateInteraction = new Translate({
            features: this.selectInteraction.getFeatures(),
        });
        this.translateInteraction.setActive(false);
        this.map.addInteraction(this.translateInteraction);
        this.setupEventListeners();
    }
    /**
     * Set up event listeners for interactions
     * Notify callbacks and emit events when features are selected, modified, or moved.
     */
    setupEventListeners() {
        if (this.modifyInteractionScope === 'selection') {
            this.listenerKeys.push(this.map.on('singleclick', (event) => {
                if (!isSelectionMode(this.currentMode)) {
                    return;
                }
                const feature = this.findFeatureFromTap(event);
                this.updateSelectedFeature(feature);
            }));
        }
        else {
            this.listenerKeys.push(this.selectInteraction.on('select', () => {
                this.notifyFeatureSelected(this.getSelectedFeature());
            }));
        }
        this.listenerKeys.push(this.modifyInteraction.on('modifystart', (event) => {
            event.features.forEach((feature) => {
                const geometry = feature.getGeometry();
                if (!geometry) {
                    return;
                }
                this.modifyStartGeometries.set(String(getUid(feature)), geometry.clone());
            });
        }));
        this.listenerKeys.push(this.modifyInteraction.on('modifyend', (event) => {
            const features = event.features.getArray();
            features.forEach((feature) => {
                const featureUid = String(getUid(feature));
                const previousGeometry = this.modifyStartGeometries.get(featureUid);
                if (this.enableUndo && previousGeometry) {
                    this.addToUndoStack({
                        type: 'modify',
                        feature,
                        previousGeometry,
                    });
                }
                this.modifyStartGeometries.delete(featureUid);
                this.callbacks.onFeatureModified(feature);
                this.emitEvent('featuremodified', { feature });
            });
        }));
        this.listenerKeys.push(this.translateInteraction.on('translatestart', (event) => {
            event.features.forEach((feature) => {
                const geometry = feature.getGeometry();
                if (!geometry) {
                    return;
                }
                this.translateStartGeometries.set(String(getUid(feature)), geometry.clone());
            });
        }));
        this.listenerKeys.push(this.translateInteraction.on('translateend', (event) => {
            event.features.forEach((feature) => {
                const featureUid = String(getUid(feature));
                const previousGeometry = this.translateStartGeometries.get(featureUid);
                if (this.enableUndo && previousGeometry) {
                    this.addToUndoStack({
                        type: 'modify',
                        feature,
                        previousGeometry,
                    });
                }
                this.translateStartGeometries.delete(featureUid);
                this.callbacks.onFeatureModified(feature);
                this.emitEvent('featuremodified', { feature });
            });
        }));
    }
    /**
     * Bind UI elements to interactions
     * Can be called manually if UI is loaded dynamically
     */
    bindUIElements() {
        this.unbindUIElements();
        const bindings = [
            ['back', () => this.handleBack()],
            ['drawPoint', () => this.activateDraw('Point')],
            ['drawLine', () => this.activateDraw('LineString')],
            ['drawPolygon', () => this.activateDraw('Polygon')],
            ['drawCircle', () => this.activateDraw('Circle')],
            ['modify', () => this.activateModify()],
            ['select', () => this.activateSelect()],
            ['delete', () => this.deleteSelected()],
            ['undo', () => this.undo()],
        ];
        bindings.forEach(([key, handler]) => {
            const selector = this.buttons[key];
            if (selector) {
                this.bindElement(selector, handler);
            }
        });
    }
    /**
     * Bind a single element to a handler
     */
    bindElement(selector, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const listener = () => {
                handler();
            };
            element.addEventListener('click', listener);
            this.boundHandlers.push({ element, listener });
        });
    }
    /**
     * Unbind all UI elements
     */
    unbindUIElements() {
        this.boundHandlers.forEach(({ element, listener }) => {
            element.removeEventListener('click', listener);
        });
        this.boundHandlers = [];
    }
    /**
     * Handle back button action
     */
    handleBack() {
        this.callbacks.onBack();
        this.setActive(false);
    }
    /**
     * Manually trigger an action programmatically
     * Useful for framework integrations (React, Vue, etc.)
     */
    triggerAction(action) {
        if (action !== 'back' && !this.isActive) {
            this.setActive(true);
        }
        switch (action) {
            case 'back':
                this.handleBack();
                return;
            case 'drawPoint':
                this.activateDraw('Point');
                return;
            case 'drawLine':
                this.activateDraw('LineString');
                return;
            case 'drawPolygon':
                this.activateDraw('Polygon');
                return;
            case 'drawCircle':
                this.activateDraw('Circle');
                return;
            case 'modify':
                this.activateModify();
                return;
            case 'select':
                this.activateSelect();
                return;
            case 'delete':
                this.deleteSelected();
                return;
            case 'undo':
                this.undo();
                return;
            default:
                console.warn(`Unknown action: ${action}`);
                return;
        }
    }
    /**
     * Helper to activate a mode from an InteractionMode value
     */
    setMode(mode) {
        switch (mode) {
            case 'draw-point':
                this.activateDraw('Point');
                return;
            case 'draw-linestring':
                this.activateDraw('LineString');
                return;
            case 'draw-polygon':
                this.activateDraw('Polygon');
                return;
            case 'draw-circle':
                this.activateDraw('Circle');
                return;
            case 'modify':
                this.activateModify();
                return;
            case 'select':
                this.activateSelect();
                return;
        }
    }
    /**
     * Deactivate all interactions
     */
    deactivateAll() {
        if (this.drawInteraction) {
            this.drawInteraction.setActive(false);
            this.map.removeInteraction(this.drawInteraction);
            this.drawInteraction = null;
        }
        this.modifyInteraction.setActive(false);
        this.selectInteraction.setActive(false);
        this.selectInteraction.getFeatures().clear();
        this.translateInteraction.setActive(false);
        this.modifyStartGeometries.clear();
        this.translateStartGeometries.clear();
        this.currentMode = null;
        this.notifyModeChange();
    }
    /**
     * Activate draw mode with specified geometry type
     */
    activateDraw(type) {
        this.ensureActive();
        this.deactivateAll();
        this.drawInteraction = new Draw({
            source: this.source,
            type: type,
        });
        this.drawInteraction.on('drawend', (event) => {
            const feature = event.feature;
            if (this.enableUndo) {
                this.addToUndoStack({
                    type: 'add',
                    feature,
                });
            }
            this.callbacks.onFeatureAdded(feature);
            this.emitEvent('featureadded', { feature });
            this.emitEvent('drawend', {
                feature,
                valid: true,
            });
        });
        this.map.addInteraction(this.drawInteraction);
        this.drawInteraction.setActive(true);
        this.currentMode = `draw-${type.toLowerCase()}`;
        this.notifyModeChange();
    }
    /**
     * Activate modify mode for editing geometries
     */
    activateModify() {
        this.ensureActive();
        this.deactivateAll();
        if (this.modifyInteractionScope === 'selection') {
            this.selectInteraction.setActive(true);
        }
        this.modifyInteraction.setActive(true);
        this.currentMode = 'modify';
        this.notifyModeChange();
    }
    /**
     * Activate select/translate mode for selecting and moving features
     */
    activateSelect() {
        this.ensureActive();
        this.deactivateAll();
        this.selectInteraction.setActive(true);
        this.translateInteraction.setActive(true);
        this.currentMode = 'select';
        this.notifyModeChange();
    }
    /**
     * Delete currently selected feature
     */
    deleteSelected() {
        const selected = this.selectInteraction.getFeatures();
        if (selected.getLength() === 0) {
            return;
        }
        const feature = selected.item(0);
        if (this.enableUndo) {
            this.addToUndoStack({
                type: 'delete',
                feature: feature.clone(),
            });
        }
        this.source.removeFeature(feature);
        selected.clear();
        this.callbacks.onFeatureDeleted(feature);
        this.emitEvent('featuredeleted', { feature });
        this.notifyFeatureSelected(null);
    }
    /**
     * Undo last action
     */
    undo() {
        if (!this.enableUndo || this.undoStack.length === 0) {
            return;
        }
        const lastAction = this.undoStack.pop();
        if (!lastAction) {
            return;
        }
        switch (lastAction.type) {
            case 'add':
                this.source.removeFeature(lastAction.feature);
                return;
            case 'delete':
                this.source.addFeature(lastAction.feature);
                return;
            case 'modify':
                if (lastAction.previousGeometry) {
                    lastAction.feature.setGeometry(lastAction.previousGeometry.clone());
                }
                return;
        }
    }
    /**
     * Add action to undo stack
     */
    addToUndoStack(action) {
        this.undoStack.push(action);
        if (this.undoStack.length > this.maxUndoStackSize) {
            this.undoStack.shift();
        }
    }
    /**
     * Clear undo stack
     */
    clearUndoStack() {
        this.undoStack = [];
    }
    /**
     * Check if undo is available
     */
    canUndo() {
        return this.enableUndo && this.undoStack.length > 0;
    }
    /**
     * Set active state of sketch tools
     */
    setActive(active) {
        if (!active) {
            this.deactivateAll();
        }
        if (this.isActive === active) {
            return;
        }
        this.isActive = active;
        this.callbacks.onActiveChange(active);
        this.emitEvent('change:active', { active });
    }
    /**
     * Get current active state
     */
    getActive() {
        return this.isActive;
    }
    /**
     * Get current interaction mode
     */
    getCurrentMode() {
        return this.currentMode;
    }
    /**
     * Get currently selected feature
     */
    getSelectedFeature() {
        const selected = this.selectInteraction.getFeatures();
        return selected.getLength() > 0 ? selected.item(0) : null;
    }
    /**
     * Get all selected features
     */
    getSelectedFeatures() {
        return this.selectInteraction.getFeatures().getArray();
    }
    /**
     * Clear current selection
     */
    clearSelection() {
        this.selectInteraction.getFeatures().clear();
        this.notifyFeatureSelected(null);
    }
    /**
     * Get current source features
     */
    getFeatures() {
        return this.source.getFeatures();
    }
    /**
     * Notify external app of mode change
     */
    notifyModeChange() {
        this.callbacks.onModeChange(this.currentMode);
        this.emitEvent('change:mode', { mode: this.currentMode });
    }
    /**
     * Notify external app of feature selection changes.
     */
    notifyFeatureSelected(feature) {
        this.callbacks.onFeatureSelected(feature);
        this.emitEvent('featureselected', { feature });
    }
    /**
     * Update button selectors (for dynamically loaded UI)
     */
    updateButtons(buttons) {
        this.unbindUIElements();
        Object.assign(this.buttons, buttons);
        this.bindUIElements();
    }
    /**
     * Clean up and remove all interactions
     */
    destroy() {
        this.unbindUIElements();
        this.setActive(false);
        unByKey(this.listenerKeys);
        this.listenerKeys.length = 0;
        this.map.removeInteraction(this.modifyInteraction);
        this.map.removeInteraction(this.selectInteraction);
        this.map.removeInteraction(this.translateInteraction);
        this.clearUndoStack();
    }
    ensureActive() {
        if (!this.isActive) {
            this.setActive(true);
        }
    }
    updateSelectedFeature(feature) {
        const selected = this.selectInteraction.getFeatures();
        selected.clear();
        if (feature) {
            selected.push(feature);
        }
        this.notifyFeatureSelected(feature);
    }
    findFeatureFromTap(event) {
        const mapHitFeature = this.findFeatureAtPixel(event.pixel);
        if (mapHitFeature) {
            return mapHitFeature;
        }
        if (!this.useSourceSelectionFallback) {
            return null;
        }
        return this.findNearestFeature(event.coordinate);
    }
    findFeatureAtPixel(pixel) {
        let matchingFeature = null;
        this.map.forEachFeatureAtPixel(pixel, (featureLike, layerLike) => {
            if (!(featureLike instanceof FeatureClass)) {
                return undefined;
            }
            if (Array.isArray(featureLike.get('features'))) {
                return undefined;
            }
            const layer = layerLike;
            if (this.layerFilter && (!layer || !this.layerFilter(layer))) {
                return undefined;
            }
            matchingFeature = featureLike;
            return matchingFeature;
        }, { hitTolerance: this.selectionHitTolerance });
        return matchingFeature;
    }
    findNearestFeature(coordinate) {
        const closestFeature = this.source.getClosestFeatureToCoordinate(coordinate);
        if (!closestFeature) {
            return null;
        }
        const closestPoint = getClosestPointOnFeature(closestFeature, coordinate);
        if (!closestPoint) {
            return null;
        }
        const tapPixel = this.map.getPixelFromCoordinate(coordinate);
        const closestPixel = this.map.getPixelFromCoordinate(closestPoint);
        const pixelDistance = Math.sqrt(getSquaredDistance(tapPixel, closestPixel));
        return pixelDistance <= this.selectionHitTolerance ? closestFeature : null;
    }
    emitEvent(type, payload) {
        this.dispatchEvent({ type, ...payload });
    }
}
export default SketchManager;
//# sourceMappingURL=SketchManager.js.map