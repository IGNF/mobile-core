/**
 * OpenLayers layer for WFS
 * Migrated from: ol/layer/WFS.js
 */
import VectorLayer from "ol/layer/Vector";
import { WFSLayerOptions } from "./types";
import { Table } from "../collaborative/types";
import { WFSSourceOptions } from "../sources/types";
export declare class WFSLayer extends VectorLayer {
    private cache?;
    private layerOptions?;
    constructor(options?: WFSLayerOptions, cache?: string);
    /**
     * Compute the options to pass to the super constructor of VectorLayer
     * @param options WFS layer options
     * @returns Options to pass to the super constructor of VectorLayer
     */
    private static _computeWFSLayerOptions;
    getCapabilities(options: WFSLayerOptions): Promise<void>;
    /**
     * Handle errors from getCapabilities request
     */
    private handleGetCapabilitiesError;
    createSource(options: WFSSourceOptions, cache?: any): void;
    /**
     * Get the table for the WFS layer
     * @returns The table for the WFS layer, or undefined if not ready
     */
    getTable(): Table | undefined;
    /**
     * Create a WFS style function based on feature attributes
     * Returns a style function that reads symbology from feature properties
     * @param attributes Attribute configuration mapping titles to property names
     * @returns Style function or default styles
     */
    private static _createWFSStyle;
}
//# sourceMappingURL=WFSLayer.d.ts.map