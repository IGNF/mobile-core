import 'cordovapp/report/SketchTools.css'

import ol_Object from 'ol/Object'
import ol_ext_inherits from 'ol-ext/util/ext'

import TouchCursor from 'ol-ext/interaction/TouchCursor'
import TouchCursorSelect from 'ol-ext/interaction/TouchCursorSelect'
import TouchCursorDraw from 'ol-ext/interaction/TouchCursorDraw'
import TouchCursorModify from 'ol-ext/interaction/TouchCursorModify'
import CollabVector from 'cordovapp/ol/layer/CollabVector'
import LayerWFS from 'cordovapp/ol/layer/WFS'

/** TouchCursor interaction + ModifyFeature
 * @constructor
 * @extends {ol_Object}
 * @fires change:type
 * @param {*} options Options
 */
var SketchTools = function(report, geomTypes ) {
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
      report.cancelTracking();
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
  this.addTranslate(report);

  // Modify interaction
  this.addModify(report);

  // Draw interaction
  this.addDraw(report);

  // Start interaction
  picker.setActive(false);
  report.map.addInteraction(picker);
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
SketchTools.prototype.addDraw = function(report) {
  var draw = this.tools.draw = new TouchCursorDraw({
    className: 'draw sketch'
  });
  draw.setActive(false);
  draw.on('drawend', (e) => {
    if (e.feature && e.valid) {
      draw.removeButton('ol-button-cancel');
      var feature = report.addFeature(e.feature);
      draw.addButton({
        className: 'ol-button-cancel', 
        click: () => {
          report.addFeature(feature.added);
          draw.removeButton('ol-button-cancel');
        }
      });
     
      this.addActionOnDrawend();
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
  report.map.addInteraction(draw);
};


SketchTools.prototype.addActionOnDrawend = function(){
   console.log('drawend');
}


/** Add modify tool
 */
SketchTools.prototype.addModify = function(report) {
  var modify = this.tools.modify = new TouchCursorModify({
    className: 'sketch modify',
    source: report.selectOverlay.getSource()
  });
  modify.setActive(false);
  report.map.addInteraction(modify);
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
SketchTools.prototype.addTranslate = function(report) {
  var translating = false;

  // Translate
  var translate = this.tools.translate = new TouchCursorSelect({
    className: 'sketch translate',
    layerFilter: (l) => { 
      return l===report.selectOverlay;
    }
  });
  translate.setActive(false);
  report.map.addInteraction(translate);

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
  var addFeatureToReport = function(feature) {
    translate.removeButton('ol-button-cancel');
    feature = report.addFeature(feature);
    translate.addButton({
      className: 'ol-button-cancel', 
      click: () => {
        report.addFeature(feature.added);
        translate.removeButton('ol-button-cancel');
      }
    });
  }
  // Add a new feature 
  translate.addButton({
    className: 'ol-button-add', 
    click: () => {
      var features = translate.getMap().getFeaturesAtPixel(translate.getPixel(), {
        layerFilter: (l) => {
          return l instanceof CollabVector || l instanceof LayerWFS;
        },
        hitTolerance: 5
      });
      if (features.length == 1 && !translate.getSelection()) {
        addFeatureToReport(features[0])
      } else if (features.length) {
        var choices = {};
        for (var i in features) {
          let idName = features[i].layer.values_.table.id_name;
          choices[i] = features[i].layer.values_.title+': '+idName+' '+features[i].values_[idName];
        }

        wapp.selectDialog(choices, null, function(index) {
            addFeatureToReport(features[index]);
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
        var feature = report.addFeature(selection);
        translate.addButton({
          className: 'ol-button-cancel', 
          click: () => {
            report.addFeature(feature.removed);
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
