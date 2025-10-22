/**
 * Styling system for collaborative layers
 * Migrated from: ol/style/Collaboratif.js (749 LOC)
 */
import { Table } from "../collaborative/types";
import { Style } from "ol/style";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";

export class CollabStyler {

  constructor(){

  }

  public static getFeatureStyleFunction(table: Table, cacheUrl: string, sourceOptions: any): Style {
    return new Style({
      fill: new Fill({ color: '#ff0000' }),
      stroke: new Stroke({ color: '#000000', width: 1 }),
    });
  }
}