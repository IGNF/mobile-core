/** @module ol/layer/WFS
 */
import ol_layer_Vector from 'ol/layer/Vector'
import ol_View from 'ol/View'
import { ol_ext_inherits } from 'ol-ext/util/ext'

import ol_style_Style from 'ol/style/Style'
import ol_style_Fill from 'ol/style/Fill'
import ol_style_Stroke from 'ol/style/Stroke'
import ol_style_Circle from 'ol/style/Circle'
import ol_style_Text from 'ol/style/Text'
import ol_style_FillPattern from 'ol-ext/style/FillPattern'

import { asArray as ol_color_asArray } from 'ol/color'

import ol_source_Vector_WFS from '../source/WFS'

/** VectorWFS
 * @constructor
 * @extends {ol.source.Vector}
 * @trigger ready (when source is ready), error (connexion error)
 * @param {} options
 *  @param {function} authentication function to return authentication in a callback
 *  @param {Object} geoservice l objet geoservice renvoye par le collaboratif
 * @returns {ol.source.Vector.WFS}
 */
const VectorWFS = function(options, cache) {
  if (!options) options = {};
  if (!options.geoservice.input_mask) options.geoservice.input_mask = {};
  
  var self = this;
//  var secret = "WFS Espace Collaboratif IGN";

  this.crypt = function(pwd) {
    // Encrypt in the saveparam function
    return pwd; //CryptoJS.AES.encrypt(pwd, secret).toString();
  };

  if (!options.geoservice.url) return;
  
  var cachedir = options.geoservice.url.replace(/^((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?$/,"$3").replace(/\./g,'_');
	let attributes = options.geoservice.input_mask ? options.geoservice.input_mask.attributes : null;
  ol_layer_Vector.call(this, { 
    title: options.geoservice.title,
    description: options.geoservice.description,
    visible: options.visibility,
    opacity: options.opacity,
    name: cachedir +':'+ options.geoservice.layers,
    style: options.style || new ol_style_Style_WFS(attributes),
    search : options.geoservice.input_mask ? options.geoservice.input_mask.searchAttribute : null,
    logo: options.logo
  });

  // Autentication function
  var authenticationFn = options.authentication;

  function createSource() {
    var source = new ol_source_Vector_WFS(options, cache);
    source.table_ = {
      attributes: options.geoservice.input_mask.attributes
    }
    self.setSource( source );
    setTimeout (function() { self.dispatchEvent({ type:"ready", source: source })}, 100);
    source.on('addfeature', function(e) {
      e.feature._layer = self;
    }.bind(self));
  }

  // Get capabilities
  this.set('authentication', options.username);
  if (options.getCapabilities !== false) {
    var getCapabilities = function () {
      $.ajax({
        url: options.geoservice.url,
        beforeSend: (xhr) => { 
          xhr.setRequestHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password)); 
          xhr.setRequestHeader("Accept-Language", null);
        },
        timeout: 10000,
        data: {
          service: 'WFS',
          request: 'GetCapabilities'
        },
        // Success: load response
        success: createSource,
        // Error
        error: function(jqXHR, status, error) {
          console.log('ERROR-XHR',jqXHR.status)
          // Unauthorized
          if (((jqXHR.status===0 && !options.username) || jqXHR.status===401 || jqXHR.status===500) && typeof(authenticationFn) === 'function') {
            authenticationFn(self, function(login, pwd){
              if (login) {
                options.username = login;
                self.set('authentication', options.username);
                options.password = pwd; //CryptoJS.AES.encrypt(pwd, secret).toString();
                // try again
                getCapabilities();
              } else {
                self.dispatchEvent({ type:"error", error:error, status:jqXHR.status, statusText:status });
              }
            });
          } else if (cache) {
            switch (jqXHR.status) {
              // Service unavaliable
              case 403:
              case 404:
              case 500:
              case 503:
                self.dispatchEvent({ type:"error", error:error, status:jqXHR.status, statusText:status });
                break;
              // Try to load cache anyway
              default:
                // navigator.onLine 
                createSource();
                break;
            }
          } else {
            self.dispatchEvent({ type:"error", error:error, status:jqXHR.status, statusText:status });
          }
        }
      });
    }
    getCapabilities();
  } else {
    createSource();
  }

  // Zoom level
  var v = new ol_View();
  let maxZoom = options.geoservice.max_zoom;
  let minZoom = options.geoservice.min_zoom;
	if (maxZoom && maxZoom<20) {
    v.setZoom(maxZoom);
		this.setMinResolution(v.getResolution());
	}
	if (minZoom) {
    v.setZoom(minZoom);
		this.setMaxResolution(v.getResolution());
  }
};
ol_ext_inherits(VectorWFS, ol_layer_Vector);

