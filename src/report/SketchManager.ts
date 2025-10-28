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

// SketchManager.ts
import type { Map } from 'ol';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type VectorSource from 'ol/source/Vector';
import type { Layer } from 'ol/layer';
import BaseObject from 'ol/Object';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Translate from 'ol/interaction/Translate';
import { click } from 'ol/events/condition';
import type { Type as GeometryType } from 'ol/geom/Geometry';

import EventManager from '../utils/EventManager';

/**
 * Supported geometry types for drawing
 */
export type DrawGeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle';

/**
 * Available interaction modes
 */
export type InteractionMode =
  | 'draw-point'
  | 'draw-linestring'
  | 'draw-polygon'
  | 'draw-circle'
  | 'modify'
  | 'select'
  | null;

/**
 * Action types that can be triggered programmatically
 */
export type SketchAction =
  | 'back'
  | 'drawPoint'
  | 'drawLine'
  | 'drawPolygon'
  | 'drawCircle'
  | 'modify'
  | 'select'
  | 'delete'
  | 'undo';

/**
 * UI button configuration
 * Maps action names to CSS selectors (IDs, classes, or any valid selector)
 */
export interface ButtonConfig {
  back?: string;
  drawPoint?: string;
  drawLine?: string;
  drawPolygon?: string;
  drawCircle?: string;
  modify?: string;
  select?: string;
  delete?: string;
  undo?: string;
}

/**
 * Event callbacks for sketch tool actions
 */
export interface SketchManagerCallbacks {
  onBack?: () => void;
  onFeatureAdded?: (feature: Feature<Geometry>) => void;
  onFeatureModified?: (feature: Feature<Geometry>) => void;
  onFeatureDeleted?: (feature: Feature<Geometry>) => void;
  onActiveChange?: (active: boolean) => void;
  onModeChange?: (mode: InteractionMode) => void;
}

/**
 * Configuration options for SketchManager
 */
export interface SketchManagerOptions {
  /** OpenLayers map instance */
  map: Map;

  /** Vector source where features will be added/modified */
  source: VectorSource<Feature<Geometry>>;

  /** UI button selectors */
  buttons?: ButtonConfig;

  /** Event callbacks */
  callbacks?: SketchManagerCallbacks;

  /** Layer filter for selecting features (optional) */
  layerFilter?: (layer: Layer) => boolean;

  /** Enable undo functionality */
  enableUndo?: boolean;

  /** Maximum undo stack size */
  maxUndoStackSize?: number;

  /** Auto-bind UI elements on initialization */
  autoBindUI?: boolean;
}

/**
 * Undo action types
 */
interface UndoAction {
  type: 'add' | 'delete' | 'modify';
  feature: Feature<Geometry>;
  previousGeometry?: Geometry;
}

/**
 * Custom event types for SketchManager
 */
export interface SketchManagerEventMap {
  'change:active': { active: boolean };
  'change:mode': { mode: InteractionMode };
  'featureadded': { feature: Feature<Geometry> };
  'featuremodified': { feature: Feature<Geometry> };
  'featuredeleted': { feature: Feature<Geometry> };
  'drawend': { feature: Feature<Geometry>; valid: boolean };
}

/**
 * Framework-agnostic sketch tools for OpenLayers 10
 * Provides drawing, modification, selection, and deletion of vector features
 */
export class SketchManager extends BaseObject {
  private readonly map: Map;
  private readonly source: VectorSource<Feature<Geometry>>;
  private readonly buttons: Required<ButtonConfig>;
  private readonly callbacks: Required<SketchManagerCallbacks>;
  private readonly layerFilter?: (layer: Layer) => boolean;
  private readonly enableUndo: boolean;
  private readonly maxUndoStackSize: number;

  private currentMode: InteractionMode = null;
  private undoStack: UndoAction[] = [];

  // OpenLayers interactions
  private drawInteraction: Draw | null = null;
  private modifyInteraction!: Modify;
  private selectInteraction!: Select;
  private translateInteraction!: Translate;

  // UI event handlers (stored for cleanup)
  private boundHandlers: globalThis.Map<string, EventListener> = new globalThis.Map();

  private eventManager: EventManager;

