/**
 * CollabVector layer options
 */

import { ApiClient } from "collaboratif-client-api";
import { LayerStyle, Table } from "../collaborative/types";
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