/** Table of the layer
*	@return {table} 
*/
VectorWFS.prototype.getTable = function()
{	if (this.getSource()) return this.getSource().table_;
	else return false;
}

/**
 * WFS Style function
 */
const ol_style_Style_WFS = function(options) {
	var fill = new ol_style_Fill({
		color: 'rgba(255,255,255,0.4)'
  });
  var stroke = new ol_style_Stroke({
		color: '#3399CC',
		width: 1.25
  });
  var defaultStyles = [
    new ol_style_Style({
        image: new ol_style_Circle({
          fill: fill,
          stroke: stroke,
          radius: 5
        }),
        fill: fill,
        stroke: stroke
      })
  ];

  // Look up table for attributes
  const lut = {};
  for (let i in options) {
    if (/^symb@/.test(options[i].title)) lut[options[i].title] = i;
  }
  function attr(name) {
    return lut[name] || name;
  }

  // Style function on feature properties
	return function(feature) {
    // Allready defined
    if (feature.wfsStyle) return feature.wfsStyle;
    // Calculate style
    if (feature.get(attr('symb@sColor'))) {
      var pattern = fill;
      const style = {
        pattern: '',
        angle: 0
      }
      style.pattern = feature.get(attr('symb@fPattern'));
      style.angle = feature.get(attr('symb@pAngle'));
      style.size = feature.get(attr('symb@pWidth'));
      style.spacing = feature.get(attr('symb@pSpace'));

      var fillColor = ol_color_asArray(feature.get(attr('symb@fColor')) || 'rgba(255,255,255,0.4)');
      if (style.pattern) {
        pattern = new ol_style_FillPattern({
          pattern: style.pattern,
          color: feature.get(attr('symb@pColor')) || 'transparent',
          fill: new ol_style_Fill({
//            color: pat2==='B1' ? 'transparent' : feature.get(attr('symb@fColor')) || 'rgba(255,255,255,0.4)'
            color: fillColor
          }),
          size: style.size || 2,
          spacing: style.spacing || 5,
          angle: style.angle
        });
      } else {
        pattern = new ol_style_Fill({
          color: fillColor
        })
      }
      var text;
      if (feature.get(attr('symb@label'))) {
        text = new ol_style_Text  ({
          text: feature.get(attr('symb@label')),
          stroke: new ol_style_Stroke({ color: feature.get(attr('symb@lColor')) || '#000', width: 4 }),
          fill: new ol_style_Fill ({ color: feature.get(attr('symb@lsColor')) || '#fff' }),
          overflow: false,
          fontSize: feature.get(attr('symb@lSize'))+'px sans-serif' || 10
        });
      }
      var dash = feature.get(attr('symb@sDash')) ? feature.get(attr('symb@sDash')).split(',') : [];
			const wfstyle = [
        new ol_style_Style({
          image: new ol_style_Circle({
            fill: fill,
            stroke: stroke,
            radius: 5
          }),
          text: text,
          fill: pattern,
          stroke: new ol_style_Stroke({
            color:  feature.get(attr('symb@sColor')) || '#3399CC',
            width: feature.get(attr('symb@sWidth')) || 1.25,
            lineDash: (dash.length>1 ? dash : undefined)
          })
        })
      ]
      feature.wfsStyle = wfstyle;
      return wfstyle;
		} else {
			return defaultStyles;
		}
	}
}
/* */ 

export default VectorWFS
