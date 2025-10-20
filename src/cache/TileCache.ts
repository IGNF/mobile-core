/**
 * Tile cache implementation for raster tiles
 */

import OlObject from 'ol/Object';
import ol_View from 'ol/View'
import {Extent, getCenter as ol_extent_getCenter} from 'ol/extent'
// import ol_ext_inherits from 'ol-ext/util/ext'

export class TileCache {
  constructor() {
  }

  async saveTile(minZoom: number, maxZoom: number, extent: Extent): Promise<void> {
    throw new Error('Not implemented');
  }
}