/** @module ol/layer/CollabVector
 */
import ol_layer_Vector from 'ol/layer/Vector'
import ol_View from 'ol/View'
import ol_source_Vector_CollabVector from 'cordovapp/ol/source/CollabVector'
import ol_ext_inherits from 'ol-ext/util/ext'

import ol_style_Collaboratif from 'cordovapp/ol/style/Collaboratif'

/** @class CollabVector
 * @constructor
 * @extends {ol.layer.Vector}
 * @trigger ready (when source is ready), error (connexion error)
 * @param {*} options extend ol.layer.Vector
 *	@param {string} options.database datatbase name
 *  @param {string} options.name table name
 *  @param {string} options.url service url url
 *  @param {ApiClient} options.client
 *  @param {*} source_options
 *  @param {string} source_options.cacheUrl
 * @returns {ol.source.Vector.CollabVector}
 */
const CollabVector = function(options, source_options) {
  if (!options) options = {};
  if (!source_options) source_options = {};
  this.url_ = options.url;
  this.database_ = options.database;
  this.name_ = options.name;

  options.renderMode = options.renderMode || 'image';
  ol_layer_Vector.call(this, options);
  this.set('name', options.database+':'+options.name);
  source_options.client = options.client;
  if (options.cacheUrl) {
    source_options.cacheUrl = CordovApp.File.getFileURI(options.cacheUrl) //options.cacheUrl;
    source_options.online = (source_options.online != undefined) ? source_options.online : false;
    this.set('cache', true);
    

  } 
  this.createSource(options, source_options, options.table);
};
ol_ext_inherits(CollabVector, ol_layer_Vector);

/**
 * Create the layer source when loaded
 * @param {*} source_options 
 * @param {*} table
 */
 CollabVector.prototype.createSource = function(options, source_options, table) {
  var self = this;
  source_options.table = table;
  // Check for source option
  if (options.checkSourceOptions) options.checkSourceOptions.call(this, source_options, table);

  // CollabVector source
  var vectorSource = new ol_source_Vector_CollabVector(source_options);
  this.setSource(vectorSource);
  setTimeout (function() { self.dispatchEvent({ type:"ready", source: vectorSource })}, 100);

  // CollabVector Layer
  this.set("title", table.title);

  // Set zoom level / resolution for the layer
  var v = new ol_View();
  if (table.max_zoom_level && table.max_zoom_level<20) {
    v.setZoom(table.max_zoom_level);
    this.setMinResolution(v.getResolution());
  }
  if (table.min_zoom_level || table.min_zoom_level===0) {
    v.setZoom(Math.max(table.min_zoom_level,4));
    this.setMaxResolution(v.getResolution()+1);
  }
  // Decode condition (parse string)
  if (table.style && table.style.children) {
    for (var i=0, s; s=table.style.children[i]; i++) {
      if (typeof(s.condition)==='string') {
        try { s.condition = JSON.parse(s.condition); }
        catch(e){ /* ok */ }
      }
    }
  }
  if (table.styles && table.styles.length) {
    let found = false;
    table.styles.forEach((st) => {
      if (table.style && st.id === table.style.id) found = true;
      if (st.children) {
        st.children.forEach((s) => {
          if (typeof(s.condition)==='string') {
            try { s.condition = JSON.parse(s.condition); }
            catch(e){ /* ok */ }
          }
        })
      }
    })
    if (!found && table.style) table.styles.unshift(table.style)
  }

  // Style of the feature style
  if (!options.style && ol_style_Collaboratif) {
    this.setStyle (ol_style_Webpart.getFeatureStyleFn(featureType, CordovApp.File.getFileURI(options.cacheUrl), source_options));
  }

  this.dispatchEvent({ type:"ready", source: vectorSource });
};

/** Is the layer ready
 *	@return {bool} the layer is ready (source is connected)
 */
 CollabVector.prototype.isReady = function() {
  return (this.getSource() && this.getSource().table_);
}

/**
 * Switch between online and offline mode (use cache)
 * @param {bool} online if the app is online (default is true)
 */
 CollabVector.prototype.online = function(online = true) {
  if (!this.getSource()) return;
  this.getSource().online = online;
  this.getSource().reload();
}

/** table of the layer
 *	@return {table} 
 */
 CollabVector.prototype.getTable = function() {
  if (this.isReady()) return this.getSource().table_;
  else return false;
}

/** table style of the layer
 *	@return {featureStyle} 
 */
 CollabVector.prototype.getFeatureStyle = function() {
  if (this.isReady()) return this.getSource().table_.style;
  else return {};
}

export default CollabVector
