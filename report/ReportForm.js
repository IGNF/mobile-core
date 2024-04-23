/* global Camera */
import _T from 'cordovapp/i18n'
import CordovApp from 'cordovapp/CordovApp'
import {Report,reportStatus} from 'cordovapp/report/Report'
import {help} from 'cordovapp/cordovapp/help'
import {dialog} from 'cordovapp/cordovapp/dialog'
import {selectDialog} from 'cordovapp/cordovapp/dialog'
import {selectInput} from 'cordovapp/cordovapp/param'
import {notification} from 'cordovapp/cordovapp/dialog'
import {getActionBt} from 'cordovapp/cordovapp/page'
import {showActionBt} from 'cordovapp/cordovapp/page'

import {createFormForTheme} from 'collab-form'

import ol_layer_Vector from 'ol/layer/Vector'
import ol_source_Vector from 'ol/source/Vector'
import ol_style_Style from 'ol/style/Style'
import ol_style_Circle from 'ol/style/Circle'
import ol_style_Fill from 'ol/style/Fill'
import ol_style_Stroke from 'ol/style/Stroke'
import ol_style_FontSymbol from 'ol-ext/style/FontSymbol'
import ol_style_Shadow from 'ol-ext/style/Shadow'
import ol_Collection from 'ol/Collection'
import ol_Geolocation from 'ol/Geolocation'
import ol_control_Target from 'ol-ext/control/Target'
import ol_Feature from 'ol/Feature'
import ol_geom_Point from 'ol/geom/Point'
import WKT from 'ol/format/WKT'
import {transform as ol_proj_transform} from 'ol/proj'
import ol_interaction_Modify from 'ol/interaction/Modify'
import {click as ol_events_condition_click} from 'ol/events/condition'
import ol_interaction_Select from 'ol/interaction/Select'
import {fromLonLat as ol_proj_fromLonLat} from 'ol/proj'

import SketchTools from 'cordovapp/report/SketchTools'

import { waitDlg } from 'cordovapp/cordovapp/dialog'
import { messageDlg } from 'cordovapp/cordovapp/dialog'
import { alertDlg } from 'cordovapp/cordovapp/dialog'
import { selectInputVal } from 'cordovapp/cordovapp/param'
import { selectInputText } from 'cordovapp/cordovapp/param'
import { dataAttributes } from 'cordovapp/cordovapp/param'
import { prettifyAxiosError } from 'cordovapp/collaboratif/errorHelper'

import moment from 'moment';

import 'ol-ext/style/FontAwesomeDef'
import wapp from '../../../src/wapp'

/** @module report/ReportForm
 * @description
 * Gestion de connexion avec l'espace collaboratif pour la remontee d'informations
 * Gestion des dialogues dans l'application (connexion, formulaire de saisie d'une remontee)
 * Connexion avec la carte et les elements de l'application
````
                          +---------------------------+
                          |  Report:showFormulaire()  |
                          +---------------------------+
                                +--------v--------+
                                |  cback:onShow() |
                                +-----------------+
            ============================v===========================================
      +-------+   +--------+             +-------+                               +---------+
      + photo +   +  theme +             +  save +                               +  cancel +
      +---+---+   +--+-----+             +--+----+                               +---+-----+
           |         |                      |                                        |
+----------+-----+   |   +------------------+-------------------------+  +-----------+----------------+
| Report:photo() |   |   | Report:saveFormulaire()                    |  |  Report:cancelFormulaire() |
+----------------+   |   +--------------------------------------------+  +----------------------------+
                     |   | cback:formatGeorem()                       |
          +----------+   +-----------------------+--------------------+
          |              | Report:saveLocalRem() |                    |
+---------+--------+     +-----------------------+                    |
|Report:selectTheme|     | Report:saveParam()    |                    |
+---------+--------+     |                       |                    |
          |              | Report:onUpdate()     |  Report.onSelect() |
+----------+----------+  +-----------------------+--------------------+
|Report:formulaireAttr|  | Report:cancelFormulaire()                  |
+---------------------+  +--------------------------------------------+
````
_Arbre des appels_
*/

