/* global Camera */
import _T from '../i18n'
import CordovApp from '../CordovApp'
import RIPart from './Ripart'
import {help} from '../cordovapp/help'
import {dialog} from '../cordovapp/dialog'
import {selectDialog} from '../cordovapp/dialog'
import {selectInput} from '../cordovapp/param'
import {notification} from '../cordovapp/dialog'
import {getActionBt} from '../cordovapp/page'
import {showActionBt} from '../cordovapp/page'

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
import {transform as ol_proj_transform} from 'ol/proj'
import ol_interaction_Modify from 'ol/interaction/Modify'
import {click as ol_events_condition_click} from 'ol/events/condition'
import ol_interaction_Select from 'ol/interaction/Select'
import {fromLonLat as ol_proj_fromLonLat} from 'ol/proj'

import SketchTools from './SketchTools'

import { waitDlg } from '../cordovapp/dialog'
import { messageDlg } from '../cordovapp/dialog'
import { alertDlg } from '../cordovapp/dialog'
import { selectInputVal } from '../cordovapp/param'
import { selectInputText } from '../cordovapp/param'
import { dataAttributes } from '../cordovapp/param'

import 'ol-ext/style/FontAwesomeDef'

/** @module ripart/RIPartForm
 * @description
 * Gestion de connexion avec l'espace collaboratif pour la remontee d'informations
 * Gestion des dialogues dans l'application (connexion, formulaire de saisie d'une remontee)
 * Connexion avec la carte et les elements de l'application
````
                          +---------------------------+
                          |  RIPart:showFormulaire()  |
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
| RIPart:photo() |   |   | RIPart:saveFormulaire()                    |  |  RIPart:cancelFormulaire() |
+----------------+   |   +--------------------------------------------+  +----------------------------+
                     |   | cback:formatGeorem()                       |
          +----------+   +-----------------------+--------------------+
          |              | RIPart:saveLocalRem() |                    |
+---------+--------+     +-----------------------+                    |
|RIPart:selectTheme|     | RIPart:saveParam()    |                    |
+---------+--------+     |                       |                    |
          |              | RIPart:onUpdate()     |  RIPart.onSelect() |
+----------+----------+  +-----------------------+--------------------+
|RIPart:formulaireAttr|  | RIPart:cancelFormulaire()                  |
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
    @param {Element} options.infoElement element pour l'info de connexion, default '#options .connect [data-input-role="info"] span.info'
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
RIPart.prototype.initialize = function(options) {
  var self = this;

  this.map = options.map;
  this.wapp = wapp;

  // Parametres
  this.messagePhoto = options.messagePhoto;

  // List
  this.infoElement = $(options.infoElement);
  this.formElement = $(options.formElement);
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

  // New photo
  $('img', this.formElement).on('load', (e) => {
    this.dispatchEvent({
      type: 'photo',
      img: e.target
    });
  });

  // Recuperation de l'utilisateur
  if (this.param.user) this.setUser (this.param.user, this.param.pwd);

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
      return style[f.get("georem").statut] || style.local ;
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
      console.error('[DEPRECATED] RIPart.onlocate');
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
      var lon = Number($("input.lon", formulaire).val());
      var lat = Number($("input.lat", formulaire).val());
      self.map.getView().setCenter(ol_proj_fromLonLat([ lon, lat ]));
      self.modifyInteraction.setActive(true);
    } else {
      $('body').removeClass("trackingGeorem fullscreenMap");
      self.modifyInteraction.setActive(false);
    }
    self.target.setVisible(track);
  });
  this.map.getView().on("change:center", function() {
    if (this.target.getVisible()) {
      var pos = self.map.getView().getCenter();
      self.overlay.getSource().clear();
      self.overlay.getSource().addFeature( new ol_Feature (new ol_geom_Point(pos)));
      self.overlay.setVisible(true);
      pos = ol_proj_transform(pos, self.map.getView().getProjection(),'EPSG:4326');
      $("input.lon", formulaire).val(pos[0].toFixed(8));
      $("input.lat", formulaire).val(pos[1].toFixed(8));
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
RIPart.prototype.getIndice = function(grem){
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
RIPart.prototype.cancelTracking = function() {
  this.target.setVisible(false);
  this.drawInteraction.setActive(false);
  $('body').removeClass("trackingGeorem fullscreenMap");
};

/** delete a local rem
 * @param {Object} i  the georem or an indice
 * @param {boolean} silent set to true to prevent updating, default false
 */
