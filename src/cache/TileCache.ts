/**
 * 
 */

import OlObject from 'ol/Object';
import ol_View from 'ol/View'
import {getCenter as ol_extent_getCenter} from 'ol/extent'
// import ol_ext_inherits from 'ol-ext/util/ext'

export class TileCache {
  constructor() {
  }

  async saveTile(): Promise<void> {
    throw new Error('Not implemented');
  }
}