/**
  Creation du compte > enregistrer les actions
  @fire select, show, locate
  @param {} options
    @param {Cordowapp} options.wapp current webapp
    @param {ol.Map} options.map current map
    @param {Element} options.formElement formulaire de saisie d'un signalements, default '#fiche2 [data-role="onglet-li"][data-list="signal"]'
    @param {Element} options.countElement compteur de signalements locaux, default '.georemsCount span'
    @param {Element} options.listElement ul pour l'affichage de la liste des signalements (doit contenir un template), default '#signalements [data-role="content"]'
    @param {Element} options.profilElement Affichage du profil de contribution, default '.profil'
    @param {string} options.georemPage Page d'affichage du signalements, default '#georem'
    @param {function(georem,add)} options.onSelect selectionne une georem, add=true si nouvelle, false si selection via la liste
    @param {function(form)} options.onShow affichage du formulaire (form)
    @param {function(loc)} options.onLocate callback lors d'une localisation
    @param {function(georem, form)} options.formatGeorem formater une georem avant envoi, revoit un georem + formulaire, renvoi true si ok pour la sauvegarde, false pour annuler
    @param {String} options.messagePhoto Message pour la prise de photo (text/html)
*/
Report.prototype.initialize = function(options) {
  var self = this;

  this.map = options.map;
  this.wapp = wapp;

  // Parametres
  this.messagePhoto = options.messagePhoto;

  // List
  this.formElement = $(options.formElement);
  this.form = null;
  this.countElement = $(options.countElement);
  this.listElement = $(options.listElement);
  this.listElementTemplate = $('[data-role="template"]', options.listElement).html();
  this.profilElement = $(options.profilElement || ".profil");
  this.georemPage = $(options.georemPage || '#georem');

  // Actions (DEPRECATED, use event listener instead)
  this.onSelect = options.onSelect;
  this.onShow = options.onShow;
  this.onLocate = options.onLocate;
  // Champs preremplis
  this.formatGeorem = options.formatGeorem || function(){ return true; };

  this.stopMovingGeorem = function(self) {
    $('body').removeClass("trackingGeorem fullscreenMap");
    this.modifyInteraction.setActive(false);
    this.target.setVisible(false);
  }
  

  // New photo
  $('img', this.formElement).on('load', (e) => {
    this.dispatchEvent({
      type: 'photo',
      img: e.target
    });
  });

  // Overlay
  this.overlay = new ol_layer_Vector({
    source: new ol_source_Vector({ features: new ol_Collection() }),
    visible: false,
    style: [
      new ol_style_Style({
        image: new ol_style_Circle({ stroke: new ol_style_Stroke({ color:[255,255,255, 0.5], width:6 }), radius:15 }),
        snapToPixel: true
      }),
      new ol_style_Style({
        image: new ol_style_Circle({ stroke: new ol_style_Stroke({ color:[0, 153, 255, 1], width:3 }), radius:15 }),
        snapToPixel: true
      })]
  });
  this.overlay.setMap(this.map);

  // layer
  if (options.layer) {
    // Check if a layer is allready in the layer group
    const isInMap = function(layer, layers) {
      if (layers) {
        for (let i=0, l; l=layers[i]; i++) {
          if (l===layer) return true;
          if (l.getLayers && isInMap(layer, l.getLayers().getArray())) return true;
        }
      }
      return false;
    }
    this.layer = options.layer;
    if (options.croquis) {
      this.croquis = options.croquis;
      if (!isInMap(this.croquis, this.map.getLayers().getArray())) this.map.addLayer(this.croquis);
    }
    if (!isInMap(this.layer, this.map.getLayers().getArray())) this.map.addLayer(this.layer);
    var style;
    const defineStyle = function() {
      // Style
      var symb = {
        glyph: "fa-circle",
        form: "marker",
        fontSize: 0.6,
        fill: new ol_style_Fill({ color:[255,255,255, 1] }),
        stroke: new ol_style_Stroke( { color: "#fff", width:2 } ),
        radius: 18,
        offsetY: -18
      };
      style = {
        "local": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[80,80,80, 1], width:1.5  }) })
          )
        }),
        "submit": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[51,102,153, 1], width:1.5  }) })
          )
        }),
        "pending": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[255,102,0, 1], width:1.5  }) })
          )
        }),
        "valid": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[0,128,0, 1], width:1.5  }) })
          )
        }),
        "reject": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[192,0,0, 1], width:1.5  }) })
          )
        }),
        "dump": new ol_style_Style({
          image: new ol_style_FontSymbol(
            $.extend (symb, { fill: new ol_style_Fill({ color:[192,192,192, 1], width:1.5  }) })
          )
        }),
      };
      for (var i in style) {
        style[i]= [
          new ol_style_Style({
            image: new ol_style_Shadow( { radius:12 } )
          }),
          style[i] ];
      }
      style.pending0 = style.pending;
      style.pending1 = style.pending;
      style.pending2 = style.pending;
      style.valid0 = style.valid;
      style.reject0 = style.reject;
    }
    this.layer.setStyle (function(f) {
      if (!style) defineStyle();
      return style[f.get("georem").status] || style.local ;
    });
  }

  // Gestion du GPS
  this.geolocation = new ol_Geolocation({
    projection: "EPSG:4326", //this.map.getView().getProjection(),
    trackingOptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000
    }
  });
  this.geolocation.on('change', function() {
    this.hasLocation = true;
    this.dispatchEvent({
      type: 'locate',
      geolocation: this.geolocation,
      position: this.geolocation.getPosition(),
      accuracy: this.geolocation.getAccuracy(),
      // accuracyGeometry: this.geolocation.getAccuracyGeometry(),
      altitude: this.geolocation.getAltitude(),
      altitudeAccuracy: this.geolocation.getAltitudeAccuracy(),
      heading: this.geolocation.getHeading() || 0,
      speed: this.geolocation.getSpeed() || 0
    });
    if (typeof (this.onLocate) =="function") {
      console.error('[DEPRECATED] Report.onlocate');
      this.onLocate.call (this,{
        geolocation: this.geolocation,
        position: this.geolocation.getPosition(),
        accuracy: this.geolocation.getAccuracy(),
        // accuracyGeometry: this.geolocation.getAccuracyGeometry(),
        altitude: this.geolocation.getAltitude(),
        altitudeAccuracy: this.geolocation.getAltitudeAccuracy(),
        heading: this.geolocation.getHeading() || 0,
        speed: this.geolocation.getSpeed() || 0
      });
    }
  }.bind(this));
  this.hasLocation = false;

  // Gestion du formulaire de signalement
  var formulaire = this.formElement;
  $('.formulaire .cancel', formulaire).click(function() {
    self.cancelFormulaire('cancel');
  });

  // Tracking du centre
  this.target = new ol_control_Target({ visible: false });
  this.map.addControl (this.target);

  $('.trackingInfo', formulaire.parent()).click(this.cancelTracking.bind(this));
  // Move point
  $('.formulaire .movePosition', formulaire).click(function(){
    help.show("signaler-carte");
    var track = !self.target.getVisible();
    if (track) {
      $('body').addClass("trackingGeorem fullscreenMap");
      let geometry = $("input.geometry", formulaire).val();
      let format = new WKT();
      const g = format.readGeometry(geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: self.map.getView().getProjection()
      });
      self.map.getView().setCenter(g.flatCoordinates);
      self.modifyInteraction.setActive(true);
    } else {
      $('body').removeClass("trackingGeorem fullscreenMap");
      self.modifyInteraction.setActive(false);
    }
    self.target.setVisible(track);
  });
  self.map.getView().on("change:center", function() {
    if (this.target.getVisible()) {
      var pos = self.map.getView().getCenter();
      self.overlay.getSource().clear();
      self.overlay.getSource().addFeature( new ol_Feature (new ol_geom_Point(pos)));
      self.overlay.setVisible(true);
      pos = ol_proj_transform(pos, self.map.getView().getProjection(),'EPSG:4326');
      let wkt="POINT(" + pos[0] + " " + pos[1] + ")";
      $("input.geometry", formulaire).val(wkt);
    }
  }.bind(this));

  // Add feature to the georem
  $('.formulaire .addfeatures button', formulaire).click(() => {
    help.show("signaler-addfeatures");
    $('body').addClass("fullscreenMap");
    this.drawInteraction.setActive(false);
  });
  // Outil de deplacement de la remontee
  this.modifyInteraction = new ol_interaction_Modify({
    features: this.overlay.getSource().getFeaturesCollection(),
  });
  this.modifyInteraction.on("modifyend", function(e) {
    var p = e.features.item(0).getGeometry().getFirstCoordinate()
    self.map.getView().setCenter(p);
  });
  this.modifyInteraction.setActive(false);

  this.map.addInteraction(this.modifyInteraction);

  // Outils de selection de features a ajouter a la remontee
  var redStroke = new ol_style_Stroke({ color: "#f00", width: 2 });
  var whiteStroke = new ol_style_Stroke({ color: [255,255,255,0.8], width: 5 });
  var redFill = new ol_style_Fill({ color: [255,0,0,0.5] });

  // Calque pour la selection
  this.selectOverlay = new ol_layer_Vector({
    name: 'selectOverlay',
    source: new ol_source_Vector(),
    style:[
      new ol_style_Style ({
        image: new ol_style_Circle ({ stroke: whiteStroke, fill: redFill, radius: 5 }),
        stroke: whiteStroke,
        fill: redFill
      }),
      new ol_style_Style ({
        image: new ol_style_Circle ({ stroke: redStroke, radius: 5 }),
        stroke: redStroke
      })
    ]
  });
  this.selectOverlay.setMap(this.map);
  this.selectOverlay.getSource().on("addfeature", function(e){
    e.feature.layer = this.selectOverlay;
    e.feature.unset('georem');
  }.bind(this));

  // Outil de selection
  this.selectInteraction = new ol_interaction_Select({
    hitTolerance: 5,
    condition: ol_events_condition_click,
    filter: (f, l) => {
      if (f.layer === this.croquis) return true;
      if (f.get('georem') || (!f.layer && !l)) return false;
      return true;
    }
  });
  this.selectInteraction.setActive(false);
  // No selection if has croquis button
  if (!$('.formulaire .addCroquis button', formulaire).length) {
    this.map.addInteraction(this.selectInteraction);
  }
  this.selectInteraction.on('select', function (e){
    this.addFeature (e.selected[0]);
  }.bind(this));

  // Outils de croquis
  this.drawInteraction = new SketchTools(this);
  this.drawInteraction.on('change:active', () => {
    this.selectInteraction.setActive(!this.drawInteraction.getActive());
  })
  $('.formulaire .addCroquis button', formulaire).click(() => {
    if ($('body').hasClass('trackingGeorem')) this.cancelTracking();
    this.drawInteraction.setActive(!this.drawInteraction.getActive());
  });

  // Enregistement d'une remontee
  $('.formulaire .save', formulaire).click(function(){
    self.saveFormulaire ($('.formulaire', formulaire));
  });
  // Lancer un signalement GPS
  $('.formulaire .gps', formulaire).click(function(){
    self.saveFormulaire ($('.formulaire', formulaire), true);
  });
  // Action buttons
  $('.fa-check', getActionBt('fiche')).click(function() {
    self.saveFormulaire ($('.formulaire', formulaire));
  });
  $('#fiche').on('showpage showonglet', function() {
    showActionBt('fiche', false);
  });
  this.onUpdate();

  // Re-init
  this.cancelFormulaire();
};