RIPart.prototype.delLocalRem = function(i, silent) {
  i = this.getIndice(i);

  var grem = this.param.georems[i];
  if (grem){
    // Supprimer
    this.param.georems.splice(i,1);
    // Supprimer la photo correspondante
    if (grem.photo){
      CordovApp.File.delFile (grem.photo);
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
RIPart.prototype.saveFormulaire = function(form, gps) {
  var theme = selectInputVal($('[data-input="select"][data-param="theme"]', this.formElement));

  // Check valid attributes
  if (!this.formElement.hasClass('valid') || (gps && !theme)) {
    alertDlg ('Merci de choisir un thème et remplir ses attributs...');
    return;
  }

  var self = this;

  // Preformatage
  var georem =  {
    lon: Number($("input.lon", form).val()),
    lat: Number($("input.lat", form).val()),
    sketch: undefined,
    comment: $(".comment", form).val(),
    photo: $('.photo img', form).data('photo') || false
  }
  if (this.hasLocation) {
    var pos = this.geolocation.getPosition();
    georem.plon = pos[0];
    georem.plat = pos[1];
    georem.accuracy = this.geolocation.getAccuracy();
  }

  // Theme
  if (theme) {
    georem.themes = '"'+theme+'"=>"1"';
    georem.theme = selectInputText($('[data-input="select"][data-param="theme"]', this.formElement));
  }
  georem.id_groupe = this.param.profil.id_groupe;

  // Attributs
  var attr = $('.attributes', this.formElement).data("vals");
  if (attr) {
    // Gestion des attributs obligatoires
    var obligatoire = '';
    $('.attributes', this.formElement).data("attributes").forEach((a) => {
      if (a.obligatoire) {
        if (attr[a.att]===undefined || attr[a.att]==='') {
          obligatoire = a.att;
        }
      }
    });
    if (obligatoire) {
      alertDlg('Vous devez renseigner l\'attribut <b><i>"'+obligatoire+'"</i></b> dans la liste des attributs.')
      return;
    }
  }

  // Remplissage des attributs
  georem.attributes = "";
  for (var i in attr) {
    var a = attr[i];
    a = (typeof(attr[i])=="boolean") ?  (a?"1":"0") : a.replace(/"/g,"''");
    georem.attributes += ',"'+theme+"::"+i+'"=>"'+a+'"';
  }
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
  if (isNaN(georem.lon) || isNaN(georem.lat)) {
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
        console.warn('[DEPRECATED] RIPart.onSelect')
      }
      self.dispatchEvent({
        type: 'select',
        georem: georem,
        add: true
      });
      // Reset photo
      $(".photo img", self.formElement).attr("src","")
            .data("photo",false)
            .hide();
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
RIPart.prototype.saveLocalRem = function(georem, current, cback) {
  // Forcer la date au moment de la remontee
  if (!georem.date) georem.date = (new Date()).toISODateString();

  var self = this;
  var indice, oldphoto;
  // Get current georem saved in the form (modification)
  if (current) {
    indice = this.getIndice(current);
    oldphoto = this.param.georems[indice].photo
    this.param.georems[indice] = georem;
  }
  // No current > creat new one
  else {
    indice = (this.param.nbrem++);
    this.param.georems.push(georem);
  }
  // save photo
  if (georem.photo && georem.photo!=oldphoto) {
    CordovApp.File.moveFile (georem.photo, "TMP/georem-"+indice+".jpg",
      function(file) {
        georem.photo = file.toURL();
        self.saveParam();
        if (cback) cback ({ error:false, info:"Le signalement a été enregistré." });
      },
      function() {
        georem.photo = false;
        self.saveParam();
        self.onUpdate();
        if (cback) cback ({ error:'NOPHOTO', info:"Photo introuvable..." });
      })
  } else {
    if (oldphoto && georem.photo!=oldphoto) CordovApp.File.delFile(oldphoto);
    this.saveParam();
    if (cback) cback ({ error:false, info:"Le signalement a été enregistré." });
  }
  this.onUpdate();
}

/** Get the local rems
  * @return {Array<georem>}
*/
RIPart.prototype.getLocalRems = function() {
  return this.param.georems;
}

/** Post all local rems to server
 * @param {*} options
 *  @param {function} error a function that takes an error and a message on error
 *  @param {function} onPost a function called when a georem is posted
 */
RIPart.prototype.postLocalRems = function(options) {
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
      if (!grem.id) {
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


/** Post local rem to server
*/
RIPart.prototype.postLocalRem = function(i, options) {
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
    self.postGeorem ( grem, function(resp,e) {
      if (e) {
        if (!options.onPost) waitDlg(false);
        var msg = "Impossible d'envoyer le signalement.<br/>";
        if (e.status==='BADREM') {
          msg += "Remontée mal formatée...";
        } else if (e.status===401) {
          msg += "Vous devez être connecté...";
        } else {
          switch (e.status) {
            case '400': {
              msg = $('<div>').html(msg+"Erreur dans la remontée...");
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
          $("<i>").addClass('error')
            .html("<br/>Erreur : "+e.status+" - "+e.statusText+"</i>")
            .appendTo(msg);
        }
        if (typeof(options.error)=='function') {
          e.gremIndice = i;
          options.error(e, msg);
        } else {
          messageDlg ( msg,
            "Connexion", {
              ok: "ok",
              connect: (e.status===401) ? "Se connecter...":undefined
            },
            function(b) {
              if (b=="connect") self.connectDialog();
            }
          );
        }
        self.saveParam();
        self.onUpdate();
      } else {
        self.param.georems[i] = resp;
        if (grem.photo) self.param.georems[i].photo = grem.photo;
        self.updateLayer();
        // Done
        if (!options.onPost) notification ("signalement envoyé au serveur ("+resp.id+").");
        else options.onPost(i, resp);
        // Post Next
        if (typeof(options.cback)=='function') options.cback(resp);
        else if (!options.onPost) waitDlg(false);
        self.saveParam();
        self.onUpdate();
      }
    });
  }
};

/** Nombre de georems en attente
 * @param boolean countErrors compter les signalements en erreur
*/
RIPart.prototype.countLocalRems = function(countErrors = true) {
  var c = 0;
  for (var i=0; i<this.param.georems.length; i++) {
    if (!this.param.georems[i].id && (countErrors || !this.param.georems[i].error)) c++;
  }
  return c;
};

/** Nombre de georeps en attente
*/
RIPart.prototype.countLocalReps = function() {
  var c = 0;
  this.param.georems.forEach((georem) => {
    c += this.getLocalReps(georem).length;
  });
  $('.georepsCount span').text(c)
  return c;
}

/** Mettre a jour les signalements
*/
RIPart.prototype.updateLocalRems = function() {
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
RIPart.prototype.updateLocalRem = function(i, options) {
  var self = this;
  if (!options) options = {};

  // Chercher l'indice correspondant a une remontee
  i = this.getIndice(i);

  var grem = this.param.georems[i];
  if (grem && grem.id) {
    waitDlg(options.info || "Opération en cours...");
    self.getGeorem (grem.id, function(resp, e) {
      if (e) {
        waitDlg(false);
        messageDlg ("Impossible d'accéder au signalement."
              +"<i class='error'><br/>Erreur : "+e.status+" - "+e.statusText+"</i>",
            "Connexion", {
              ok:"ok",
              connect: (e.status===401) ? "Se connecter...":undefined
            },
            function(b) {
              if (b=="connect") self.connectDialog();
            });
        self.saveParam();
        self.onUpdate();
      } else {
        if (resp.id === grem.id) {
          // wapp.notification ("Signalement mise à jour ("+resp.id+").");
          self.param.georems[i] = resp;
          if (grem.photo) self.param.georems[i].photo = grem.photo;
          if (grem.responses) {
            self.param.georems[i].responses = grem.responses;
            // Post linked responses
            self.postLocalReps(self.param.georems[i], {
              all: true,
              cback: () => {}
            });
          }
        } else {
          grem.statut = 'dump';
        }
        self.updateLayer();
        // Post Next
        if (typeof(options.cback)=='function') options.cback(resp);
        else waitDlg(false);
        self.saveParam();
        self.onUpdate();
      }
    },{
      croquis: options.croquis!==false
    });
  }
};

/** Supprimer les remontees + dialogue de confirmation / type de réponse
*/
RIPart.prototype.delLocalRems = function() {
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
              var statut = self.param.georems[i].statut;
              var count = 0;
              // Count responses
              self.getLocalReps(self.param.georems[i]).forEach((r) => {
                if (!r.error) count++;
              });
              if (all || (!count && statut && $.inArray(statut, t[v])>=0)) {
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
RIPart.prototype.getLocalRem = function(id) {
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
RIPart.prototype.addLocalRep = function(georem, options) {
  // One response at a time
  if (georem.responses) return;
  // New response
  var tp = CordovApp.template('dialog-responseRIPart');
  if (!tp.length) {
    console.error('[RIPart::addLocalRep] No dialog "responseRIPart"...')
  }
  // Available status
  const available = {
    pending: RIPart.status.pending,
    // pending0: RIPart.status.pending0,
    pending1: RIPart.status.pending1
  }
  if (georem.autorisation === 'RW+') {
    available.valid = RIPart.status.valid;
    available.valid0 = RIPart.status.valid0;
    available.reject = RIPart.status.reject;
    available.reject0 = RIPart.status.reject0;
  }
  // Select status
  let status = '';
  const select = $('span', tp).click(() => {
    selectDialog(available, null, (val) => {
      status = val;
      select.text(RIPart.status[val]);
    });
  });
  dialog.show ( tp, {
    title: 'Répondre au signalement : #' + georem.id,
    classe: "responseRIPart",
    buttons: { cancel:"Annuler", submit:"Enregistrer"},
    callback: (bt) => {
      const comment = $('textarea', tp).val();
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
          comment: comment,
          statut: status
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
RIPart.prototype.delLocalRep = function(georem, georep, options) {
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
RIPart.prototype.postLocalReps = function(georem, options) {
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
RIPart.prototype.postLocalRep = function(georem, georep, options) {
  georep.id = georem.id;
  this.postGeorep(georep, (grem, error) => {
    if (!error) {
      this.delLocalRep(georem, georep, {
        cback: () => {
          const i = this.getIndice(georem);
          if (i!==false) {
            this.param.georems[i] = grem;
            this.param.georems[i].responses = georem.responses;
            georep.error = false;
          } else {
            georep.error = true;
          }
          this.saveParam();
          this.onUpdate();
          if (options && options.cback) options.cback(grem);
        }
      });
      return;
    } else {
      georep.error = true;
      this.saveParam();
      this.onUpdate();
      if (options && options.cback) {
        options.cback(georem, error);
      } else {
        var msg = "Impossible d'envoyer la réponse.<br/>";
        if (error.status==0) {
          msg = $('<div>').html(msg+"Vérifiez votre connexion ou réessayez lorsque vous serez à nouveau connecté au réseau.");
        } else {
          msg = $('<div>').html(msg+"Réponse incorrecte...");
        }
        $("<i>").addClass('error')
          .html("<br/>Erreur : "+error.status+" - "+error.statusText+"</i>")
          .appendTo(msg);
        this.wapp.alert(msg);
      }
    }
  });
};

/** Get responses for a local georem
 * @param {*} georem
 * @return {*} a list of responses
 */
RIPart.prototype.getLocalReps = function(georem) {
  return georem.responses || [];
};

/** Afficher l'id de connexion dans les options
 */
RIPart.prototype.onUpdate = function() {
  var self = this;

  // Id connexion
  if (this.isConnected()) {
    this.infoElement
      .html(this.param.user+" / &#x25cf;&#x25cf;&#x25cf;&#x25cf;&#x25cf;")
      .parent().addClass("connected");
    this.formElement.addClass("connected");
  } else {
    this.infoElement.parent().removeClass("connected");
    this.formElement.removeClass("connected");
  }

  // Affichage des groupes
  /*
  var profil = this.param.profil || {};
  $("img", this.profilElement).attr("src", profil.logo || "");
  $(".title", this.profilElement).text(profil.name || "");
  */

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
        .addClass(grems[i].statut)
        .appendTo(ul)
        .data("grem", grems[i])
        // Show georem page
        .on ("click", function() {
          self.georemShow($(this).data("grem"));
        });
      dataAttributes(li, grems[i]);
      this.getLocalReps(grems[i]).forEach((r) => {
        if (r.error) li.addClass('badresponse');
      });
    }
  }
  this.updateLayer();
};

/** Get feature in the layer
*/
RIPart.prototype.getFeature = function(grem) {
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
RIPart.prototype.updateLayer = function() {
  if (this.layer) {
    var source = this.layer.getSource();
    source.clear();
    let croquis;
    if (this.croquis) {
      this.croquis.getSource().clear();
      croquis = this.croquis.getSource();
    }
    this.param.georems.forEach((grem) => {
      const g = new ol_Feature ({
        geometry: new ol_geom_Point( ol_proj_transform([grem.lon, grem.lat],'EPSG:4326', this.map.getView().getProjection()) ),
        georem: grem
      });
      source.addFeature(g);
      if (grem.sketch && this.croquis) {
        const features = this.sketch2feature(grem.sketch);
        features.forEach((f) => {
          f.set('georem', g);
          f.layer = this.croquis;
        });
        croquis.addFeatures(features);
      }
    });
  }
};

/** Afficher les info de la remontee
* @param {} georem la remontee a afficher
*/
RIPart.prototype.georemShow = function(grem) {
  var page = this.georemPage.data('grem', grem);
  this.wapp.showPage(this.georemPage.attr("id"));
  // Affichage
  dataAttributes(page, grem);
  /*
  // Gestion de la photo
  if (grem.photo) $(".photo", page).attr('src', grem.photo).show();
  else $(".photo", page).attr('src', "").hide();
  */
  if (grem.id) {
    $(".send", page).hide();
  } else {
    $(".send", page).show();
  }
  // Centrer la carte
  this.map.getView().setCenter (ol_proj_fromLonLat([ grem.lon, grem.lat ]));
  // Select georem
  if (this.onSelect) {
    this.onSelect (grem);
    console.error('[DEPRECATED] RIPart.onSelect')
  }
  this.dispatchEvent({
    type: 'select',
    georem: grem,
    add: false
  })
};



/** Envoyer la remontee courante
*/
RIPart.prototype.postCurrentRem = function() {
  this.postLocalRem (this.georemPage.data('grem'));
};

/** Supprimer le signalement courant
*/
RIPart.prototype.delCurrentRem = function() {
  this.wapp.hidePage();
  this.delLocalRem (this.georemPage.data('grem'));
}

/** Dialog de connexion a l'espace collaboratif
* @param {} options
*	- onConnect {function} a function called when connected/deconnected
*	- onShow {function} a function called when the dialog is shown
*	- onQuit {function} a function called when the dialog is closed
*	- onError {function} a function called when an error occures
*/
RIPart.prototype.connectDialog = function (options) {
  var self = this;
  options = options || {};
  var tp = CordovApp.template('dialog-connectripart');
  var nom = $(".nom",tp);
  var pwd = $(".pwd",tp);
  dialog.show ( tp, {
    title:"Connexion", 
      classe: "connect", 
      buttons: { cancel:"Annuler", deconnect: "Déconnexion", submit:"Connexion"},
      callback: function(bt) {
        if (bt == "submit") {
          waitDlg("Connexion au serveur...");
          self.setUser (nom.val().trim(), pwd.val().trim(), true);
          self.checkUserInfo ( 
            options.onConnect, 
            (typeof (options.onError) == "function") ? options.onError : null,
            function() { 
              if (options.page) setTimeout(function(){ this.wapp.showPage(options.page); });
              waitDlg(false); 
            }
          );
        } 
        else if (bt=="deconnect") {
          self.deconnect()
          if (typeof (options.onConnect) == "function") options.onConnect({connected:false});
        }
        if (typeof (options.onQuit) == "function") options.onQuit({ dialog:tp, target: this });
        self.onUpdate();
      }
    });
  nom.focus().val(this.getUser());
  pwd.val(this.getUser(1))
  if (typeof (options.onShow) == "function") options.onShow({ dialog:tp, target: this });
  self.saveParam();
};

/** Deconnect current user
*/
const deconnect = RIPart.prototype.deconnect;
RIPart.prototype.deconnect = function() {
  deconnect.call(this);
  $("img.logo").attr("src","img/ign.png");
  $(".userinfo").html("Espace collaboratif");
  /*
  // Clear credentials
  var win = window.open('logout.html','_blank','clearsessioncache=yes,hidden=yes');
  if (win) setTimeout(function(){ win.close(); }, 100);
  */
};

/** Check user info : getUserInfo + save informations
  * @param {function} success on success callback
  * @param {function} fail on fail callback
  * @param {function} allways callback
  */
RIPart.prototype.checkUserInfo = function(success, fail, allways) {
  var self = this;

  if (typeof(success) != "function") {
    success = function() {
      notification(_T("Connecté au service..."),"2s")
    }
  }
  if (typeof(fail) != "function") {
    fail = function(error) {
      switch (error.status) {
        case 401: {
          alertDlg ("Utilisateur inconnu.","Accès interdit");
          break;
        }
        default: {
          alertDlg (error.statusText);
          break;
        }
      }
    }
  }

  // Get layer by name
  const getLayer = function(idgroupe,lname) {
    var groupes = self.param.groupes;
    for (var i=0, g; g=groupes[i]; i++) {
      if (idgroupe===g.id_groupe) {
        for (var j=0, l; l=g.layers[j]; j++) {
          if (l.nom === lname) return l;
        }
      }
    }
    return null;
  };

  this.getUserInfo (function(rep, error) {
    var i, g;
    if (error) {
      rep = {};
    } else {
      // offline mode
      self.param.offline = rep.offline;
      var groupes = self.param.groupes;
      self.param.groupes = rep.groupes;
      if (groupes) {
        for (i=0; g=groupes[i]; i++) {
          for(var j=0, l; l=g.layers[j]; j++) {
            if (l.username) {
              var layer = getLayer(g.id_groupe, l.nom);
              if (layer) {
                layer.username = l.username;
                layer.password = l.password;
              }
            }
          }
        }
      }
    }
    // allways trigger function
    if (typeof(allways)==='function') allways(rep, error);
    // Trigger function
    if (error) {
      if (error.status===401) {
        self.deconnect();
        self.setProfil(null);
      } else {
        if (self.param.profil) self.setProfil(self.param.profil.id_groupe);
      }
      fail(error);
    } else {
      // Recherche du profil :
      // Themes globaux
      if (rep.themes) {
        self.param.themes = [];
        var t;
        for (i=0; t=rep.themes[i]; i++){
          if (t.global) self.param.themes.push(t);
        }
      }
      // profil courant
      self.param.siteProfil = rep.profil;
      if (self.param.profil && self.param.profil.id_groupe) {
        self.setProfil(self.param.profil.id_groupe);
      }
      // Profil du site
      else if (rep.profil && rep.profil.id_groupe) {
        self.setProfil(rep.profil.id_groupe);
      }
      // Par defaut, premier groupe de l'utilisateur
      else if (self.param.groupes && self.param.groupes.length) {
        self.setProfil(self.param.groupes[0].id_groupe);
      }
      success(rep);
    }
    self.saveParam();
  });
};

/** Mettre a jour le profil
  * @param {} id_goupe identifiant du groupe
  */
RIPart.prototype.setProfil = function(id_groupe) {
  const g = this.getGroupById(id_groupe);
//  if (!g || !g.active) return;
  if (g) {
    this.param.profil = {
      filtre: g.filter,
      groupe: g.nom,
      status: g.status,
      comment: g.commentaire_georem,
      id_groupe: id_groupe,
      logo: g.logo
    }
    // Themes
    if (!this.param.themes) this.param.themes = [];
    // Conserver les themes globaux
    for (var i=this.param.themes.length-1; i>=0; i--) {
      var th = this.param.themes[i];
      if (!th.global || th.id_groupe===id_groupe) {
        this.param.themes.splice(i,1);
      }
    }
    // Themes du groupe
    for (var j=0, thg; thg = g.themes[j]; j++) {
      this.param.themes.push(thg);
    }
  } else {
    if (id_groupe===null) this.param.profil = null;
    else this.param.profil = {};
  }
  this.getLogo(this.param.profil, function(logo) {
    var groupe = this.param.profil ? this.param.profil.groupe : "";
    $(".title", this.profilElement).text(groupe||"");
    logo = this.param.profil && this.param.profil.logo ? this.param.profil.logo : logo ;
    $("img", this.profilElement).attr("src", CordovApp.File.getFileURI(logo) || "");

    // Show user info
    $("img.logo").attr("src", CordovApp.File.getFileURI(logo) || "img/ign.png");
 
    var info = (groupe ? groupe+"<br/>": "")
      + (this.param.user || "Espace collaboratif");
    $(".userinfo").html(info);
  }, this);

  // Offline mode
  if (this.param.offline) {
    $('body').addClass('offline');
  } else {
    $('body').removeClass('offline');
  }

  // Sauvegarder
  this.saveParam();

  // Dispatch event
  this.dispatchEvent({ type:"changegroup", group: g });
}

/** Dialog de changement de profil
 * @param {function|undefined} onSelect function called with a group number on select
 */
RIPart.prototype.choixProfil = function(title, onSelect) {
  if (this.getProfil() && this.param.groupes.length<2) return;
  var q = {};
  var listClass = {};
  var self = this;
  function libelle(g) {
    var d = $("<div>").html(g.nom);
    self.getLogo(g, function(f){
      $("<div>").addClass("listimage")
        .append($("<img>").attr("src", CordovApp.File.getFileURI(f)))
        .prependTo(d);
    });
    return d;
  }
  for (var i=0, g; g=this.param.groupes[i]; i++) {
    q[g.id_groupe] = libelle (g);
    listClass[g.id_groupe] = g.status + (g.active ? ' active' : ' inactive');
  }
  selectDialog(q, this.param.profil ? this.param.profil.id_groupe : -1, function(n) {
    if (onSelect) onSelect(Number(n));
    else self.setProfil(Number(n));
  }, { title: title, search: (this.param.groupes.length>8), listClass: listClass, className: 'ripart_choix' });
  //this.saveParam();
}

/** On a deja une connexion
 */
RIPart.prototype.isConnected = function() {
  return (this.param && this.param.profil) ? true:false;
};

/** Gestion de la page de signalement
 * @param {georem|false|undefined} grem une remontee non deja envoyee ou false vider la selection
 * @param {boolean} select autoriser la selection, default true
 */
RIPart.prototype.showFormulaire = function(grem, select) {

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
    console.error('[DEPRECATED] RIPart.onshow')
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
    $("input.lon", this.formElement).val(georem.lon);
    $("input.lat", this.formElement).val(georem.lat);
    $(".comment", this.formElement).val(georem.comment);
    // Photo
    var url = georem.photo;
    if (url) {
      var photoElt = $(".photo", this.formElement);
      $("img", photoElt).attr("src", CordovApp.File.getFileURI(url)+"?"+new Date().getTime())
          .data("photo",url)
          .show();
      $(".fa-stack", photoElt).hide();
    }
    // Croquis
    if (georem.sketch) {
      var f = this.sketch2feature(georem.sketch);
      this.addFeature(f);
    }
  }
  //
  help.show("formulaire-signaler");
  this.formElement.addClass('formulaire');
  $('.formulaire .movePosition', this.formElement).removeClass("tracking");

  // Gestion des themes
  var theme = $('[data-input="select"][data-param="theme"]', this.formElement);
  $('[data-input-role="option"]', theme).remove();
  $("<div>").attr("data-input-role","option").attr("data-val", "").html("<i>choisissez un thème...</i>").appendTo(theme);
  var valdef = false;
  var nbth = 0;
  for (var i=0; i<this.param.themes.length; i++) {
    if (
      $.isEmptyObject(this.param.profil)
      || this.isThemeInProfileFilter(this.param.themes[i], this.param.profil)
      // Operation tourisme 2017
      // || this.param.themes[i].id_groupe == 140
    ) {
      $("<div>").attr("data-input-role","option")
        .attr("data-val", this.param.themes[i].id_groupe+"::"+this.param.themes[i].nom)
        .html(this.param.themes[i].nom)
        .appendTo(theme);
      if (valdef===false) valdef = this.param.themes[i].id_groupe+"::"+this.param.themes[i].nom;
      else valdef = "";
      nbth++;
    }
  }
  if (georem && georem.themes) valdef = georem.themes.split("=>")[0].replace(/^"|"$/g,"");
  selectInput(theme, valdef, function(c) {
    self.selectTheme(c);
  });
  this.selectTheme(valdef, georem ? georem.attributes:false, nbth!=1);
  if (nbth>1) theme.show();
  else theme.hide();

  // Comment
  if (!georem) $(".comment", this.formElement).val(this.param.profil.comment);

  // Valid
  if (grem) this.formElement.addClass('valid');

  // Lon / lat
  var lon = Number($("input.lon", this.formElement).val());
  var lat = Number($("input.lat", this.formElement).val());
  var pos = ol_proj_transform([lon, lat], 'EPSG:4326', this.map.getView().getProjection());
  this.overlay.getSource().clear();
  this.overlay.getSource().addFeature( new ol_Feature (new ol_geom_Point(pos)));
  this.overlay.setVisible(true);
  this.selectOverlay.setVisible(true);
  this.selectInteraction.setActive(select!==false);

  this.map.getView().setCenter(pos);

  // reset
  this.target.setVisible(false);
  this.geolocation.setTracking (true);
  this.hasLocation = false;
  $('body').removeClass("trackingGeorem fullscreenMap");

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
 * @param {Object} theme ex {"nom": "Parcelles, Cadastre", "id_groupe": 13, "global": true, "attributs": []}
 * @param {Object} profil ex {"filtre": [{"group_id": 2, "themes": ["Test","mon thème","Parking vélo"]}], "groupe": "Groupe Test","status": "public", "comment": "Ceci est un test", "id_groupe": 2,"logo": "https://qlf-collaboratif.ign.fr/collaboratif-develop/document/image/95"}
 * @return {boolean} true si le theme est dans le profil false sinon
 */
RIPart.prototype.isThemeInProfileFilter = function(theme, profil)
{
  if (undefined == profil.filtre) {
    return false;
  }
  for (var i in profil.filtre) {
    if (theme.id_groupe == profil.filtre[i].group_id && profil.filtre[i].themes.indexOf(theme.nom) != -1) return true;
  }
  return false;
}

/** Selectionne un theme dans le formulaire
* @param {string} th theme par defaut
* @param {string} atts attributs par defaut
*/
RIPart.prototype.selectTheme = function(th, atts, prompt) {
  if (!th) th = "";
  th = th.split("::");
  var group = parseInt(th[0]);
  th = th[1];
  var themes = this.param.themes;
  var theme = null;
  for (var i=0; i<themes.length; i++) {
    if (themes[i].id_groupe == group && themes[i].nom == th) {
    theme = themes[i];
      break;
    }
  }
  var self = this;

  // Remise a jour des attributs
  this.resetFormulaireAttribut();

  if (theme) {
    if (theme.attributs.length) {
      $(".attributes", this.formElement).show()
        .data('attributes', theme.attributs)
        .unbind("click")
        .click(function(){
          self.formulaireAttribut();
        });
      this.formulaireAttribut(atts, prompt);
      this.formElement.removeClass('valid');
    } else {
      // Theme seul ou pas de themes
      $(".attributes", this.formElement).hide();
      this.formElement.addClass('valid');
    }
  } else {
    this.formElement.addClass('valid');
  }
};

/** Remise a zero du formulaire
*/
RIPart.prototype.resetFormulaireAttribut = function() {
  var input = $(".attributes", this.formElement).data("vals", false);
  $('[data-input-role="info"]', input).text("");
};

/** Affichage du formulaire attribut
* @param {Object} valdef liste de valeurs par defaut
* @param {bool} prompt afficher le dialogue d'attributs, defaut: true
*/
RIPart.prototype.formulaireAttribut = function(valdef, prompt) {
  var self = this;
  var input = $(".attributes", this.formElement);
  var att = input.data('attributes');
  if (input.is(":visible")) {
    var content = $("<ul>");
    var i, a, k, li;
    var vals = {}, infos = {};
    if (valdef) {
      var v = valdef.replace(/^,/, "").split(',"');
      valdef = {};
      for (i=0; i<v.length; i++) {
        var l = v[i].split('"=>"');
        k = l[0].split("::")[2];
        valdef[k] = l[1].replace(/"$/,"");
      }
    }
    for (i=0; a = att[i]; i++) {
      vals[a.att] = (valdef ? valdef[a.att] : (att[i].defaultVal || a.val[0]));
      infos[a.att] = a;
      switch (a.type) {
        case 'list': {
          li = $("<li data-input='select'>")
            .attr('data-valdef', a.defaultVal)
            .attr('data-param', a.att)
            .appendTo(content);
          for (k in a.val) {
            $("<div data-input-role='option'>").attr('data-val', k).html(a.val[k]||"<i>sans</i>").appendTo(li);
          }
          break;
        }
        case 'checkbox': {
          vals[a.att] = (vals[a.att]==='1' || vals[a.att]===true);
          li = $("<li data-input='check'>").attr('data-param',a.att).appendTo(content);
          break;
        }
        case 'date': {
          li = $("<li data-input='date'>")
            .attr('data-param',a.att)
            .attr('data-default', a.defaultVal)
            .appendTo(content);
          $("<input>").attr("type","date").appendTo(li);
          break;
        }
        default: {
          li = $("<li data-input='text'>").attr('data-param',a.att).appendTo(content);
          $("<input>").attr("type","text").appendTo(li);
          $('<i class="clear-input">').appendTo(li);
          break;
        }
      }
      $("<label>").text(a.title || a.att).prependTo(li);
      if (a.obligatoire) li.addClass('obligatoire');
    }
    if (!valdef && input.data("vals")) vals = $.extend({}, input.data("vals"));
    this.wapp.setParamInput(content, vals);
    const showInfo = function() {
      input.data("vals", $.extend({}, vals));
      $('[data-input-role="info"]', input).text( self.formatAttributString(vals, infos) );
    }
    showInfo();
    // First time ask for attributes
    if (!valdef && prompt!==false) {
      dialog.show(content, {
        buttons: { submit:"ok", cancel:"Annuler" },
        title: "Attributs",
        className: "attributes",
        callback: function(b) {
          if (b=='submit') {
            var obligatoire = '';
            // Check oligatoire
            $('.obligatoire', content).each(function() {
              switch($(this).data('input')) {
                case 'select': {
                  // not the default value ?
                  // if (vals[$(this).data('param')] === $(this).data('valdef')) {
                  if (!vals[$(this).data('param')]) {
                    obligatoire = $('label', this).text();
                  }
                  break;
                }
                case 'check': {
                  // boolean true / false
                  break;
                }
                default: {
                  if (!$('input', this).val()) {
                    obligatoire = $('label', this).text();
                  }
                  break;
                }
              }
            })
            if (obligatoire) {
              dialog.replay();
              alertDlg('L\'attribut <b><i>"'+obligatoire+'"</i></b> est obligatoire.')
            } else {
              showInfo();
              self.formElement.addClass('valid');
            }
          } else {
            if (!$('.obligatoire', content).length) {
              self.formElement.addClass('valid');
            }
          }
        }
      });
    }
  }
  // Reset form values
  else {
    this.resetFormulaireAttribut();
  }
};


/** Cancel formulaire: showFormulaire (false)
 * @param {string} type submit or cancel
 */
RIPart.prototype.cancelFormulaire = function(type, georem) {
  if (!this.formElement.hasClass('formulaire')) return;
  this.formElement.removeClass('formulaire');
  this.overlay.setVisible(false);
  this.selectOverlay.setVisible(false);
  this.drawInteraction.setActive(false);
  this.selectInteraction.setActive(false);
  this.formElement.data("grem", false);
  $(".attributes", this.formElement).data('vals', false);
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
RIPart.prototype.photo = function(noFile) {
  var self = this;
  var photoElt = $('.photo', this.formElement);
  var hasPhoto = $('img', photoElt).attr('src');
  console.log('getPicture', noFile)
  this.wapp.getPicture(
    function(url, button) {
      if (url) {
        $('img', photoElt).attr('src', CordovApp.File.getFileURI(url)+'?'+new Date().getTime())
          .data('photo',url)
          .show();
        $('.fa-stack', photoElt).hide();
      } else {
        if (button=='del') {
          $('img', photoElt).attr('src','')
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
      name: 'TMP/photo.jpg',
      buttons: hasPhoto ? { photo:'Caméra', album:'Album', del:'supprimer', cancel:'annuler' } : { photo:'Caméra', album:'Album', cancel:'annuler' },
      className: hasPhoto ? 'ripart photo photodel' : 'ripart photo',
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
RIPart.prototype.addFeature = function(features) {
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
RIPart.prototype.on = function(events, handler) {
  $(document).on ('ripart-'+events, handler);
};

/** Remove an event handler.
  */
RIPart.prototype.un = function(events, handler) {
  $(document).off ('ripart-'+events, handler);
};

/** Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
  */
RIPart.prototype.once = function(events, handler) {
  $(document).one ('ripart-'+events, handler);
};

/** Dispatch an event.
  */
RIPart.prototype.dispatchEvent = function(event) {
  event.type = 'ripart-'+event.type;
  $(document).trigger(event);
};

/** Recupere le logo d'un goupe
  * @param {any} g le groupe
  * @param {function} cback callback fonction qui renvoie le nom du fichier
  */
RIPart.prototype.getLogo = function (g, cback, scope) {
  CordovApp.File.getFile (
    "TMP/logo/"+(g ? g.id_groupe : '_nologo_'),
    function(fileEntry) {
      cback.call(scope, CordovApp.File.getFileURI(fileEntry.toURL()));
    },
    function() {
      cback.call(scope, g ? g.logo : null);
    }
  );
};

export default RIPart
