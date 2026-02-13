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