/** Get indice for a local rem
 * @param {georem|number} grem the georem or an indice
 * @return {number|boolean} indice or false if doesn't exist
 */
Report.prototype.getIndice = function(grem){
  if (typeof(grem) != 'number'){
    for (var k=0; k<this.param.georems.length; k++){
      if (
        (grem.id && this.param.georems[k].id === grem.id)
        || this.param.georems[k] == grem
      ) {
        return k;
      }
    }
    return false;
  }
  else return grem;
};

/** Cancel tracking map mode */
Report.prototype.cancelTracking = function() {
  this.target.setVisible(false);
  this.drawInteraction.setActive(false);
  $('body').removeClass("trackingGeorem fullscreenMap");
};

/** delete a local rem
 * @param {Object} i  the georem or an indice
 * @param {boolean} silent set to true to prevent updating, default false
 */
Report.prototype.delLocalRem = function(i, silent) {
  i = this.getIndice(i);

  var grem = this.param.georems[i];
  if (grem){
    // Supprimer
    this.param.georems.splice(i,1);
    // Supprimer la photo correspondante
    if (grem.photos){
      for (var i in grem.photos) {
        CordovApp.File.delFile (grem.photos[i]);
      }
    }
    // remove feature from layer
    var f = this.getFeature(grem);
    if (f) this.layer.getSource().removeFeature(f);
    if (silent!==true) {
      this.saveParam();
      this.onUpdate();
    }
  }
}

/** Sauvegarde de la remontee depuis le formulaire
 * @param {} form le formulaire
*/
Report.prototype.saveFormulaire = function(form, gps) {
  var theme = selectInputVal($('[data-input="select"][data-param="theme"]', this.formElement));

  // Check valid attributes
  if (!this.formElement.hasClass('valid') || (gps && !theme)) {
    alertDlg ('Merci de choisir un thème et remplir ses attributs...');
    return;
  }

  var self = this;

  // Preformatage
  var georem =  {
    geometry: $("input.geometry", form).val(),
    sketch: undefined,
    comment: $(".comment", form).val()
  }
  let photos = [];
  $('.photo img', form).each(function(i) {
    if ($(this).data('photo')) photos.push($(this).data('photo'));
  });
  if (photos.length) georem.photos = photos;
  if (this.hasLocation) {
    var pos = this.geolocation.getPosition();
    georem.plon = pos[0];
    georem.plat = pos[1];
    georem.accuracy = this.geolocation.getAccuracy();
  }

  // Theme
  if (theme) {
    georem.themes = theme;
    georem.theme = selectInputText($('[data-input="select"][data-param="theme"]', this.formElement));
  }
  georem.community_id = this.param.profil ? this.param.profil.community_id : "-1";

  // Attributs
  var attr = {};
  if (this.form) {
    let errors = {};
    let htmlErrors = "";
    for (var i in this.form.attributes) {
      let attribute = this.form.attributes[i]
      if (!attribute.validate()) {
        errors[attribute.id] = attribute.error;
        htmlErrors += '<p>Erreur sur "' + attribute.title + '": ' +  attribute.error + '</p>';
      }
      attr[attribute.name] = attribute.getNormalizedValue();
    }

    if (Object.keys(errors).length) {
      for (let id in errors) {
        var $elt = $('.feature-form .table .feature-attribute#' + id);
        $elt.addClass('has-error');
        $('.feature-form table label[for="' + id + '"]').addClass('has-error');
        
      }
      alertDlg(htmlErrors);
      return;
    }
  }
  
  // Remplissage des attributs
  georem.attributes = JSON.stringify(attr);
  georem.attText =  $('.attributes [data-input-role="info"]', this.formElement).text();

  // Ajout des features
  var features = this.selectOverlay.getSource().getFeatures();
  if (features.length) {
    georem.sketch = this.feature2sketch(features, this.map.getView().getProjection());
  }

  // Formatage utilisateur
  var isok = this.formatGeorem.call (this, georem, form);

  // Lancement GPS
  if (gps && this.georemGPS) {
    if (!isok) {
      return;
    } else {
      this.georemGPS(georem);
      return;
    }
  }

  // oops
  if (!georem.geometry) {
    isok = false;
    alertDlg ("aucune coordonnée...");
  }

  //
  if (isok) {
    // Ajouter la remontee
    waitDlg("Enregistrement du signalement.");
    this.saveLocalRem (georem, this.formElement.data("grem"), function(e) {
      waitDlg(false);
      notification (e.info);
      if (self.onSelect) {
        self.onSelect(georem, true);
        console.warn('[DEPRECATED] Report.onSelect')
      }
      self.dispatchEvent({
        type: 'select',
        georem: georem,
        add: true
      });
      // Reset photo
      $(".photo img", self.formElement).each(function(i) {
        $(this).attr("src","").data("photo",false).hide();
      });
      $(".photo .fa-stack", self.formElement).show();
      $(".comment", form).val("");
    });
    this.cancelFormulaire('submit', georem);
  }
};

