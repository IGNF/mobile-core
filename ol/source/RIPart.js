/** @module ol/source/RIPart
 */
import ol_source_Vector from 'ol/source/Vector'
import ol_Collection from 'ol/Collection'
import {tile as ol_loadingstrategy_tile} from 'ol/loadingstrategy'
import {createXYZ as ol_tilegrid_createXYZ} from 'ol/tilegrid'

import ol_Feature from 'ol/Feature'
import ol_geom_Point from 'ol/geom/Point'
import {transformExtent as ol_proj_transformExtent} from 'ol/proj'
import {fromLonLat as ol_proj_fromLonLat} from 'ol/proj'

import { ol_ext_inherits } from 'ol-ext/util/ext'

import ol_style_Style from 'ol/style/Style'
import ol_style_Circle from 'ol/style/Circle'
import ol_style_Stroke from 'ol/style/Stroke'
import ol_style_Fill from 'ol/style/Fill'
import ol_style_Text from 'ol/style/Text'

var radius = 8;
const symbol = {
  'cluster': new ol_style_Style({
    text: new ol_style_Text({
      font: 'bold 12px Sans-serif',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: 1,
      fill: new ol_style_Fill({
        color: [255,255,255]
      })
    }),
    image: new ol_style_Circle({
      radius: radius,
      fill: new ol_style_Fill({ color: [255,128,0] })
    })
  }),
  'pending': new ol_style_Style({
    image: new ol_style_Circle({
      radius: radius,
      stroke: new ol_style_Stroke({ color: [255,128,0], width: 3 }),
      fill: new ol_style_Fill({ color: [255,255,255] })
    })
  }),
  'submit': new ol_style_Style({
    image: new ol_style_Circle({
      radius: radius,
      stroke: new ol_style_Stroke({ color: [128,128,128], width: 3 }),
      fill: new ol_style_Fill({ color: [255,255,255] })
    })
  }),
  'valid': new ol_style_Style({
    image: new ol_style_Circle({
      radius: radius,
      stroke: new ol_style_Stroke({ color: [0,192,0], width: 3 }),
      fill: new ol_style_Fill({ color: [255,255,255] })
    })
  }),
  'reject': new ol_style_Style({
    image: new ol_style_Circle({
      radius: radius,
      stroke: new ol_style_Stroke({ color: [255,0,0], width: 3 }),
      fill: new ol_style_Fill({ color: [255,255,255] })
    })
  })
};
const cluster = [];

// Gestion des styles
const georemStyle = function(feature) {
  if (feature.get('ripart')) {
    switch (feature.get('ripart').statut) {
      case 'submit': return symbol.submit;
      case 'reject': return symbol.reject;
      case 'valid': return symbol.valid;
      case 'pending': 
      default: return symbol.pending;
    }
  } else if (feature.get('features')) {
    var nb = feature.get('features').length;
    if (nb<2) {
      return [ georemStyle(feature.get('features')[0]) ];
    } else {
      if (!cluster[nb]) {
        symbol.cluster.getText().setText(nb.toString());
        symbol.cluster.getImage().setRadius(Math.min(10, nb/2)+radius);
        cluster[nb] = [ symbol.cluster.clone() ];
      } 
      return cluster[nb];
    }
  } else {
    return symbol.pending;
  }
};

/** Signalement source
 * @constructor
 * @extends {ol.source.Vector}
 * @trigger loadstart, loadend, overload
 * @param {any} options
 *  @param {module:ripart/RIPart~RIPart} options.ripart 
 *  @param {string} options.attribution
 *  @param {boolean} options.wrapX
 * @param {*} cache 
 *  @param {function} saveCache a function that takes response, extent, resolution dans save response
 *  @param {function} loadCache a function that take options: { extent, resolution, success and error collback }
 * @returns {RIPartSource}
 */
const RIPartSource = function(options, cache) {

  this._ripart = options.ripart;
  this._cache = cache;
  this._tileGrid = ol_tilegrid_createXYZ({   
    minZoom: 8, 
    maxZoom: 8, 
    tileSize: 512  
  });

  // Inherits
  ol_source_Vector.call(this, {
    // Loader function
    loader: this.loaderFn_,
    // bbox strategy
    strategy: ol_loadingstrategy_tile(this._tileGrid),
    // Features
    features: new ol_Collection(),
    attributions: options.attribution,
    useSpatialIndex: true, // force to true for loading strategy tile
    wrapX: options.wrapX
  });

};
ol_ext_inherits(RIPartSource, ol_source_Vector);

/** Load georems from server
 * @private
 */
RIPartSource.prototype.loaderFn_ = function(extent0, resolution, projection) {

  const loadFeatures = function (result) {
    const features = [];
    result.forEach((r)=> {
      const p = ol_proj_fromLonLat([r.lon, r.lat]);
      const f = new ol_Feature(new ol_geom_Point(p));
      f.setProperties({ ripart: r });
      features.push(f);
    });
    this.addFeatures(features);
    if (result.length === 500) {
      this.dispatchEvent({ type: 'overload' });
    }
    //console.log(this.getFeatures().length);
  }.bind(this);

  const extent = ol_proj_transformExtent(extent0, projection, 'EPSG:4326');
  this.dispatchEvent({ type: 'loadstart' });
  this._ripart.getGeorems({
    box: extent.join(','),
    status: ['submit', 'pending', 'pending0', 'pending1', 'pending2'],
    limit: 500
  }, (result) => {
    this.dispatchEvent({ type: 'loadend' });
    // Charger le resultat
    if (result) {
      if (this._cache.saveCache) {
        this._cache.saveCache(JSON.stringify(result), this._tileGrid.getTileCoordForCoordAndResolution(extent0, resolution));
      }
      loadFeatures(result);
    } else {
      if (this._cache.loadCache) {
        this._cache.loadCache({
          tileCoord: this._tileGrid.getTileCoordForCoordAndResolution(extent0, resolution),
          success: (result) => {
            loadFeatures(JSON.parse(result));
          }
        });
      }
    }
  });
};

export {georemStyle}
export default RIPartSource
