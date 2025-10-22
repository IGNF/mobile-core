/**
 * Styling system for collaborative layers
 * Migrated from: ol/style/Collaboratif.js (749 LOC)
 */
import { Table } from "../collaborative/types";
import { Style } from "ol/style";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";

/**
 * NOTE:
 * 2 fonctions vont posser problème ici, du à leur utilisation de Cordova.
 * - getSymbolURI (ligne 412 de l'ancienne classe)
 * - loadSymbolCache (ligne 263 de l'ancienne classe)
 * 
 * For the moment, we implemented what was possible
 * We'll see how to deal with that depending on how it has to be used
 */

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