/** Save a new local rem
* @param {georem} georem the georem to save
* @param {georem} current current georem
* @param {function} cback a callback function
*/
Report.prototype.saveLocalRem = function(georem, current, cback) {
  // Forcer la date au moment de la remontee
  if (!georem.date) georem.date = (new Date()).toISODateString();

  var self = this;
  var indice, oldphotos;
  // Get current georem saved in the form (modification)
  if (current) {
    indice = this.getIndice(current);
    oldphotos = this.param.georems[indice].photos;
    this.param.georems[indice] = georem;
  }
  // No current > creat new one
  else {
    indice = (this.param.nbrem++);
    this.param.georems.push(georem);
  }
  oldphotos = oldphotos ? oldphotos : [];
  let photos = georem.photos ? georem.photos : [];

  // save photo
  let photoPromises = [];
  for (let i in photos) {
    if (oldphotos.indexOf(photos[i]) == -1) {
      photoPromises.push(CordovApp.File.moveFile (photos[i], "TMP/georem-"+indice+"photo"+i+".jpg"));
    } else {
      photoPromises.push(photos[i]);
    }
  }
  Promise.all(photoPromises).then((files) => {
    georem.photos = [];
    for (let i in files) {
      if (typeof files[i] === "string") georem.photos[i] = files[i];
      else georem.photos[i] = files[i].toURL();
    }
    self.saveParam();
    if (cback) cback ({ error:false, info:"Le signalement a été enregistré." });
  }).catch((e) => {
    georem.photos = null;
    self.saveParam();
    self.onUpdate();
    if (cback) cback ({ error:'NOPHOTO', info:"Photo introuvable..." });
  })

  for (let i in oldphotos) {
    if (photos.indexOf(oldphotos[i]) != -1) continue;
    CordovApp.File.delFile(oldphotos[i]);
  }
  if (!photos.length) {
    this.saveParam();
    if (cback) cback ({ error:false, info:"Le signalement a été enregistré." });
  }
  this.onUpdate();
}

/** Get the local rems
  * @return {Array<georem>}
*/
Report.prototype.getLocalRems = function() {
  return this.param.georems;
}

/** Post all local rems to server
 * @param {*} options
 *  @param {function} error a function that takes an error and a message on error
 *  @param {function} onPost a function called when a georem is posted
 */
Report.prototype.postLocalRems = function(options) {
  options = options || {};
  var self = this;
  var nb = this.countLocalRems();
  var n = 0;

  function postNext() {
    var p = self.countLocalRems();
    // Ended ?
    if (!p) {
      waitDlg(false);
      return;
    }
    // Send next
    for (var i=0; i<self.param.georems.length; i++) {
      var grem = self.param.georems[i];
      if (!grem.id || grem.photosToSend) {
        n++;
        self.postLocalRem (i, {
          info: "Envoi des signalements ("+n+"/"+nb+")",
          cback: postNext,
          error: options.error,
          onPost: options.onPost
        });
        break;
      }
    }
  }
  // Start sending...
  if (nb) postNext();
  else messageDlg ("Tous les signalements ont déjà été envoyés..."," ");
};

/**
 * met a jour les informations du groupe dans l element profilElement
 * @param {Object} community
 */
Report.prototype.refreshProfileInfo = function(community = "") {
  var self = this;
  wapp.userManager.getLogo(community, function(logo) {
      logo = community && community.logo_url ? community.logo_url : logo ;
      $("img", self.profilElement).attr("src", CordovApp.File.getFileURI(logo) || "");
  });

  $(".title", self.profilElement).text(community.name||"");
}


/** Post local rem to server
*/
Report.prototype.postLocalRem = function(i, options) {
  var self = this;
  if (!options) options = {};

  // Si i n'est pas un indice, c'est un signalement => chercher son indice
  if (typeof(i) != 'number') {
    for (var k=0; k<self.param.georems.length; k++) {
      if (self.param.georems[k] === i) {
        i = k;
        break;
      }
    }
  }
  // Envoyer la ieme
  var grem = self.param.georems[i];
  if (grem && !grem.id) {
    if (!options.onPost) waitDlg(options.info || "Envoi en cours...");
    self.postGeorem(grem, (response) => {
      if (!response.error) {
        self.param.georems[i] = response.data;
        if (grem.photos) self.param.georems[i].photos = grem.photos;
        if (grem.photosToSend) self.param.georems[i].photosToSend = grem.photosToSend;
        self.updateLayer();
        // Done
        if (!options.onPost) notification ("signalement envoyé au serveur ("+response.data.id+").");
        else options.onPost(i, response);
        // Post Next
        if (typeof(options.cback)=='function') options.cback(response.data);
        else if (!options.onPost) waitDlg(false);
        self.saveParam();
        self.onUpdate();
      } else {
        let e = response.data;
        if (!options.onPost) waitDlg(false);
        var msg = "Impossible d'envoyer le signalement.<br/>";
        if (!e.response && e.message) e = e.message;
        if (typeof(e) === "string") { 
          msg += e;
        } else if(e.status==='BADREM') {
          msg += "Remontée mal formatée...";
        } else if (e.code === "ERR_NETWORK") {
          msg += "Vérifiez votre connexion ou réessayez lorsque vous serez à nouveau connecté au réseau.";
        } else if (e.response && e.response.message) {
          msg += e.response.message
        } else {
          switch (e.response.status) {
            case '400': {
              msg = $('<div>').html(msg+"Erreur dans la remontée...");
              break;
            }
            case '401': {
              msg += "Vous devez être connecté...";
              break;
            }
            default: {
              msg = $('<div>').html(msg+"Vérifiez votre connexion ou réessayez lorsque vous serez à nouveau connecté au réseau.");
              break;
            }
          }
          $('<i>').addClass('fa fa-info-circle')
            .css({	position: "absolute",
                top: 0,
                right: 0,
                margin: "0.4em",
                color:"#ccc",
                'font-size': "1.5em"
              })
            .click(function(){ $(this).next().toggle(); })
            .appendTo(msg);
          let errorTxt = (e.response && e.response.data) ? e.response.data.code + " - " : "";
          errorTxt += (e.response && e.response.data.message) ? e.response.data.message : "";
          $("<i>").addClass('error')
            .html("<br/>Erreur : "+errorTxt+"</i>")
            .appendTo(msg);
        }

        if (typeof(options.error)=='function') {
          if (typeof(e) === "string") {
            e = {"message": e};
          }
          e.gremIndice = i;
          options.error(e, msg);
        } else {
          messageDlg ( msg,
            "Connexion", {
              ok: "ok",
              connect: (e.status===401) ? "Se connecter...":undefined
            },
            function(b) {
              if (b=="connect") wapp.userManager.connectDialog();
            }
          );
        }
        self.saveParam();
        self.onUpdate();
      }
    });
  } else if (grem && grem.id && grem.photosToSend && grem.photos && grem.photos.length) {
    this.postPhotosPending(grem.id, grem, options.cback);
  }
};

/** Nombre de georems en attente ou avec des images en attente d envoi
 * @param boolean countErrors compter les signalements en erreur
*/
Report.prototype.countLocalRems = function(countErrors = true) {
  var c = 0;
  for (var i=0; i<this.param.georems.length; i++) {
    if (
      (!this.param.georems[i].id && (countErrors || !this.param.georems[i].error))
      || (this.param.georems[i].id && ((countErrors && this.param.georems[i].error) || this.param.georems[i].photosToSend)) // cas des images en attente
    ) c++;
  }
  return c;
};

/** Nombre de georeps en attente
*/
Report.prototype.countLocalReps = function() {
  var c = 0;
  this.param.georems.forEach((georem) => {
    c += this.getLocalReps(georem).length;
  });
  $('.georepsCount span').text(c)
  return c;
}

