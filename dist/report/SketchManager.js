/**
 * WIP class to manage sketch actions directly on the map
 *
 * Replaces the SketchTools class
 *
 * Note: this class has been mainly generated with AI, a full review is necessary.
 *
 * @example of initilization (client code):
  const sketchManager = new SketchManager({
  map,
  source: vectorSource,
  buttons: {
    drawPoint: '#btn-point',
    drawLine: '#btn-line',
    drawPolygon: '#btn-polygon',
    modify: '#btn-modify',
    select: '#btn-select',
    delete: '#btn-delete'
  },
  callbacks: {
    onFeatureAdded: (feature) => console.log('Feature added!', feature),
    onBack: () => console.log('User cancelled')
  }
});
 */
import BaseObject from 'ol/Object';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Translate from 'ol/interaction/Translate';
import { click } from 'ol/events/condition';
import EventManager from '../utils/EventManager';
/**
 * Framework-agnostic sketch tools for OpenLayers 10
 * Provides drawing, modification, selection, and deletion of vector features
 */
export class SketchManager extends BaseObject {
    /**
     * Creates a new SketchManager instance
     */
    constructor(options) {
        super();
        this.currentMode = null;
        this.undoStack = [];
        // OpenLayers interactions
        this.drawInteraction = null;
        // UI event handlers (stored for cleanup)
        this.boundHandlers = new globalThis.Map();
        this.eventManager = new EventManager();
        if (!options.map) {
            throw new Error('SketchManager requires a map instance');
        }
        if (!options.source) {
            throw new Error('SketchManager requires a vector source');
        }
        this.map = options.map;
        this.source = options.source;
        this.layerFilter = options.layerFilter;
        this.enableUndo = options.enableUndo ?? true;
        this.maxUndoStackSize = options.maxUndoStackSize ?? 50;
        // Initialize button configuration with defaults
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
        // Initialize callbacks with no-op defaults
        this.callbacks = {
            onBack: options.callbacks?.onBack ?? (() => { }),
            onFeatureAdded: options.callbacks?.onFeatureAdded ?? (() => { }),
            onFeatureModified: options.callbacks?.onFeatureModified ?? (() => { }),
            onFeatureDeleted: options.callbacks?.onFeatureDeleted ?? (() => { }),
            onActiveChange: options.callbacks?.onActiveChange ?? (() => { }),
            onModeChange: options.callbacks?.onModeChange ?? (() => { }),
        };
        // Initialize interactions
        this.initializeInteractions();
        // Bind UI elements if auto-bind is enabled (default: true)
        if (options.autoBindUI !== false) {
            this.bindUIElements();
        }
        // Start inactive
        this.setActive(false);
    }
    /**
     * Initialize all OpenLayers interactions
     */
    initializeInteractions() {
        // Modify interaction
        this.modifyInteraction = new Modify({
            source: this.source,
        });
        this.modifyInteraction.setActive(false);
        this.map.addInteraction(this.modifyInteraction);
        // Select interaction
        this.selectInteraction = new Select({
            condition: click,
            layers: this.layerFilter ? this.layerFilter : undefined,
        });
        this.selectInteraction.setActive(false);
        this.map.addInteraction(this.selectInteraction);
        // Translate interaction (for moving features)
        this.translateInteraction = new Translate({
            features: this.selectInteraction.getFeatures(),
        });
        this.translateInteraction.setActive(false);
        this.map.addInteraction(this.translateInteraction);
        // Set up event listeners
        this.setupEventListeners();
    }
    /**
     * Set up event listeners for interactions
     * Notify callbacks and emit events when features are modified or moved
     */
    setupEventListeners() {
        // Modify end event (vertex/shape editing)
        this.modifyInteraction.on('modifyend', (event) => {
            const features = event.features.getArray();
            features.forEach((feature) => {
                this.callbacks.onFeatureModified(feature);
                this.eventManager.emit('featuremodified', {
                    type: 'featuremodified',
                    feature,
                });
            });
        });
        // Translate end event (drag to move)
        this.translateInteraction.on('translateend', (event) => {
            event.features.forEach((feature) => {
                this.callbacks.onFeatureModified(feature);
                this.eventManager.emit('featuremodified', {
                    type: 'featuremodified',
                    feature,
                });
            });
        });
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
            const listener = handler.bind(this);
            element.addEventListener('click', listener);
            this.boundHandlers.set(`${selector}:${handler.name}`, listener);
        });
    }
    /**
     * Unbind all UI elements
     */
    unbindUIElements() {
        this.boundHandlers.forEach((listener, key) => {
            const [selector] = key.split(':');
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.removeEventListener('click', listener);
            });
        });
        this.boundHandlers.clear();
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
        switch (action) {
            case 'back':
                this.handleBack();
                break;
            case 'drawPoint':
                this.activateDraw('Point');
                break;
            case 'drawLine':
                this.activateDraw('LineString');
                break;
            case 'drawPolygon':
                this.activateDraw('Polygon');
                break;
            case 'drawCircle':
                this.activateDraw('Circle');
                break;
            case 'modify':
                this.activateModify();
                break;
            case 'select':
                this.activateSelect();
                break;
            case 'delete':
                this.deleteSelected();
                break;
            case 'undo':
                this.undo();
                break;
            default:
                console.warn(`Unknown action: ${action}`);
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
        this.translateInteraction.setActive(false);
        this.currentMode = null;
        this.notifyModeChange();
    }
    /**
     * Activate draw mode with specified geometry type
     */
    activateDraw(type) {
        this.deactivateAll();
        // Create new draw interaction
        this.drawInteraction = new Draw({
            source: this.source,
            type: type,
        });
        // Handle draw end event
        this.drawInteraction.on('drawend', (event) => {
            const feature = event.feature;
            if (this.enableUndo) {
                this.addToUndoStack({
                    type: 'add',
                    feature,
                });
            }
            this.callbacks.onFeatureAdded(feature);
            this.eventManager.emit('featureadded', {
                type: 'featureadded',
                feature,
            });
            this.eventManager.emit('drawend', {
                type: 'drawend',
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
        this.deactivateAll();
        this.modifyInteraction.setActive(true);
        this.currentMode = 'modify';
        this.notifyModeChange();
    }
    /**
     * Activate select/translate mode for selecting and moving features
     */
    activateSelect() {
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
        if (selected.getLength() > 0) {
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
            this.eventManager.emit('featuredeleted', {
                type: 'featuredeleted',
                feature,
            });
        }
    }
    /**
     * Undo last action
     */
    undo() {
        if (!this.enableUndo || this.undoStack.length === 0) {
            return;
        }
        const lastAction = this.undoStack.pop();
        if (!lastAction)
            return;
        switch (lastAction.type) {
            case 'add':
                this.source.removeFeature(lastAction.feature);
                break;
            case 'delete':
                this.source.addFeature(lastAction.feature);
                break;
            case 'modify':
                if (lastAction.previousGeometry) {
                    lastAction.feature.setGeometry(lastAction.previousGeometry);
                }
                break;
        }
    }
    /**
     * Add action to undo stack
     */
    addToUndoStack(action) {
        this.undoStack.push(action);
        // Limit stack size
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
        this.callbacks.onActiveChange(active);
        this.eventManager.emit('change:active', {
            type: 'change:active',
            active,
        });
    }
    /**
     * Get current active state
     */
    getActive() {
        return this.currentMode !== null;
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
    }
    /**
     * Notify external app of mode change
     */
    notifyModeChange() {
        this.callbacks.onModeChange(this.currentMode);
        this.eventManager.emit('change:mode', {
            type: 'change:mode',
            mode: this.currentMode,
        });
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
        this.deactivateAll();
        this.map.removeInteraction(this.modifyInteraction);
        this.map.removeInteraction(this.selectInteraction);
        this.map.removeInteraction(this.translateInteraction);
        this.clearUndoStack();
    }
}
export default SketchManager;
//# sourceMappingURL=SketchManager.js.map