/**
 * This class defines the OpenLayers source implementation for collaborative vector layers
 * Migrated from ol/source/CollabVector.js of the CordovApp module
 */

import { ProjectionUtils } from '../utils/ProjectionUtils';

import { COLLAB_VECTOR_DEFAULT_VALUES } from "./DefaultSourceValues";

import VectorSource from 'ol/source/Vector';
import { CollabVectorSourceOptions } from './types';
import { SOURCE_ERROR_CODES } from './ErrorCodes';

export default class CollabVectorSource {

  private _projectionUtils: ProjectionUtils;
  private _options: CollabVectorSourceOptions;

  constructor(options: CollabVectorSourceOptions) {
    this._projectionUtils = new ProjectionUtils();
    this._projectionUtils.initProjections();
    this._options = options || {};
  }

  private _initCollabVectorSource(): void {
    if (this._options.client === undefined) {
      throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_CLIENT_DEFINED);
    }

    if (this._options.table === undefined) {
      throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_TABLE_DEFINED);
    }

    const table = this._options.table;
    table.docURI = table.wfs.replace(/\/gcms\/.*/, "/document/");

    this._options.maxFeatures = this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES;
    this._options.tileSize = this._options.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE

  }
}