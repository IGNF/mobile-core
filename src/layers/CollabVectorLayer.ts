/**
 * Collaborative vector layer
 */

// from old code:
// import ol_layer_Vector from 'ol/layer/Vector'
// import ol_View from 'ol/View'
// import ol_source_Vector_CollabVector from 'cordovapp/ol/source/CollabVector'
// import ol_ext_inherits from 'ol-ext/util/ext'

export class CollabVectorLayer {

  // what is a table in this context?
  async getTable(): Promise<any> {
    throw new Error('Not implemented');
  }

}