/** Mettre a jour les signalements
*/
Report.prototype.updateLocalRems = function() {
  var self = this;
  var n = 0;
  var nb = self.param.georems.length;

  function next() {
    // Send next
    for (var i=n; i<self.param.georems.length; i++)	{
      var grem = self.param.georems[i];
      n++;
      if (grem.id) {
        self.updateLocalRem (i, { info: "Mise à jour ("+n+"/"+nb+")", cback: next });
        break;
      }
    }
    // Ended ?
    if (n == self.param.georems.length) {
      waitDlg(false);
      notification("Opération terminée.");
      return;
    }
  }

  // Start...
  next();
};

/** Mettre a jour un signalements
 */
Report.prototype.updateLocalRem = function(i, options) {
  var self = this;
  if (!options) options = {};

  // Chercher l'indice correspondant a une remontee
  i = this.getIndice(i);

  var grem = this.param.georems[i];
  if (grem && grem.id) {
    waitDlg(options.info || "Opération en cours...");
    this.apiClient.getReport(grem.id).then((reportResponse) => {
      let resp = reportResponse.data;
      if (resp.id === grem.id) {
        // wapp.notification ("Signalement mise à jour ("+resp.id+").");
        self.param.georems[i] = resp;
        if (grem.photos) self.param.georems[i].photos = grem.photos;
        if (grem.error) self.param.georems[i].error = grem.error; //cas ou l erreur est due a l envoi des images
        if (grem.responses) {
          self.param.georems[i].responses = grem.responses;
          // Post linked responses
          self.postLocalReps(self.param.georems[i], {
            all: true,
            cback: () => {}
          });
        }
      } else {
        grem.status = 'dump';
      }
      self.updateLayer();
      // Post Next
      if (typeof(options.cback)=='function') options.cback(resp);
      else waitDlg(false);
      self.saveParam();
      self.onUpdate();
    }).catch((e) => {
      waitDlg(false);
      let msg = '';
      if (e === "string") msg = e;
      else if (e.code === "ERR_NETWORK") msg = "Vérifiez votre connexion ou réessayez lorsque vous serez à nouveau connecté au réseau.";
      else if (e.message) msg = e.message;
      else if (e.response && e.response.data) msg = e.response.status +" - "+ e.response.data.message;
      messageDlg ("Impossible d'accéder au signalement."
            +"<i class='error'><br/>Erreur : "+msg+"</i>",
          "Connexion", {
            ok:"ok",
            connect: (e.response && e.response.status === 401) ? "Se connecter...":undefined
          },
          function(b) {
            if (b=="connect") wapp.userManager.connectDialog();
          });
      self.saveParam();
      self.onUpdate();
    });
  }
};

/** Supprimer les remontees + dialogue de confirmation / type de réponse
*/
Report.prototype.delLocalRems = function() {
  var self = this;
  selectDialog ({
      send: 'Tous les signalements envoyés',
      rep: 'Les signalements ayant eu une réponse',
      close: 'Seulement les signalements clos',
      all: 'Tous les signalements'
    },
    "",
    function(v) {
      var mess;
      switch (v) {
        case 'send': mess = 'Vous allez supprimer tous les signalements envoyés.';
          break;
        case 'rep': mess = 'Vous allez supprimer tous les signalements ayant eu au moins une réponse.';
          break;
        case 'close': mess = 'Vous allez supprimer tous les signalements clos.';
          break;
        case 'all': mess = '<i class="fa fa-exclamation-triangle fa-2x fa-fleft"></i> Attentions, vous allez supprimer tous les signalements, y compris des signalements qui n\'ont pas encore été envoyé...';
          break;
      }
      messageDlg (mess,
        "Suppression", {
          ok: "confirmer",
          cancel: "annuler"
        },
        function (b) {
          if (b=="ok") {
            var all = (v==='all');
            var t = {
              submit:["submit"],
              pending:["pending","pending0","pending1","pending2"],
              close:["valid","valid0","reject","reject0","dump"]
            };
            t.rep = t.pending.concat(t.close);
            t.send = t.rep.concat(t.submit);
            for (var i=self.param.georems.length-1; i>=0; i--) {
              var status = self.param.georems[i].status;
              var count = 0;
              // Count responses
              self.getLocalReps(self.param.georems[i]).forEach((r) => {
                if (!r.error) count++;
              });
              if (all || (!count && status && $.inArray(status, t[v])>=0)) {
                self.delLocalRem(i, true);
              }
            }
            self.saveParam();
            self.onUpdate();
          }
        }
      );
    }, {
      title: "Supprimer...",
      confirm: true
    }
  );
};

/** Get a local rem by ID */
Report.prototype.getLocalRem = function(id) {
  for (var i = 0, georem; georem = this.param.georems[i]; i++) {
    if (georem.id === id) return georem;
  }
  return null;
};

/** Add a local response to a georem + open a dialog to get informations
 * @param {*} georem
 * @param {*} options
 *  @param {function} options.cback callback when done
 */
Report.prototype.addLocalRep = function(georem, options) {
  // One response at a time
  if (georem.responses) return;
  // New response
  var tp = CordovApp.template('dialog-responseReport');
  if (!tp.length) {
    console.error('[Report::addLocalRep] No dialog "responseReport"...')
  }
  // Available status
  const available = {
    pending: reportStatus.pending,
    // pending0: reportStatus.pending0,
    pending1: reportStatus.pending1
  }
  if (this.canReply(georem)) {
    available.valid = reportStatus.valid;
    available.valid0 = reportStatus.valid0;
    available.reject = reportStatus.reject;
    available.reject0 = reportStatus.reject0;
  }
  // Select status
  let status = '';
  const select = $('span', tp).click(() => {
    selectDialog(available, null, (val) => {
      status = val;
      select.text(reportStatus[val]);
    });
  });
  dialog.show ( tp, {
    title: 'Répondre au signalement : #' + georem.id,
    classe: "responseReport",
    buttons: { cancel:"Annuler", submit:"Enregistrer"},
    callback: (bt) => {
      const content = $('textarea', tp).val();
      if (bt==='submit') {
        if (!status) {
          alertDlg('Vous devez choisir un statut à votre réponse...');
          dialog.replay();
          return;
        }
        const localRem = this.getLocalRem(georem.id);
        if (!localRem) {
          this.param.georems.push(georem);
        }
        // Add
        if (!georem.responses) georem.responses = [];
        georem.responses.push({
          id: georem.id,
          content: content,
          status: status
        })
        // Save
        this.saveParam();
        this.onUpdate();
      }
      if (options.cback) options.cback();
    }
  });
};

/** Delete local response
 * @param {*} georem
 * @param {*} georep
 * @param {*} options
 *  @param {function} options.cback callback when done
 */
Report.prototype.delLocalRep = function(georem, georep, options) {
  for (let r, k = georem.responses.length-1; r = georem.responses[k]; k--) {
    if (georep === r) {
      georem.responses.splice(k,1);
      break;
    }
  }
  if (!georem.responses.length) delete georem.responses;
  this.saveParam();
  this.onUpdate();
  if (options && options.cback) options.cback();
};

