/** @module ol/source/Webpart
 */
import CordovApp from '../../CordovApp'
import proj4 from 'proj4'
import {register as ol_proj_proj4_register} from 'ol/proj/proj4.js';
import * as Papa from 'papaparse';

import ol_Collection from 'ol/Collection'
import ol_source_Vector from 'ol/source/Vector'
import ol_Feature from 'ol/Feature'
import {getCenter as ol_extent_getCenter} from 'ol/extent'
import ol_format_WKT from 'ol/format/WKT'
import {bbox as ol_loadingstrategy_bbox} from 'ol/loadingstrategy'
import {tile as ol_loadingstrategy_tile} from 'ol/loadingstrategy'
import {transformExtent as ol_proj_transformExtent} from 'ol/proj'
import {createXYZ as ol_tilegrid_createXYZ} from 'ol/tilegrid'

import {ol_geom_createFromType} from 'ol-ext/geom/GeomUtils'
import ol_ext_inherits from 'ol-ext/util/ext'

/** Need proj4js to load projections
 */
if (!proj4) throw ("PROJ4 is not defined!");

/* Define projections
*/
if (!proj4.defs["EPSG:2154"]) proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
if (!proj4.defs["IGNF:LAMB93"]) proj4.defs("IGNF:LAMB93","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
if (!proj4.defs["EPSG:27572"]) proj4.defs("EPSG:27572","+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs");
if (!proj4.defs["EPSG:2975"]) proj4.defs("EPSG:2975","+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Saint-Pierre et Miquelon
if (!proj4.defs["EPSG:4467"]) proj4.defs("EPSG:4467","+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Antilles
if (!proj4.defs["EPSG:4559"]) proj4.defs("EPSG:4559","+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
if (!proj4.defs["EPSG:5490"]) proj4.defs("EPSG:5490","+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Guyane
if (!proj4.defs["EPSG:2972"]) proj4.defs("EPSG:2972","+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Mayotte
if (!proj4.defs["EPSG:EPSG:4471"]) proj4.defs("EPSG:4471","+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

ol_proj_proj4_register(proj4);

const editionCacheDir = 'FILE/layer-edition-cache/';

/** VectorWebpart
* @constructor
* @extends {ol.source.Vector}
* @trigger savestart, saveend, loadstart, loadend, overload
* @param {olx.source.WebpartOptions} options
*  @param {string} options.proxy proxy path, default none
*  @param {string} options.username authentification
*  @param {string} options.password authentification
*  @param {integer} options.maxFeatures max number of feature to load before overload, default 5000
*  @param {integer} options.maxReload max number of feature before reload (for tiled layers), default +Infinity
*  @param {featureType} options.featureType
*  @param {Object} options.filter Webpart filter, ie: {detruit:false}, default {}
*  @param {string} options.outputFormat CSV or JSON
*  @param {integer} options.tileZoom tile zoom for tiled layers (tile size are requested at tileZoom)
*  @param {integer|undefined} options.tileSize size for tiles, default 256
*  @param {ol.Collection} options.preserved collection of objects to preserve when reload
*  @param {ol.Attribution} options.attribution source attribution
*  @param {bool} options.wrapX
*  @param {bool} options.online default true : la source doit elle se charger en ligne
* @returns {VectorWebpart}
*/
const VectorWebpart = function(opt_options) {
  var options = opt_options || {};
  
  // Proxy to load features
  this.proxy_ = options.proxy;

  // Authentification
  this.username = options.username;
  this.password = options.password;

    // Source is loading
  this.tileloading_	= 0;
  this.isloading_     = false;
  if (options.featureType === undefined) {
    throw 'featureType must be defined.';
  }
  this.featureType_ 	= options.featureType;

  // Document uri
  this.featureType_.docURI = this.featureType_.wfs.replace(/\/gcms\/.*/,"/document/");

  this.maxFeatures_	= options.maxFeatures || 5000;
  this._outputformat = options.outputFormat;
  
  var crs = this.featureType_.attributes[this.featureType_.geometryName];
  crs = crs ? crs.crs : 'IGNF:LAMB93';
  this.srsName_  = crs || 'IGNF:LAMB93'; // 'EPSG:4326';

  if (!proj4.defs[this.srsName_]) {
    console.error('PROJECTION INCONNUE', this.srsName_);
  }
  
  // Filter
  this.featureFilter_ = options.filter || {};
  // Filter / deleted objects
  if (this.featureType_.attributes.detruit) {
    this.featureFilter_ = {detruit:false};
  } else if (this.featureType_.attributes.gcms_detruit) {
    this.featureFilter_ = {gcms_detruit:false};
  }
  
  // Strategy for loading source (bbox or tile)
  var strategy = options.strategy || ol_loadingstrategy_bbox;
  if (options.tileZoom) {
    this.tiled_ = true;
    this._tileGrid = ol_tilegrid_createXYZ({ minZoom: options.tileZoom, maxZoom: options.tileZoom, tileSize:options.tileSize||256  }),
    strategy = ol_loadingstrategy_tile (this._tileGrid);
  }

  if (this.tiled_) this.maxReload_ = options.maxReload;
  this.online = options.online || true;

  ol_source_Vector.call(this, {
    // Loader function => added when changes are loaded
//    loader: this.loaderFn_,
    // bbox strategy
    strategy: strategy,
    // Features
    features: new ol_Collection(),
    // ol.source.Vector attributes
    attributions: options.attribution,
    logo: options.logo,
    useSpatialIndex: true, // force to true for loading strategy tile
    wrapX: options.wrapX
  });
  
  // Lecture en cache
  this._cacheUrl = options.cacheUrl;
  this.editionCacheFile = editionCacheDir + CordovApp.File.fileName( this.featureType_.database +'-'+ this.featureType_.name + '-editions.txt');
  
  this._formatWKT = new ol_format_WKT();
  
  // Collection of feature we want to preserve when reloaded
  this.preserved_ = options.preserved || new ol_Collection();
  // Differentiel updates
  this.differentiel_ = [];
  // Inserted features
  this.insert_ = [];
  this.on ('addfeature', this.onAddFeature_.bind(this));
  // Deleted features
  this.delete_ = [];
  this.onDeleteFeature_bind = this.onDeleteFeature_.bind(this);
  this.on ('removefeature', this.onDeleteFeature_bind);
  // Modified features
  this.update_ = [];
  this.on ('changefeature', this.onUpdateFeature_.bind(this));

  // Read editions and load
  this.loadChanges()

  if (!this._cacheUrl) {
  this.setLoader(this.loaderFn_);
}
};
ol_ext_inherits(VectorWebpart, ol_source_Vector);

/** Editing states for vector features
 */
ol_Feature.State = {
  UNKNOWN: 'Unknown',
  INSERT: 'Insert',
  UPDATE: 'Update',
  DELETE: 'Delete'
};

/** Get feature state
 * @return { ol.Feature.State }
 */
ol_Feature.prototype.getState = function() {
  return this.state_ || ol_Feature.State.UNKNOWN;
};

/** Set feature state
 * @param { ol.Feature.State }
 */
ol_Feature.prototype.setState = function(state) {
  this.state_ = state;
};

/** Get list of properties updated on a feature */
ol_Feature.prototype.getUpdates = function() {
  if (!this._updates) this._updates = {};
  return this._updates;
};

/** Set list of properties updated on a feature */
ol_Feature.prototype.setUpdates = function(updates) {
  this._updates = updates;
}

/** Set an object property 
*/
const olFeatureSet = ol_Feature.prototype.set;
ol_Feature.prototype.set = function(key, val) {
  if (this.get(key) !== val) {
    olFeatureSet.apply(this, arguments);
    if (this.layer) {
      this.getUpdates()[key] = true;
    }
  }
};

/** Unset an object property
*/
const olFeatureUnset = ol_Feature.prototype.unset;
ol_Feature.prototype.unset = function(key) {
  olFeatureUnset.apply(this, arguments);
  if (this.layer) {
    this.getUpdates()[key] = true;
  }
};

/** Get number of modif in the source
*/
VectorWebpart.prototype.nbModifications = function() {
  return this.delete_.length + this.update_.length + this.insert_.length;
};

/** Load changes (differentiels) and read updates
*/
VectorWebpart.prototype.loadDifferentiels = function() {
  this.differentiel_ = [];
  if (!this._cacheUrl) {
    this.setLoader(this.loaderFn_);
    return;
  }
  console.log('loaddiff')
  // Load differentiels
  var dirUrl = this._cacheUrl + 'diff';
  CordovApp.File.listDirectory(
    dirUrl, 
    (files) => {
      var load = function() {
        var f = files.pop();
        if (!f) {
          // Start loading features
          this.setLoader(this.loaderFn_);
          this.reload();
        } else {
          CordovFile.read(
            'FILE'+ f.fullPath,
            (data)=> {
              var features = this._readFeatures(data);
              console.log('LOADING', f.fullPath, features.length);
              features.forEach((f) => this.differentiel_.push(f));
              load();
            },
            () => {
              load();
            }
          )
        }
      }.bind(this);
      load();
    },
    // Error (no changes)
    () => {
      // Start loading features
      this.setLoader(this.loaderFn_);
      this.reload();
    }
  )
};

/** Read new features in a file
*/
VectorWebpart.prototype.loadChanges = function() {
  const url = this.editionCacheFile;
  CordovApp.File.read(
    url, 
    // Success
    (data) => {
      data = JSON.parse(data);
      const features = [];
      const geometryAttribute = this.featureType_.geometryName;
      // Add save actions
      data.actions.forEach((action) => {
        // Create new feature
        const geom = action.feature[geometryAttribute];
        const f = new ol_Feature(ol_geom_createFromType (geom.type, geom.coordinates));
        delete action.feature[geometryAttribute];
        f.setProperties(action.feature)
        f.setState(action.state);
        f.setUpdates(action.updates);
        // Add feature in the lists
        switch (action.state) {
          case ol_Feature.State.INSERT: {
            this.insert_.push(f);
            features.push(f);
            break;
          }
          case ol_Feature.State.UPDATE: {
            this.update_.push(f);
            features.push(f);
            break;
          }
          case ol_Feature.State.DELETE: {
            this.delete_.push(f);
            break;
          }
        }
      });
      this.loadDifferentiels();
    },
    // Error (or no changes found)
    () => {
      this.loadDifferentiels();
    }
  );
};

/** Save new change in a cache file
* 
*/
VectorWebpart.prototype.writeChanges = function(force) {
  // Write in cache
  if (!this._writeUpdate) this._writeUpdate = 0;
  // Prevent many update at once
  if (!force) {
    this._writeUpdate++;
    setTimeout(() => { this.writeChanges(true); });
    return;
  } else {
    this._writeUpdate--;
    if (this._writeUpdate > 0) return;
  }
  this._writeUpdate = 0;

  var actions = this.getSaveActions(true);

  if (!this.editionCacheFile) return;
  var self = this;
  CordovFile.getDirectory(
    editionCacheDir, 
    function() {
        CordovApp.File.write(
          self.editionCacheFile, 
          JSON.stringify(actions),
          () => {},
          () => { console.log('ERROR: writeChanges on layer...'); }
    )},
    () => { console.log('ERROR: writeChanges on layer...'); },
    true
  );
};

/** Get layer's tile grid
 * @return { ol.tilegrid.TileGrid }
 */
VectorWebpart.prototype.getTileGrid = function() {
  return this._tileGrid;
}

/** Get the layer featureType
 * @return { featureType }
 */
VectorWebpart.prototype.getFeatureType = function() {
  return this.featureType_;
}

/** Reset edition 
 */
VectorWebpart.prototype.reset = function() {
  this.insert_ = [];
  this.delete_ = [];
  this.update_ = [];
  this.preserved_.clear();
  this.reload();
  this.writeChanges();
}

/** Force source reload
 * @warning use this function instead of clear() to avoid delete events on reload
 */
VectorWebpart.prototype.reload = function() {
  this.isloading_ = true;
  this.un ('removefeature', this.onDeleteFeature_bind);
  // Clear without event ???
  // this.getFeaturesCollection().clear(true);
  // Send event clear
  this.clear(true);
  this.on ('removefeature', this.onDeleteFeature_bind);
  this.isloading_ = false;
  this.dispatchEvent({ type:"reload", maxreload: this.maxReload_ });
  // console.log('reload',this.getProperties());
}

/** Get an action
* @param {ol.Feature} f
* @param {boolean} full true to get full feature, default false
* @return {*}
*/
VectorWebpart.prototype.getFeatureAction = function(f, full) {
  const updates = f.getUpdates();
  const a = { feature: {}, state: f.getState(), typeName: this.featureType_.name };
  if (full) {
    // Get all properties
    a.feature = f.getProperties();
    delete a.feature.geometry;
    a.updates = updates;
  } else {
    // Id
    const idName = this.featureType_.idName;
    a.feature[idName] = f.get(idName);
    // Get changed properties
    for (let i in f.getProperties()) {
      if (updates[i] || i==='gcms_fingerprint') {
        a.feature[i] = f.get(i);
      }
    }
  }
  // Get geometry
  if (full || updates.geometry) {
    const geometryAttribute = this.featureType_.geometryName;
    const geom = f.getGeometry();
    if (full) {
      a.feature[geometryAttribute] = {
        type: geom.getType(),
        coordinates: geom.getCoordinates()
      };
    } else {
      const g = geom.getGeometry().clone();
      g.transform (this.projection_, this.srsName_);
      a.feature[geometryAttribute] = this._formatWKT.writeGeometry(g);
    }
  }
  return a;
};

/** Get save actions
* @param {boolean} full true to get full feature, default false
* @return list of save actions + number of features in each states
*/
VectorWebpart.prototype.getSaveActions = function(full) {
  var self = this;
  // var idName = this.featureType_.idName;
  // var geometryAttribute = this.featureType_.geometryName;
  var actions = [];

  function getActions (t, state){
    var nb = 0;
    for (var i=0; i<t.length; i++) {
      var f = t[i];
      if (f.getState() == state) {
        const a = self.getFeatureAction(f, full);
        actions.push(a);
        nb++;
      }
    }
    return nb;
  }

  var res = {};
  res.actions = actions;
  // Insert
  res[ol_Feature.State.INSERT] = getActions (this.insert_, ol_Feature.State.INSERT);
  // Delete
  res[ol_Feature.State.DELETE] = getActions (this.delete_, ol_Feature.State.DELETE);
  // Update
  res[ol_Feature.State.UPDATE] = getActions (this.update_, ol_Feature.State.UPDATE);

  return res;
}

/** Return all update features
* @return { Array<ol.Feature> }
*/
VectorWebpart.prototype.getFeatureUpdate = function() {
  var updates = [];
  this.insert_.forEach((f) => { updates.push(f); });
  this.delete_.forEach((f) => { updates.push(f); });
  this.update_.forEach((f) => { updates.push(f); });
};

/** Remove a feature from updates
* @param {ol.Feature} feature
* @return {boolean}
*/
VectorWebpart.prototype.removeFeatureUpdate = function(feature) {
  let index;
  index = this.insert_.indexOf(feature);
  if (index > -1) {
    this.insert_.splice(index, 1);
    return true;
  }
  index = this.delete_.indexOf(feature);
  if (index > -1) {
    this.delete_.splice(index, 1);
    return true;
  }
  index = this.update_.indexOf(feature);
  if (index > -1) {
    this.update_.splice(index, 1);
    return true;
  }
  return false
};

/** Save changes
 */
VectorWebpart.prototype.save = function(onSuccess, onError) {
  var self = this;
  var actions = this.getSaveActions().actions;
  
  self.dispatchEvent({ type:"savestart" });
  // Noting to save
  if (!actions.length) {
    self.dispatchEvent({ type:"saveend" });
    return;
  }

  // Post changes
  var param = {
    "actions": JSON.stringify(actions), 
    "databases": '{"'+this.featureType_.database+'":["'+this.featureType_.name+'"]}',
    "typeName": this.featureType_.name
//    "url": this.featureType_.wfs+"transaction/"	
  };

  //var url = this.featureType_.wfstransaction.replace(/\/$/,'');
  var url = this.featureType_.wfs_transactions;
    
  if (this.proxy_) param.url = url;
  $.ajax({
    url: this.proxy_ || url,
    method: 'POST',
    data: param,
    dataType: 'xml',
    // Authentification
    /* BUG Chrome 
    username: this.username,
    password: this.password,
    */
    beforeSend: (xhr) => { 
      xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password)); 
      xhr.setRequestHeader("Accept-Language", null);
    },
    success: function(wfs) {
      const info = $(wfs).find('wfs\\:Message').text();
      const url = $(wfs).find('wfs\\:TransactionURL').text();
      if ($(wfs).find('wfs\\:SUCCESS').length) {
        // Clear history
        self.reset();
        self.dispatchEvent({ type:"saveend", error: info, transaction: url });
        if (onSuccess) onSuccess(info, url);
      } else {
        self.dispatchEvent({ type:"saveend", error: info, transaction: url });
        if (onError) onError(info, url);
      }
    },
    error: function(jqXHR, status, error) {
      console.log(error)
      self.dispatchEvent({ type:"saveend", status:status, error:error });
      if (onError) onError(error);
    }
  });
}

/**
* Triggered when a feature is added / update add actions
* @param {type} e
*/
VectorWebpart.prototype.onAddFeature_ = function(e) {
  var f = e.feature;
  f.getGeometry().on('change', () => {
    f.getUpdates().geometry = true;
  });
  if (this.isloading_) return;
  f.setState(ol_Feature.State.INSERT);
  // Add attributes according to featureType
  var atts = this.getFeatureType().attributes;
  var gname= this.getFeatureType().geometryName;
  for (var i in atts) if (i!=gname) {
    if (!f.get(i)) f.set(i,null);
  }
  this.insert_.push(e.feature);

  // Save change 
  this.writeChanges();
};

/*
* Triggered when a feature is removed / update remove actions
* @param {type} e
*/
VectorWebpart.prototype.onDeleteFeature_ = function(e) {
  if (this.isloading_) return;
  
  function removeFeature(features, f) {
    for (var i=0, l=features.length; i<l; i++) {
      if (features[i] === f) {
        features = features.splice(i, 1);
        return;
      }
    }
  }

  switch (e.feature.getState()) {
    case ol_Feature.State.INSERT:
      removeFeature (this.insert_, e.feature);
      break;
    case ol_Feature.State.UPDATE:
      removeFeature (this.update_, e.feature);
      // falls through
    default:
      this.delete_.push(e.feature);
      break;
  }
  e.feature.setState(ol_Feature.State.DELETE);

  // Save change 
  this.writeChanges();
};

/**
* Triggered when a feature is updated / update update actions
* @param {type} e
*/
VectorWebpart.prototype.onUpdateFeature_ = function(e) {
  if (this.isloading_) return;
    
  // if feature has already a state attribute (INSERT),
  // we don't need to add it in this.update_
  if (e.feature.getState() === ol_Feature.State.UNKNOWN) {
    e.feature.setState(ol_Feature.State.UPDATE);
    this.update_.push(e.feature);
  }

  // Save change 
  this.writeChanges();
};

/** Find a feature giving a fid
 *	@param {string} fid
*	@param {Array<ol.feature>} an array to search in
*	@return {ol.feature|null}
*/
VectorWebpart.prototype.findFeatureByFid = function(fid, features) {
  var idName = this.featureType_.idName;
  var l = features.length;
  for (var i=0; i<l; i++) {
    if (features[i].get(idName)===fid) {
      return features[i];
    }
  }
  return null;
}

/** Find preserved feature (updated, deleted or preserved)
 * @param {ol.Feature}
 * @private
 */
VectorWebpart.prototype.findFeature_ = function(f) {
  var idName = this.featureType_.idName;
  var fid = f.get(idName);

  // Find feature in table
  function find(features) {
    var l = features.length;
    for (var i=0; i<l; i++) {
      if (features[i].get(idName)===fid) {
        f = features[i];
        return true;
      }
    }
    return false;
  }
    
  // Allready loaded (features on tile edges)
  if (this.tiled_) {
    var p = f.getGeometry().getFirstCoordinate();
    if (find(this.getFeaturesInExtent([p[0]-0.1, p[1]-0.1, p[0]+0.1, p[1]+0.1]))) {
      return null;
    }
    //return f;
  }
  // Search deleted feature
  if (find(this.delete_)) return null;
  // Search updated features
  if (find(this.update_)) return f;
  // Search differentiel update
  if (find(this.differentiel_)) {
    console.log('find', f)
    // Deleted feature ?
    if (f.get('detruit') || f.get('gcms_detruit')) return null;
    return f;
  }
  // Search preserved features
  if (find(this.preserved_.getArray())) return f;
  // Nothing found > return initial feature
  return f;
};

/**
* Parametres du WFS
* @param {ol.extent} extent
* @param {ol.projection} projection
*/
VectorWebpart.prototype.getWFSParam = function (extent, projection) {
  var bbox = ol_proj_transformExtent(extent, projection, this.srsName_);
  var bboxStr = bbox.join(',');

  // WFS parameters
  var parameters = {
    service	: 'WFS',
    request: 'GetFeature',
    outputFormat: this._outputformat || 'JSON',
    typeName: this.featureType_.name,
    bbox: bboxStr,
    filter: JSON.stringify(this.featureFilter_),
    maxFeatures: this.maxFeatures_,
    version: '1.1.0'
  };
  if (this.proxy_) parameters.url = this.featureType_.wfs;
  return parameters;
};

/** Read features from file
* @param {*} data
*/
VectorWebpart.prototype._readFeatures = function (data, projection) {
  projection = projection || 'EPSG:3857';
  let feature;
  const features = [];
  const geometryAttribute = this.featureType_.geometryName;
  const typing = {};
  for (let i in this.featureType_.attributes) {
    typing[i] = /^Double$|^Integer$/.test(this.featureType_.attributes[i].type);
  }
  switch (this._outputformat) {
    case 'CSV': {
      data = Papa.parse(
        // DEBUG: OLD VERSION
        data.replace(/(ST_AsEWKT(.*)ASgeometrie)/, geometryAttribute), {
          dynamicTyping: typing,
          header: true 
        }
      );
      data = data.data;
      break;
    }
    default: {
      try{
        data = JSON.parse(data);
      } catch(e) { 
        onError(null, 'JSON', 'Bad JSON response'); 
        return;
      }
      break;
    }
  }
  var format = new ol_format_WKT();
  var r3d = /([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g;
  //
  for (var f=0; f<data.length; f++) {
    // CSV empty lines
    if (!data[f] || !data[f][geometryAttribute]) continue;
    // Get data
    var geom = data[f][geometryAttribute];
    // 
    if (geom.type) {
      var g = ol_geom_createFromType (geom.type, geom.coordinates);
      g.transform (this.srsName_, projection);
      feature = new ol_Feature (g);
    }
    // WKT
    else {
      geom = geom.replace (r3d, "$1 $3");
      try{
        feature = format.readFeature(geom, {
          dataProjection: this.srsName_,
          featureProjection : projection
        });
      } catch(e) {
        console.error('[BAD FORMAT] error line: ', f, data[f]);
        continue;
      }
    }
  
    var properties = data[f];
    delete properties[geometryAttribute];
    feature.setProperties(properties, true);

    features.push(feature);
  }

  return features;
};

/**
* The loader function used to load features
* @private
*/
VectorWebpart.prototype.loaderFn_ = function (extent, resolution, projection) {
  // if (resolution > this.maxResolution_) return;
  var self = this;

  // Save projection for writing
  this.projection_ = projection;

  // TODO self.srsName_
  if (!proj4.defs[this.srsName_]) {
    return;
  }

  // Reload all if maxFeatures
  if (this.maxReload_ && this.tileloading_==1 && this.getFeatures().length > this.maxReload_) {
    // console.log('clear: '+this.getFeatures().length)
    this.reload();
  }

  function onSuccess(data) {
    var features = [];
    var f0 = self._readFeatures(data, projection)
    f0.forEach((f) => {
      // Find preserved features
      var feature = self.findFeature_(f);
      if (feature) {
        features.push(feature);
      }
    })
    
    // Add new inserted features
    var l = self.insert_.length;
    for (var i=0; i<l; i++) {
      if (self.insert_[i].getState()===ol_Feature.State.INSERT) features.push( self.insert_[i] );
    }

    // Start replacing features
    self.isloading_ = true;
    if (!self.tiled_) self.getFeaturesCollection().clear();
    if (features.length) self.addFeatures(features);
    self.isloading_ = false;
    self.dispatchEvent({ type:"loadend", remains: --self.tileloading_ });
    if (data.length == self.maxFeatures_) self.dispatchEvent({ type:"overload" });
  }

  function onError(jqXHR, status, error) {
    if (status !== 'abort') {
      // console.log(jqXHR);
      self.dispatchEvent({ type:"loadend", error:error, status:status, remains:--self.tileloading_ });
    } else {
      self.dispatchEvent({ type:"loadend", remains:--self.tileloading_ });
    }
  }
  
  this.dispatchEvent({type:"loadstart", remains:++this.tileloading_ } );

  // Read in cache
  if (this._cacheUrl && !this.online) {
    var url = this._cacheUrl;
    var tgrid = this.getTileGrid();
    var tcoord = tgrid.getTileCoordForCoordAndResolution(ol_extent_getCenter(extent), resolution);
    url += tcoord.join('-');
    CordovApp.File.read(url, onSuccess, onError);
  } else {
    // WFS parameters
    var parameters = this.getWFSParam(extent, projection);

    // Abort existing request
    if (this.request_ && !this.tiled_) this.request_.abort();

    // Ajax request to get features in bbox
    this.request_ = $.ajax({
      url: this.proxy_ || this.featureType_.wfs,
      dataType: 'text', 
      data: parameters,

      // Authentification
      /* BUG Chrome 
      username: this.username,
      password: this.password,
      */
      beforeSend: (xhr) => { 
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password)); 
        xhr.setRequestHeader("Accept-Language", null);
      },
      success: onSuccess,
      // Error
      error: onError
    });
  }
};

/** Gestion des documents
 *	@param {number} document ID
*	@return {url} 
*/
VectorWebpart.prototype.getDocumentUrl = function (id) {
  return this.featureType_.docURI+"download/"+id;
}

/** Gestion des documents
 *	@param {number} document ID
*	@param {function} callback
*/
VectorWebpart.prototype.getDocument = function (id, cback) {
  if (!id) { cback(); }
    
  $.ajax({
    url: this.featureType_.docURI+"get/"+id,
    type: "GET",
    async: false,
    data: null,
    success: function(results) {
      if (!cback) return;
      if (results.status == 'OK') cback (JSON.parse(results.document));
      else cback(results);
    },
    error: function (xhr, status, error) {
      if (cback) cback ({ status:status, error:error });
    }
  });
}


/** Gestion des documents
* @param {File}
* @param {function} callback
*/
VectorWebpart.prototype.addDocument = function (file, cback) {
  var data = new FormData();
  data.append('fileToUpload', file);
  $.ajax({
    url: this.featureType_.docURI+"add",
    type: "POST",
    data: data,
    processData: false,  // jQuery don't process data
    contentType: false,   // don't send contentType
    success: function(results) {
      if (cback) cback (results);
    },
    error: function (xhr, status, error) {
      if (cback) cback ({ status:status, error:error });
    }
  });
}

/** Gestion des documents
* @param {number} document id
* @param {function} callback
*/
VectorWebpart.prototype.deleteDocument = function (id, cback) {
  $.ajax({
    url: this.featureType_.docURI+"delete/"+id,
    success: function(results) {
      if (cback) cback (results);
    },
    error: function (xhr, status, error) {
      if (cback) cback ({ status:status, error:error });
    }
  });
}

export default VectorWebpart
 