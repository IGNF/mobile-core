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

var radius = 8;
const symbol = {
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

// Gestion des styles
const georemStyle = function(feature) {
  switch (feature.get('ripart').statut) {
    case 'submit': return symbol.submit;
    case 'reject': return symbol.reject;
    case 'valid': return symbol.valid;
    case 'pending': 
    default: return symbol.pending;
  }
};

/** Signalement source
 * @constructor
 * @extends {ol.source.Vector}
 * @trigger loadstart, loadend, overload
 * @param {any}
 * @returns {ol_source_RIPart}
 */
const ol_source_RIPart = function(options, cache) {

  this._ripart = options.ripart;

  // Inherits
  ol_source_Vector.call(this, {
    // Loader function
    loader: this.loaderFn_,
    // bbox strategy
    strategy: ol_loadingstrategy_tile(ol_tilegrid_createXYZ({   
      minZoom: 8, 
      maxZoom: 8, 
      tileSize: 512  
    })),
    // Features
    features: new ol_Collection(),
    attributions: options.attribution,
    useSpatialIndex: true, // force to true for loading strategy tile
    wrapX: options.wrapX
  });

};
ol_ext_inherits(ol_source_RIPart, ol_source_Vector);

/** Load georems from server
 * @private
 */
ol_source_RIPart.prototype.loaderFn_ = function(extent, resolution, projection) {
  extent = ol_proj_transformExtent(extent, projection, 'EPSG:4326');

  this.dispatchEvent({ type: 'loadstart' });
  this._ripart.getGeorems({
    box: extent.join(','),
    status: ['submit', 'pending', 'pending0', 'pending1', 'pending2'],
    limit: 500
  }, (result) => {
    this.dispatchEvent({ type: 'loadend' });
    if (result) {
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
    }
  });
};

export {georemStyle}
export default ol_source_RIPart
