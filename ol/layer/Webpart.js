/** @module ol/layer/VectorWebpart
 */
import ol_layer_Vector from 'ol/layer/Vector'
import ol_View from 'ol/View'
import ol_source_Vector_Webpart from '../source/Webpart'
import ol_ext_inherits from 'ol-ext/util/ext'

import ol_style_Webpart from '../style/Webpart'

/** @class VectorWebpart
 * @constructor
 * @extends {ol.layer.Vector}
 * @trigger ready (when source is ready), error (connexion error)
 * @param {*} options extend ol.layer.Vector
 *	@param {string} options.database datatbase name
 *  @param {string} options.name featureType name
 *  @param {string|undefined} options.proxy proxy url
 *  @param {string} options.url service url url
 *  @param {string} options.username
 *  @param {string} options.password
 * @param {*} source_options
 *  @param {string} source_options.cacheUrl
 * @returns {ol.source.Vector.Webpart}
 */
const VectorWebpart = function(options, source_options) {
  if (!options) options = {};
  if (!source_options) source_options = {};
  this.url_ = options.url.replace("/wfs","/database/") || "https://espacecollaboratif.ign.fr/gcms/database/"; // Ancien wpart "http://webpart.ign.fr/gcms/database/";
  this.proxy_ = options.proxy;
  this.database_ = options.database;
  this.name_ = options.name;

  if (!source_options.username) source_options.username = options.username;
  if (!source_options.password) source_options.password = options.password;

  options.renderMode = options.renderMode || 'image';
  ol_layer_Vector.call(this, options);
  this.set('name', options.database+':'+options.name);
  if (options.cacheUrl) {
    source_options.cacheUrl = options.cacheUrl;
    this.set('cache', true);
    this.createSource(options, source_options, options.featureType);
    // this.setZIndex(options.featureType.position);
  } else {
    const url = this.url_+this.database_+'/feature-type/'+this.name_+'.json';
    $.ajax({
      url: (this.proxy_ || url ),
      dataType: 'json', 
      // Authentification
      /*
      username: options.username,
      password: options.password,
      */
      beforeSend: (xhr) => { 
        xhr.setRequestHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password)); 
        xhr.setRequestHeader("Accept-Language", null);
      },    
      data: { url: this.proxy_ ? url : undefined },
      success: (featureType) => {
        this.createSource(options, source_options, featureType);
        // this.setZIndex(featureType.position);
      },
      error: (jqXHR, status, error) => {
        //console.log(jqXHR)
        this.dispatchEvent({ type: 'error', error: error, status: jqXHR.status, statusText: status });
      }
    });
  }

};
ol_ext_inherits(VectorWebpart, ol_layer_Vector);

/**
 * Creat the layer source when loaded
 * @param {*} source_options 
 * @param {*} featureType 
 */
VectorWebpart.prototype.createSource = function(options, source_options, featureType) {
  source_options.proxy = this.proxy_;
  source_options.featureType = featureType;
  // Check for source option
  if (options.checkSourceOptions) options.checkSourceOptions.call(this, source_options, featureType);

  // Webpart source
  var vectorSource = new ol_source_Vector_Webpart(source_options);
  this.setSource(vectorSource);

  // Webpart Layer
  this.set("title", featureType.title);

  // Set zoom level / resolution for the layer
  var v = new ol_View();
  if (featureType.maxZoomLevel && featureType.maxZoomLevel<20) {
    v.setZoom(featureType.maxZoomLevel);
    this.setMinResolution(v.getResolution());
  }
  if (featureType.minZoomLevel || featureType.minZoomLevel===0) {
    v.setZoom(Math.max(featureType.minZoomLevel,4));
    this.setMaxResolution(v.getResolution()+1);
  }
  // Decode condition (parse string)
  if (featureType.style && featureType.style.children) {
    for (var i=0, s; s=featureType.style.children[i]; i++) {
      if (typeof(s.condition)==='string') {
        try { s.condition = JSON.parse(s.condition); }
        catch(e){ /* ok */ }
      }
    }
  }
  if (featureType.styles && featureType.styles.length) {
    let found = false;
    featureType.styles.forEach((st) => {
      if (featureType.style && st.id === featureType.style.id) found = true;
      if (st.children) {
        st.children.forEach((s) => {
          if (typeof(s.condition)==='string') {
            try { s.condition = JSON.parse(s.condition); }
            catch(e){ /* ok */ }
          }
        })
      }
    })
    if (!found && featureType.style) featureType.styles.unshift(featureType.style)
  }

  // Style of the feature style
  if (!options.style && ol_style_Webpart) {
    this.setStyle (ol_style_Webpart.getFeatureStyleFn(featureType, options.cacheUrl, source_options));
  }

  this.dispatchEvent({ type:"ready", source: vectorSource });
};

/** Is the layer ready
 *	@return {bool} the layer is ready (source is connected)
 */
VectorWebpart.prototype.isReady = function() {
  return (this.getSource() && this.getSource().featureType_);
}

/** FeatureType of the layer
 *	@return {featureType} 
 */
VectorWebpart.prototype.getFeatureType = function() {
  if (this.isReady()) return this.getSource().featureType_;
  else return false;
}

/** FeatureType style of the layer
 *	@return {featureStyle} 
 */
VectorWebpart.prototype.getFeatureStyle = function() {
  if (this.isReady()) return this.getSource().featureType_.style;
  else return {};
}

export default VectorWebpart