  /**
   * Creates a new SketchManager instance
   */
  constructor(options: SketchManagerOptions) {
    super();

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
    } as Required<ButtonConfig>;

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
  private initializeInteractions(): void {
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
   */
  private setupEventListeners(): void {
    // Modify end event
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

    // Translate end event
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
  public bindUIElements(): void {
    this.unbindUIElements();

    const bindings: Array<[keyof ButtonConfig, () => void]> = [
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
  private bindElement(selector: string, handler: () => void): void {
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
  private unbindUIElements(): void {
    this.boundHandlers.forEach((listener: EventListener, key: string) => {
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
  private handleBack(): void {
    this.callbacks.onBack();
    this.setActive(false);
  }

  /**
   * Manually trigger an action programmatically
   * Useful for framework integrations (React, Vue, etc.)
   */
  public triggerAction(action: SketchAction): void {
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
  public deactivateAll(): void {
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
  public activateDraw(type: DrawGeometryType): void {
    this.deactivateAll();

    // Create new draw interaction
    this.drawInteraction = new Draw({
      source: this.source,
      type: type as GeometryType,
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

    this.currentMode = `draw-${type.toLowerCase()}` as InteractionMode;
    this.notifyModeChange();
  }

  /**
   * Activate modify mode for editing geometries
   */
  public activateModify(): void {
    this.deactivateAll();
    this.modifyInteraction.setActive(true);

    this.currentMode = 'modify';
    this.notifyModeChange();
  }

  /**
   * Activate select/translate mode for selecting and moving features
   */
  public activateSelect(): void {
    this.deactivateAll();
    this.selectInteraction.setActive(true);
    this.translateInteraction.setActive(true);

    this.currentMode = 'select';
    this.notifyModeChange();
  }

  /**
   * Delete currently selected feature
   */
  public deleteSelected(): void {
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
  public undo(): void {
    if (!this.enableUndo || this.undoStack.length === 0) {
      return;
    }

    const lastAction = this.undoStack.pop();
    if (!lastAction) return;

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
  private addToUndoStack(action: UndoAction): void {
    this.undoStack.push(action);

    // Limit stack size
    if (this.undoStack.length > this.maxUndoStackSize) {
      this.undoStack.shift();
    }
  }

  /**
   * Clear undo stack
   */
  public clearUndoStack(): void {
    this.undoStack = [];
  }

  /**
   * Check if undo is available
   */
  public canUndo(): boolean {
    return this.enableUndo && this.undoStack.length > 0;
  }

  /**
   * Set active state of sketch tools
   */
  public setActive(active: boolean): void {
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
  public getActive(): boolean {
    return this.currentMode !== null;
  }

  /**
   * Get current interaction mode
   */
  public getCurrentMode(): InteractionMode {
    return this.currentMode;
  }

  /**
   * Get currently selected feature
   */
  public getSelectedFeature(): Feature<Geometry> | null {
    const selected = this.selectInteraction.getFeatures();
    return selected.getLength() > 0 ? selected.item(0) : null;
  }

  /**
   * Get all selected features
   */
  public getSelectedFeatures(): Feature<Geometry>[] {
    return this.selectInteraction.getFeatures().getArray();
  }

  /**
   * Clear current selection
   */
  public clearSelection(): void {
    this.selectInteraction.getFeatures().clear();
  }

  /**
   * Notify external app of mode change
   */
  private notifyModeChange(): void {
    this.callbacks.onModeChange(this.currentMode);
    this.eventManager.emit('change:mode', {
      type: 'change:mode',
      mode: this.currentMode,
    });
  }

  /**
   * Update button selectors (for dynamically loaded UI)
   */
  public updateButtons(buttons: Partial<ButtonConfig>): void {
    this.unbindUIElements();
    Object.assign(this.buttons, buttons);
    this.bindUIElements();
  }

  /**
   * Clean up and remove all interactions
   */
  public destroy(): void {
    this.unbindUIElements();
    this.deactivateAll();

    this.map.removeInteraction(this.modifyInteraction);
    this.map.removeInteraction(this.selectInteraction);
    this.map.removeInteraction(this.translateInteraction);

    this.clearUndoStack();
  }
}

export default SketchManager;

