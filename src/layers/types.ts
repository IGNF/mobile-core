/**
 * CollabVector layer options
 */

import { ApiClient } from "collaboratif-client-api";
import { Geoservice, LayerStyle, Table } from "../collaborative/types";
import { CollabVectorLayer } from "./CollabVectorLayer";

export interface CollabVectorLayerOptions {
  database: string;
  name: string; // table name
  url: string; // service url
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
  cache?: string;
  visibility?: boolean;
  opacity?: number;
  style?: LayerStyle;
  logo?: string;
  authentication?: (layer: any, callback: (login: string, pwd: string) => void) => void;
  getCapabilities?: boolean;
}