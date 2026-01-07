/**
 * Collaborative vector layer
 * @migrated from: ol/layer/CollabVector.js
 */
import VectorLayer from "ol/layer/Vector";
import { CollabVectorLayerOptions } from "./types";
import { LayerStyle, Table } from "../collaborative/types";
import CollabVectorSource from "../sources/CollabVectorSource";
import { CollabVectorSourceOptions } from "../sources/types";
export declare class CollabVectorLayer extends VectorLayer<CollabVectorSource> {
    constructor(options: CollabVectorLayerOptions, sourceOptions?: Partial<CollabVectorSourceOptions>);
    /**
     * Computes the options for the CollabVector layer
     * @param options
     * @returns The options for the VectorLayer super constructor
     */
    private static _computeCollabVectorLayerOptions;
    /**
     * Creates the source for the CollabVector layer
     * @param options
     * @param sourceOptions
     * @param table
     * @returns The source for the CollabVector layer
     *
     * TODO
     * See if we can refactor the "table" attribute, options.table seems to equal sourceOptions.table and table
     */
    createSource(options: CollabVectorLayerOptions, sourceOptions: Partial<CollabVectorSourceOptions>, table: Table): void;
    /**
     * Get the table for the CollabVector layer
     * @returns The table for the CollabVector layer, or undefined if not ready
     */
    getTable(): Table | undefined;
    /**
     * Get the style for features in this layer
     * @returns The layer style, or undefined if not ready
     */
    getFeatureStyle(): LayerStyle | undefined;
    /**
     * Check if the layer is ready (has a source with a table)
     * @returns True if the layer is ready, false otherwise
     */
    isReady(): boolean;
    /**
     * Set the online/offline mode for the layer
     * @param online - True for online mode, false for offline mode
     */
    setOnline(online: boolean): void;
}
//# sourceMappingURL=CollabVectorLayer.d.ts.map