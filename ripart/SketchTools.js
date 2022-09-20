import './SketchTools.css'

import ol_Object from 'ol/Object'
import ol_ext_inherits from 'ol-ext/util/ext'

import TouchCursor from 'ol-ext/interaction/TouchCursor'
import TouchCursorSelect from 'ol-ext/interaction/TouchCursorSelect'
import TouchCursorDraw from 'ol-ext/interaction/TouchCursorDraw'
import TouchCursorModify from 'ol-ext/interaction/TouchCursorModify'
import VectorWebpart from 'cordovapp/ol/layer/Webpart'
import LayerWFS from 'cordovapp/ol/layer/WFS'

/** TouchCursor interaction + ModifyFeature
 * @constructor
 * @extends {ol_Object}
 * @fires change:type
 * @param {*} options Options
 */
var SketchTools = function(ripart,geomTypes ) {
  ol_Object.call(this);

  if (geomTypes=== undefined ) {
     geomTypes = ['Point', 'LineString', 'Polygon'];
  }

  this.tools = [];

  // Tool picker
  var picker = this.picker = new TouchCursor({
    className: 'tools sketch',
    maxButtons: 6
  });
  // Retour
  picker.addButton({
    className: 'ol-button-back',
    click: () => {
      ripart.cancelTracking();
    }
  });
  // Draw tools
  geomTypes.forEach((t) => {
    picker.addButton({
      className: 'ol-button-geom '+t,
      click: () => {
        this.tools.draw.setType(t);
        this.tools.draw.setActive(true, picker.getPosition());
        picker.setActive(false);
      }
    })
  })
  picker.addButton({
    className: 'ol-button-modify',
    click: () => {
      this.tools.modify.setActive(true, picker.getPosition());
      picker.setActive(false);
    }
  });
  picker.addButton({
    className: 'ol-button-select',
    click: () => {
      this.tools.translate.setActive(true, picker.getPosition());
      picker.setActive(false);
    }
  });

  // Translate
  this.addTranslate(ripart);

  // Modify interaction
  this.addModify(ripart);

  // Draw interaction
  this.addDraw(ripart);

  // Start interaction
  picker.setActive(false);
  ripart.map.addInteraction(picker);
};
ol_ext_inherits(SketchTools, ol_Object);

/** Set active: activate tools or deactivate all
 * @param {boolean} active
 */
SketchTools.prototype.setActive = function(b, position) {
  this.picker.setActive(b, position);
  for (let t in this.tools) {
    this.tools[t].setActive(false)
  };
  $('body').addClass("fullscreenMap");
  this.dispatchEvent({ type: 'change:active' })
};

/** Get active */
SketchTools.prototype.getActive = function() {
  var b = this.picker.getActive();
  this.tools.forEach((t) => b = b || t.getActive());
  return b;
};

/** Add draw tool
 */
SketchTools.prototype.addDraw = function(ripart) {
  var draw = this.tools.draw = new TouchCursorDraw({
    className: 'draw sketch'
  });
  draw.setActive(false);
  draw.on('drawend', (e) => {
    if (e.feature && e.valid) {
      draw.removeButton('ol-button-cancel');
      var feature = ripart.addFeature(e.feature);
      draw.addButton({
        className: 'ol-button-cancel', 
        click: () => {
          ripart.addFeature(feature.added);
          draw.removeButton('ol-button-cancel');
        }
      });
     
    }
  });
  draw.on('change:type', (e) => {
    draw.addButton({
      className: 'ol-button-back', 
      click: () => {
        this.setActive(true, draw.getPosition());
      }
    });
  })
  draw.setType('LineString');
  ripart.map.addInteraction(draw);
};

/** Add modify tool
 */
SketchTools.prototype.addModify = function(ripart) {
  var modify = this.tools.modify = new TouchCursorModify({
    className: 'sketch modify',
    source: ripart.selectOverlay.getSource()
  });
  modify.setActive(false);
  ripart.map.addInteraction(modify);
  modify.addButton({
    className: 'ol-button-back', 
    click: () => {
      this.setActive(true, modify.getPosition());
    },
    before: true
  });
};

/** Add translate tool
 */
SketchTools.prototype.addTranslate = function(ripart) {
  var translating = false;

  // Translate
  var translate = this.tools.translate = new TouchCursorSelect({
    className: 'sketch translate',
    layerFilter: (l) => { 
      return l===ripart.selectOverlay;
    }
  });
  translate.setActive(false);
  ripart.map.addInteraction(translate);

  translate.on('change:active', () => {
    translate.removeButton('ol-button-cancel');
  });
  translate.on('dragging', () => {
    if (translating) {
      var dx = translate.getPosition()[0] - translating.position[0];
      var dy = translate.getPosition()[1] - translating.position[1];
      var g = translating.geom.clone();
      g.translate(dx, dy)
      translate.select(translating.feature);
      translating.feature.setGeometry(g);
    }
  });
  translate.on('dragend', () => {
    if (translating) {
      translate.removeButton('ol-button-cancel');
      var geom = translating.geom;
      var feature = translating.feature;
      translate.addButton({
        className: 'ol-button-cancel', 
        click: () => {
          feature.setGeometry(geom)
          translate.removeButton('ol-button-cancel');
          translate.select();
        }
      });
      translating = false;
    }
  });

  // Go back
  translate.addButton({
    className: 'ol-button-back', 
    click: () => {
      this.setActive(true, translate.getPosition());
    }
  });
  // Add a new feature 
  translate.addButton({
    className: 'ol-button-add', 
    click: () => {
      var features = translate.getMap().getFeaturesAtPixel(translate.getPixel(), {
        layerFilter: (l) => {
          return l instanceof VectorWebpart || l instanceof LayerWFS;
        },
        hitTolerance: 5
      });
      if (features.length && !translate.getSelection()) {
        translate.removeButton('ol-button-cancel');
        var feature = ripart.addFeature(features[0]);
        translate.addButton({
          className: 'ol-button-cancel', 
          click: () => {
            ripart.addFeature(feature.added);
            translate.removeButton('ol-button-cancel');
          }
        });
      }
    }
  });
  // Remove a feature from 
  translate.addButton({
    className: 'ol-button-trash', 
    click: () => {
      var selection = translate.getSelection();
      if (selection) {
        translate.removeButton('ol-button-cancel');
        selection.setStyle();
        var feature = ripart.addFeature(selection);
        translate.addButton({
          className: 'ol-button-cancel', 
          click: () => {
            ripart.addFeature(feature.removed);
            translate.removeButton('ol-button-cancel');
          }
        });
      }
    }
  });
  // Translate feature
  translate.addButton({
    className: 'ol-button-translate', 
    on: {
      pointerdown: () => {
        var selection = translate.getSelection();
        if (selection) {
          translating = {
            feature: selection,
            geom: selection.getGeometry().clone(),
            position: translate.getPosition()
          };
        } else {
          translating = false;
        }
      }
    }
  });
};


export default SketchTools
