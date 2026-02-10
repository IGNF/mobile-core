/**
 * CollabVectorSource - OpenLayers source for collaborative vector layers
 * @migrated from ol/source/CollabVector.js of the CordovApp module
 */
import VectorSource from 'ol/source/Vector';
import { Collection, Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { CollabVectorSourceOptions } from './types';
import { Table } from '../collaborative/types';
export default class CollabVectorSource extends VectorSource {
    private _options;
    private _isLoading;
    private _writeUpdateCounter;
    private _cache?;
    private _tileLoading;
    private _projectionCode;
    table: Table;
    localProperties: Record<string, any>;
    /** Features that should persist across source reloads (e.g., currently edited features) */
    preservedFeatures: Collection<Feature>;
    /** Features tracked for differential synchronization */
    differentialFeatures: Collection<Feature>;
    /** Features that have been inserted locally and need to be synced */
    insertedFeatures: Collection<Feature>;
    /** Features that have been deleted locally and need to be synced */
    deletedFeatures: Collection<Feature>;
    /** Features that have been updated locally and need to be synced */
    updatedFeatures: Collection<Feature>;
    constructor(options: CollabVectorSourceOptions);
    private static _computeVectorSourceOptions;
    private _initCollabVectorSource;
    getTable(): Table;
    onAddFeature(feature: Feature): void;
    onDeleteFeature(feature: Feature): void;
    private removeFeatureFromCollection;
    writeChanges(force?: boolean): void;
    getSaveActions(includeGeometry?: boolean): any;
    private serializeFeature;
    loadChanges(): void;
    private _restoreActions;
    private deserializeFeature;
    private onUpdateFeature;
    private _saveEditionCache;
    private _loadEditionCache;
    setLoading(isLoading: boolean): void;
    reload(): void;
    loaderFn(extent: number[], resolution: number, projection: any, success?: (features: Feature[]) => void, failure?: () => void): void;
    private _loadFeatures;
    private _loadFromOnline;
    private _loadFromOfflineCache;
    private _saveFeaturesToOfflineCache;
    private _getOfflineCacheKeys;
    getWFSParams(extent: number[], projectionCode: string): Record<string, unknown>;
    private _countPayloadFeatures;
    private _readFeatures;
    createFeatureFromGeom(geom: unknown, projectionCode: string): Feature<Geometry> | null;
    private _isGeoJSONPayload;
    private _extractItemsFromPayload;
    private _findFeature;
    private _featureExistsInSource;
    private _findFeatureInCollection;
    private _containsFeature;
    private _getFeatureIdentifier;
    private _featureIdentifiersMatch;
    private _getIdPropertyName;
    private _getGeometryColumnName;
    private _getTableCRS;
}
//# sourceMappingURL=CollabVectorSource.d.ts.map