/** Post all responses for a georem
 * @param {*} georem
 * @param {*} options
 *  @param {function} options.cback callback when done
 *  @param {boolean} all post all responses, default false
 */
Report.prototype.postLocalReps = function(georem, options) {
  const reps = this.getLocalReps(georem);
  // Reset all response errors
  if (options.all) {
    reps.forEach((r) => {
      r.error = false;
    })
    options.all = false;
  }
  // Post first one with no error
  for (var i=0, r; r = reps[i]; i++) {
    if (!r.error) {
      this.postLocalRep(georem, r, {
        cback: (grem) => {
          this.postLocalReps(grem, options);
        }
      })
      return;
    }
  }
  this.countLocalReps();
  // Last one
  if (options && options.cback) options.cback(georem);
};

/** Post a local response
 * + delete response when send
 * + update associated georem
 * @param {*} gerorem
 * @param {*} georep
 * @param {*} options
 *  @param {function} options.cback callback when done
 */
Report.prototype.postLocalRep = function(georem, georep, options) {
  let body = {
    "title": georep.title || '',
    "status": georep.status,
    "content": georep.content
  };
  
  // let contentType = null;
  //   if (getPlatformId() === 'ios') {
  //     contentType = "application/x-www-form-urlencoded";
  //   } A retester: c est censé fonctionné sous ios avec un contenu json mais au besoin importer getPlatformId
  this.apiClient.addReply(georem.id, body).then((replyResponse) => {
    this.apiClient.getReport(georem.id).then((reportResponse) => {
      var grem =  reportResponse.data;
      this.delLocalRep(georem, georep, {
        cback: () => {
          const i = this.getIndice(georem);
          if (i!==false) {
            this.param.georems[i] = grem;
            this.param.georems[i].responses = georem.responses;
            let replies = this.param.georems[i].replies;
            for (var j in replies) {
              replies[j]['author_name'] = replies[j].author.username;
            }
            georep.error = false;
          } else {
            georep.error = true;
          }
          this.saveParam();
          this.onUpdate();
          if (options && options.cback) options.cback(grem);
        }
      });
    });
  }).catch((error) => {
    georep.error = true;
    this.saveParam();
    this.onUpdate();
    if (options && options.cback) {
      options.cback(georem, error);
    } else {
      var msg = "Impossible d'envoyer la réponse.<br/>";
      let prettyError = prettifyAxiosError(error);
      if (prettyError.code == 400) {
        msg += 'Réponse incorrecte...<br/>';
      }

      $("<i>").addClass('error')
        .html("<br/>Erreur : "+ prettyError['code'] + ":" + prettyError['message'] +"</i>")
        .appendTo(msg);
      
      this.wapp.alert(msg);
    }
  });
};

/** Get responses for a local georem
 * @param {*} georem
 * @return {*} a list of responses
 */
Report.prototype.getLocalReps = function(georem) {
  return georem.responses || [];
};

/** Afficher l'id de connexion dans les options
 */
Report.prototype.onUpdate = function() {
  var self = this;
  // Id connexion
  if (this.param.profil && this.param.profil.filtre.length) {
    this.formElement.addClass("connected");
  } else {
    this.formElement.removeClass("connected");
  }

  // Gestion de la liste des remontees
  var c = this.countLocalRems();
  this.countElement.text(c);
  if (c) this.countElement.parent().removeClass("hidden");
  else this.countElement.parent().addClass("hidden");

  // Affichage de la liste
  var ul = $('ul', this.listElement).html("");
  var grems = this.param.georems;
  if (!grems.length) {
    $(".nogeorem", this.listElement).show();
  } else {
    $(".nogeorem", this.listElement).hide();
    for (var i=grems.length-1; i>=0; i--) {
      var li = $('<li>').html(this.listElementTemplate)
        .addClass(grems[i].status)
        .appendTo(ul)
        .data("grem", grems[i])
        // Show georem page
        .on ("click", function() {
          self.georemShow($(this).data("grem"));
        });
      
        let gremForTemplate = grems[i];
        grems[i].pretty_opening_date = grems[i].opening_date ? moment(grems[i].opening_date).format('YYYY-MM-DD HH:mm:ss') : grems[i].pretty_opening_date;
        gremForTemplate["date"] = grems[i].date ? grems[i].date : (grems[i].pretty_opening_date ? grems[i].pretty_opening_date : null );
        gremForTemplate["replies"] = grems[i].replies ? grems[i].replies : [];
        if ( (('photos' in gremForTemplate) && gremForTemplate['photos'].length) 
          || (('attachments' in gremForTemplate) && gremForTemplate['attachments'].length)) {
            gremForTemplate["hasPhotos"] = "true";
        } else {
          gremForTemplate["hasPhotos"] = "false";
        }
      dataAttributes(li, gremForTemplate);
      this.getLocalReps(grems[i]).forEach((r) => {
        if (r.error) li.addClass('badresponse');
      });
    }
  }
  this.updateLayer();
};

/** Get feature in the layer
*/
Report.prototype.getFeature = function(grem) {
  var f;
  if (this.layer) {
    var features = this.layer.getSource().getFeatures();
    for (var i=0; f=features[i]; i++) {
      if (f.get('georem')===grem) break;
    }
  }
  return f;
};

/** Update layer according to grems
*/
Report.prototype.updateLayer = function() {
  if (this.layer) {
    var source = this.layer.getSource();
    source.clear();
    let croquis;
    if (this.croquis) {
      this.croquis.getSource().clear();
      croquis = this.croquis.getSource();
    }
    
    let format = new WKT();
    
    this.param.georems.forEach((grem) => {
      let g = null;
      if (grem.geometry) {
        g = format.readFeature(grem.geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: this.map.getView().getProjection()
        });
        g.setProperties({georem: grem});
      } else {
        g = new ol_Feature ({
          geometry: new ol_geom_Point( ol_proj_transform([grem.lon, grem.lat],'EPSG:4326', this.map.getView().getProjection()) ),
          georem: grem
        });
      }
      
      if (!g) return;

      source.addFeature(g);
      if (grem.sketch && this.croquis) {
        try {
          const features = this.sketch2feature(grem.sketch);
          features.forEach((f) => {
            f.set('georem', g);
            f.layer = this.croquis;
          });
          croquis.addFeatures(features);
        } catch(error) {
          console.log(error);
        }
      }
    });
  }
};

/** Afficher les info de la remontee
* @param {} georem la remontee a afficher
*/
Report.prototype.georemShow = function(grem) {
  var page = this.georemPage.data('grem', grem);
  this.wapp.showPage(this.georemPage.attr("id"));
  // Affichage
  dataAttributes(page, grem);

  if (grem.id) {
    $(".send", page).hide();
  } else {
    $(".send", page).show();
  }
  // Centrer la carte
  let format = new WKT();
  const g = format.readGeometry(grem.geometry, {
    dataProjection: 'EPSG:4326',
    featureProjection: this.map.getView().getProjection()
  });
  this.map.getView().setCenter(g.flatCoordinates);
  // Select georem
  if (this.onSelect) {
    this.onSelect (grem);
    console.error('[DEPRECATED] Report.onSelect')
  }
  this.dispatchEvent({
    type: 'select',
    georem: grem,
    add: false
  })
};



