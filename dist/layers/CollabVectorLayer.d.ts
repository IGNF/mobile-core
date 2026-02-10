/**
 * Collaborative vector layer
 * @migrated from: ol/layer/CollabVector.js
 */
import VectorLayer from 'ol/layer/Vector';
import { CollabVectorLayerOptions } from './types';
import { LayerStyle, Table } from '../collaborative/types';
import CollabVectorSource from '../sources/CollabVectorSource';
import { CollabVectorSourceOptions } from '../sources/types';
export declare class CollabVectorLayer extends VectorLayer<CollabVectorSource> {
    constructor(options: CollabVectorLayerOptions, sourceOptions?: Partial<CollabVectorSourceOptions>);
    /**
     * Computes the options for the CollabVector layer
     */
    private static _computeCollabVectorLayerOptions;
    /**
     * Creates the source for the CollabVector layer
     */
    createSource(options: CollabVectorLayerOptions, sourceOptions: Partial<CollabVectorSourceOptions>, table: Table): void;
    /**
     * Get the table for the CollabVector layer
     */
    getTable(): Table | undefined;
    /**
     * Get the style for features in this layer
     */
    getFeatureStyle(): LayerStyle | undefined;
    /**
     * Check if the layer is ready (has a source with a table)
     */
    isReady(): boolean;
    /**
     * Set the online/offline mode for the layer
     */
    setOnline(online: boolean): void;
}
//# sourceMappingURL=CollabVectorLayer.d.ts.map