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
import type { Map } from 'ol';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';
import type VectorSource from 'ol/source/Vector';
import type { Layer } from 'ol/layer';
import BaseObject from 'ol/Object';
/**
 * Supported geometry types for drawing
 */
export type DrawGeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle';
/**
 * Available interaction modes
 */
export type InteractionMode = 'draw-point' | 'draw-linestring' | 'draw-polygon' | 'draw-circle' | 'modify' | 'select' | null;
/**
 * Action types that can be triggered programmatically
 */
export type SketchAction = 'back' | 'drawPoint' | 'drawLine' | 'drawPolygon' | 'drawCircle' | 'modify' | 'select' | 'delete' | 'undo';
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
 * Custom event types for SketchManager
 */
export interface SketchManagerEventMap {
    'change:active': {
        active: boolean;
    };
    'change:mode': {
        mode: InteractionMode;
    };
    'featureadded': {
        feature: Feature<Geometry>;
    };
    'featuremodified': {
        feature: Feature<Geometry>;
    };
    'featuredeleted': {
        feature: Feature<Geometry>;
    };
    'drawend': {
        feature: Feature<Geometry>;
        valid: boolean;
    };
}
/**
 * Framework-agnostic sketch tools for OpenLayers 10
 * Provides drawing, modification, selection, and deletion of vector features
 */
export declare class SketchManager extends BaseObject {
    private readonly map;
    private readonly source;
    private readonly buttons;
    private readonly callbacks;
    private readonly layerFilter?;
    private readonly enableUndo;
    private readonly maxUndoStackSize;
    private isActive;
    private currentMode;
    private undoStack;
    private drawInteraction;
    private modifyInteraction;
    private selectInteraction;
    private translateInteraction;
    private modifyStartGeometries;
    private translateStartGeometries;
    private boundHandlers;
    /**
     * Creates a new SketchManager instance
     */
    constructor(options: SketchManagerOptions);
    /**
     * Initialize all OpenLayers interactions
     */
    private initializeInteractions;
    /**
     * Set up event listeners for interactions
     * Notify callbacks and emit events when features are modified or moved
     */
    private setupEventListeners;
    /**
     * Bind UI elements to interactions
     * Can be called manually if UI is loaded dynamically
     */
    bindUIElements(): void;
    /**
     * Bind a single element to a handler
     */
    private bindElement;
    /**
     * Unbind all UI elements
     */
    private unbindUIElements;
    /**
     * Handle back button action
     */
    private handleBack;
    /**
     * Manually trigger an action programmatically
     * Useful for framework integrations (React, Vue, etc.)
     */
    triggerAction(action: SketchAction): void;
    /**
     * Helper to activate a mode from an InteractionMode value
     */
    setMode(mode: Exclude<InteractionMode, null>): void;
    /**
     * Deactivate all interactions
     */
    deactivateAll(): void;
    /**
     * Activate draw mode with specified geometry type
     */
    activateDraw(type: DrawGeometryType): void;
    /**
     * Activate modify mode for editing geometries
     */
    activateModify(): void;
    /**
     * Activate select/translate mode for selecting and moving features
     */
    activateSelect(): void;
    /**
     * Delete currently selected feature
     */
    deleteSelected(): void;
    /**
     * Undo last action
     */
    undo(): void;
    /**
     * Add action to undo stack
     */
    private addToUndoStack;
    /**
     * Clear undo stack
     */
    clearUndoStack(): void;
    /**
     * Check if undo is available
     */
    canUndo(): boolean;
    /**
     * Set active state of sketch tools
     */
    setActive(active: boolean): void;
    /**
     * Get current active state
     */
    getActive(): boolean;
    /**
     * Get current interaction mode
     */
    getCurrentMode(): InteractionMode;
    /**
     * Get currently selected feature
     */
    getSelectedFeature(): Feature<Geometry> | null;
    /**
     * Get all selected features
     */
    getSelectedFeatures(): Feature<Geometry>[];
    /**
     * Clear current selection
     */
    clearSelection(): void;
    /**
     * Get current source features
     */
    getFeatures(): Feature<Geometry>[];
    /**
     * Notify external app of mode change
     */
    private notifyModeChange;
    /**
     * Update button selectors (for dynamically loaded UI)
     */
    updateButtons(buttons: Partial<ButtonConfig>): void;
    /**
     * Clean up and remove all interactions
     */
    destroy(): void;
    private ensureActive;
    private emitEvent;
}
export default SketchManager;
//# sourceMappingURL=SketchManager.d.ts.map