/** Envoyer la remontee courante
*/
Report.prototype.postCurrentRem = function() {
  this.postLocalRem (this.georemPage.data('grem'));
};

/** Supprimer le signalement courant
*/
Report.prototype.delCurrentRem = function() {
  this.wapp.hidePage();
  this.delLocalRem (this.georemPage.data('grem'));
}



/** Logout @todo to use*/
Report.prototype.logout = function() {
  this.param = { georems:[], nbrem:0 };
  if (this.layer) this.layer.getSource().clear();
  this.saveParam();
};

/** Mettre a jour le profil
  * @param {Object} g le groupe sur lequel on veut switcher
  */
Report.prototype.setProfil = function(g) {
  if (Number.isInteger(g)) g = wapp.userManager.getGroupById(g);
  if (g) {
    this.param.profil = {
      filtre: g.profile,
      groupe: g.name,
      shared_georem: g.shared_georem,
      comment: g.default_comment,
      community_id: g.id,
      logo: g.logo_url
    }
    // Themes du groupe actif
    this.param.themes = [];
    for (var i in g.profile) {
      if (g.profile[i].community_id == g.id) {
        this.param.themes = g.profile[i].themes;
        break;
      }
    }
    this.refreshProfileInfo(g);
  } else {
    this.param.profil = null;
    this.refreshProfileInfo();
  }

  // Sauvegarder
  this.saveParam();
}

/** 
 * Dialog de changement de profil
 * @param {function|undefined} onSelect function called with a group number on select
 */
Report.prototype.choixProfil = function(title, onSelect) {
  if (this.getProfil() && wapp.userManager.param.communities.length<2) return;
  var q = {};
  var listClass = {};
  var self = this;
  function libelle(g) {
    var d = $("<div>").html(g.name);
    wapp.userManager.getLogo(g, function(f){
      $("<div>").addClass("listimage")
        .append($("<img>").attr("src", CordovApp.File.getFileURI(f)))
        .prependTo(d);
    });
    return d;
  }
  for (var i=0, g; g=wapp.userManager.param.communities[i]; i++) {
    q[g.id] = libelle (g);
    listClass[g.id] = (g.active ? ' active' : ' inactive');
  }
  selectDialog(q, this.param.profil ? this.param.profil.community_id : -1, function(n) {
    if (onSelect) onSelect(Number(n));
    else self.setProfil(Number(n));
  }, { title: title, search: (wapp.userManager.param.communities.length>8), listClass: listClass, className: 'ripart_choix' });
}

/** Gestion de la page de signalement
 * @param {georem|false|undefined} grem une remontee non deja envoyee ou false vider la selection
 * @param {boolean} select autoriser la selection, default true
 */
Report.prototype.showFormulaire = function(grem, select) {
  if (grem==='gps') {
    grem = false;
    $(this.formElement).parent().addClass('gps');
  } else {
    $(this.formElement).parent().removeClass('gps');
  }
  // Show the chek in the menu
  setTimeout(function(){
    showActionBt('fiche');
  });

  var self = this;
  this.selectOverlay.getSource().clear();

  // Callback
  if (this.onShow) {
    this.onShow(this.formElement, grem);
    console.error('[DEPRECATED] Report.onshow')
  }
  this.dispatchEvent({
    type: 'show',
    form: this.formElement,
    georem: grem
  });

  // Georem en cours de modification
  var georem = (grem && grem.date && !grem.id) ? grem : false;
  this.formElement.data("grem", georem);
//	console.log(this.formElement)
  if (georem) {
    $("input.geometry", this.formElement).val(georem.geometry);
    $(".comment", this.formElement).val(georem.comment);
    // Photo
    for (let i in georem.photos){
      let count = i;
      count++
      var url = georem.photos[i];
      if (url) {
        var photoElt = $(".photo", this.formElement);
        $("#img"+count, photoElt).attr("src", CordovApp.File.getFileURI(url)+"?"+new Date().getTime())
            .data("photo",url)
            .show();
      }
    }
    if (('photos' in georem) && georem.photos.length > 3) $(".fa-stack", photoElt).hide();
    
    // Croquis
    if (georem.sketch) {
      try {
        var f = this.sketch2feature(georem.sketch);
        this.addFeature(f);
      } catch (error) {
        console.log(error);
      }
    }
  }
  //
  help.show("formulaire-signaler");
  this.formElement.addClass('formulaire');
  $('.formulaire .movePosition', this.formElement).removeClass("tracking");

  //Gestion des groupes
  var groupDom = $('[data-input="select"][data-param="group"]', this.formElement);
  $('[data-input-role="option"]', groupDom).remove();

  // Gestion des themes
  var theme = $('[data-input="select"][data-param="theme"]', this.formElement);
  $('[data-input-role="option"]', theme).remove();
  $("<div>").attr("data-input-role","option").attr("data-val", "").html("<i>choisissez un thème...</i>").appendTo(theme);
  var valdef = false;
  var nbth = 0;
  var filtre = this.param.profil ? this.param.profil.filtre : wapp.userManager.param.sharedThemes;
  for (var i in filtre) {
    let communityId = filtre[i].community_id;
    let themes = filtre[i].themes;
    for (var j in themes) {
      $("<div>").attr("data-input-role","option")
        .attr("data-val", communityId+"::"+themes[j].theme)
        .html(themes[j].theme)
        .appendTo(theme);
      if (valdef===false) valdef = communityId+"::"+themes[j].theme;
      nbth++;
    }
  }
  if (georem && georem.themes) valdef = georem.themes;
  selectInput(theme, valdef, function(c) {
    self.selectTheme(c);
  });
  this.selectTheme(valdef, georem ? georem.attributes:false, nbth!=1);
  if (nbth>1) theme.show();
  else theme.hide();

  // Comment
  let comment = this.param.profil ? this.param.profil.comment : '';
  if (!georem) $(".comment", this.formElement).val(comment);

  // Valid
  if (grem) this.formElement.addClass('valid');

  // Geometry
  let wktGeom = $("input.geometry", this.formElement).val();
  let format = new WKT();
  let feature = format.readFeature(wktGeom,  {
    dataProjection: 'EPSG:4326',
    featureProjection: self.map.getView().getProjection()
  })
  this.overlay.getSource().clear();
  this.overlay.getSource().addFeature(feature);
  this.overlay.setVisible(true);
  this.selectOverlay.setVisible(true);
  this.selectInteraction.setActive(select!==false);

  self.map.getView().setCenter(feature.getGeometry().getFirstCoordinate());

  // reset
  this.target.setVisible(false);
  this.geolocation.setTracking (true);
  this.hasLocation = false;

  $('body').removeClass("trackingGeorem fullscreenMap");
  $('.formulaire textarea, .formulaire [data-input="select"]').on("mousedown", () => {this.stopMovingGeorem(self)});

  // Start with tracking on (if not fullscreen and movePosition enabled)
  const parent = this.formElement.parent().parent();
  if (parent.outerHeight() < $(window).height() -1
  || parent.outerWidth() < $(window).width() -1) {
    var moveBt = $('.formulaire .movePosition', this.formElement);
    if (moveBt.is(':visible')) moveBt.click();
  }
};

