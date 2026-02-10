/**
 * OpenLayers layer for WFS
 * Migrated from: ol/layer/WFS.js
 */
import VectorLayer from 'ol/layer/Vector';
import { WFSLayerOptions } from './types';
import { Table } from '../collaborative/types';
import { WFSSourceOptions } from '../sources/types';
export declare class WFSLayer extends VectorLayer {
    private cache?;
    private layerOptions?;
    constructor(options?: WFSLayerOptions, cache?: string);
    /**
     * Compute the options to pass to the super constructor of VectorLayer
     */
    private static _computeWFSLayerOptions;
    getCapabilities(options: WFSLayerOptions): Promise<void>;
    private getAuthorizationHeader;
    /**
     * Handle errors from getCapabilities request
     */
    private handleGetCapabilitiesError;
    createSource(options: WFSSourceOptions, cache?: any): void;
    /**
     * Get the table for the WFS layer
     */
    getTable(): Table | undefined;
    /**
     * Create a WFS style function based on feature attributes
     */
    private static _createWFSStyle;
}
//# sourceMappingURL=WFSLayer.d.ts.map