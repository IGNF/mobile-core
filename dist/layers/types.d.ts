/**
 * CollabVector layer options
 */
import { ApiClient } from "collaboratif-client-api";
import { Geoservice, LayerStyle, Table } from "../collaborative/types";
import { CollabVectorLayer } from "./CollabVectorLayer";
export interface CollabVectorLayerOptions {
    database: string;
    name: string;
    url: string;
    client: ApiClient;
    /**
     * Explicit namespace used for offline feature cache keys and local edition cache.
     * Use this when multiple communities or offline packages can point to the same table.
     */
    cacheNamespace?: string;
    cacheUrl?: string;
    renderMode?: string;
    table: Table;
    checkSourceOptions?: (layer: CollabVectorLayer, sourceOptions: any, table: Table) => void;
    style?: LayerStyle;
}
export interface WFSLayerOptions {
    geoservice: Geoservice;
    username?: string;
    password?: string;
    accessToken?: string;
    tokenType?: string;
    useCacheWhenOnline?: boolean;
    cache?: string;
    visibility?: boolean;
    opacity?: number;
    style?: LayerStyle;
    logo?: string;
    authentication?: (layer: any, callback: (login: string, pwd: string) => void) => void;
    getCapabilities?: boolean;
}
//# sourceMappingURL=types.d.ts.map