/**
 * Vérifie qu'un theme est dans le profil utilisateur
 * @param {Object} theme ex {"nom": "Parcelles, Cadastre", "community_id": 13, "global": true, "attributes": []}
 * @param {Object} profil ex {"filtre": [{"group_id": 2, "themes": ["Test","mon thème","Parking vélo"]}], "groupe": "Groupe Test","status": "public", "comment": "Ceci est un test", "community_id": 2,"logo": "https://qlf-collaboratif.ign.fr/collaboratif-develop/document/image/95"}
 * @return {boolean} true si le theme est dans le profil false sinon
 */
Report.prototype.isThemeInProfileFilter = function(theme, profil)
{
  if (undefined == profil.filtre) {
    return false;
  }
  for (var i in profil.filtre) {
    if (theme.community_id == profil.filtre[i].group_id && profil.filtre[i].themes.indexOf(theme.nom) != -1) return true;
  }
  return false;
}

/** Selectionne un theme dans le formulaire
* @param {string} th theme par defaut
* @param {string} atts attributs par defaut
*/
Report.prototype.selectTheme = function(th, atts, prompt) {
  if (!th) th = "";
  th = th.split("::");
  var group = parseInt(th[0]);
  th = th[1];
  var themes = this.param.profil ? this.param.profil.filtre : wapp.userManager.param.activeProfile;;
  var theme = null;
  for (var i=0; i<themes.length; i++) {
    if (themes[i].community_id == group) {
      for (var j in themes[i].themes) {
        if (themes[i].themes[j].theme == th) {
          theme = themes[i].themes[j];
          break;
        }
      }
      break;
    }
  }
  var self = this;

  // Remise a jour des attributs
  this.resetFormulaireAttribut();

  if (theme) {
    if (theme.attributes.length) {
      if (atts && typeof atts == 'string') atts = JSON.parse(atts);
      this.form = createFormForTheme($(".attributes", this.formElement), "form-atts", theme, atts, "mobile");
      $(".attributes", this.formElement).show();
      this.form.init();
      $('.feature-form tr[data-type="document"]').hide();
      this.formElement.addClass('valid'); //@TODO a changer
      
      $('.formulaire input').on("focus", () => {this.stopMovingGeorem(self)});
    } else {
      // Theme seul ou pas de themes
      $(".attributes", this.formElement).hide();
      this.formElement.addClass('valid');
    }
  } else {
    this.formElement.addClass('valid');
  }
};

/** 
 * Remise a zero du formulaire
*/
Report.prototype.resetFormulaireAttribut = function() {
  this.form = null;
  this.formElement.removeClass('valid');
  $(".attributes", this.formElement).empty();
};

/** Cancel formulaire: showFormulaire (false)
 * @param {string} type submit or cancel
 */
Report.prototype.cancelFormulaire = function(type, georem) {
  if (!this.formElement.hasClass('formulaire')) return;
  this.formElement.removeClass('formulaire');
  this.overlay.setVisible(false);
  this.selectOverlay.setVisible(false);
  this.drawInteraction.setActive(false);
  this.selectInteraction.setActive(false);
  this.formElement.data("grem", false);
  this.form = null;
  // Remove tracking
  this.target.setVisible(false);
  this.geolocation.setTracking (false);
  this.hasLocation = false;
  $('body').removeClass("trackingGeorem fullscreenMap");
  this.modifyInteraction.setActive(false);
  showActionBt('fiche', false);
  if (type) {
    this.dispatchEvent({
      type: type,
      georem: georem
    });
  }
};

/** Take a photo using the camera
 * @param {boolean} noFile prevent loading file from SD card
 */
Report.prototype.photo = function(noFile, selector) {
  var self = this;
  var photoElt = $('.photo', this.formElement);
  let numSelector = 0; //pour enregistrer photo temporaire sous nom diff
  if (!selector) {
    $("img", photoElt).each(function(i) {
      numSelector++;
      if (!$(this).attr("src")) {
        selector = "#"+$(this).attr('id');
        return false;
      }
    });
  }
  
  var hasPhoto = $(selector).attr('src');
  this.wapp.getPicture(
    function(url, button) {
      if (url) {
        $(selector).attr('src', CordovApp.File.getFileURI(url)+'?'+new Date().getTime())
          .data('photo',url)
          .show();
        let countPhotos = 0;
        $("img", photoElt).each(function(i) {
          if ($(this).attr("src")) countPhotos++;
        });
        if (countPhotos > 3) $('.fa-stack', photoElt).hide();
      } else {
        if (button=='del') {
          $(selector).attr('src','')
            .data('photo',false)
            .hide();
          $('.fa-stack', photoElt).show();
        }
      }
    },
    null,
    {
      prompt: 'Ajouter une photo',
      message: this.messagePhoto,
      name: 'TMP/photo'+numSelector+'.jpg',
      buttons: hasPhoto ? { photo:'Caméra', album:'Album', del:'supprimer', cancel:'annuler' } : { photo:'Caméra', album:'Album', cancel:'annuler' },
      className: hasPhoto ? 'report photo photodel' : 'report photo '+selector,
      targetWidth: self.param.imgWidth || 1200,
      targetHeight: self.param.imgHeight || 1200,
      correctOrientation: (self.param.imgOrient!==false)
    },
    (hasPhoto || !noFile) ? undefined : Camera.PictureSourceType.CAMERA
  );
};

/** Add (or remove) a feature to the signalement
  * @param {ol_Feature | Array<ol_Feature> } features les features a ajouter
  * @return {*} a list of added/removed features
  */
Report.prototype.addFeature = function(features) {
  var result = {
    added: [],
    removed: []
  }
  if (features) {
    if (!(features instanceof Array)) features = [features];
    for (var i=0, f; f=features[i]; i++) {
      if (f.layer === this.selectOverlay) {
        delete f.layer;
        result.removed.push(f);
        this.selectOverlay.getSource().removeFeature(f);
      } else {
        result.added.unshift(f.clone());
        this.selectOverlay.getSource().addFeature(result.added[0]);
      }
    }
  }
  this.selectInteraction.getFeatures().clear();
  $(".croquis .nb", this.formElement).text(this.selectOverlay.getSource().getFeatures().length);
  return result;
};

/** Attach an event handler function for one or more events to the selected elements
  */
Report.prototype.on = function(events, handler) {
  $(document).on ('report-'+events, handler);
};

/** Remove an event handler.
  */
Report.prototype.un = function(events, handler) {
  $(document).off ('report-'+events, handler);
};

/** Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
  */
Report.prototype.once = function(events, handler) {
  $(document).one ('report-'+events, handler);
};

/** Dispatch an event.
  */
Report.prototype.dispatchEvent = function(event) {
  event.type = 'report-'+event.type;
  $(document).trigger(event);
};


export default Report
