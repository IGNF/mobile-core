/** @module ol/cache/CacheVector
 */
import CordovApp from '../../Cordovapp'
import {createEmpty as ol_extent_createEmpty} from 'ol/extent'
import {extend as ol_extent_extend} from 'ol/extent'
import ol_layer_Group from 'ol/layer/Group'
import ol_layer_Vector from 'ol/layer/Vector'
import ol_source_Vector from 'ol/source/Vector'
import TileSource from 'ol/source/tile'

/**
 * Classe pour la gestion du cache vecteur
 * @constructor
 * @param {Cordovapp} wapp
 * @param {*} options 
 *	@param {string} options.page page du guichet avec les boutons de chargement, default "#guichet"
 *	@param {string} options.loadPage page de chargement du guichet, default "#loadGuichet"
 */
var CacheVector = function(wapp, options) {
  if (!options) options = {};
  this.wapp = wapp;
  this.map = wapp.map;

  if (!this.wapp.param.vectorCache) this.wapp.param.vectorCache = [];

/* DEPRECATED
  this.page = $(options.page || '#guichet');
  $('.addmap', this.page).click(function(){
    self.addDialog();
  });
*/

  this.loadPage = $(options.loadPage || '#loadGuichet');

  $('.cancel', this.loadPage).click(() => {
    // wapp.showPage(self.page.attr('id'));
    this.wapp.hidePage();
  });
  $('.ok', this.loadPage).click(() => {
    // Load layer cache
    this.uploadCache();
  });

  // Create dir if doesn't exist
  CordovApp.File.getDirectory (this.getCacheFileName(), null, null, true);
};

/** Layers en cache d'un guichet
 * @param {groupe} guichet
 * @param {Array<*>} layerDef returns layers definition
 * @param {Array<ol.layer.Vector}
 */
CacheVector.prototype.getLayers = function(guichet, cache) {
  cache = cache || [];
  var layers = [];
  var self = this;

  // Afficher le contour du cache
  function addPostcompose (l, extents) {
    l.on('postcompose', function(e){
      var canvas = document.createElement('canvas');
      canvas.width = e.context.canvas.width;
      canvas.height = e.context.canvas.height;
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'rgb(255,0,0)';
      ctx.lineWidth = Math.max(30, 1000 * e.frameState.pixelRatio / e.frameState.viewState.resolution);
      ctx.scale(e.frameState.pixelRatio,e.frameState.pixelRatio);
      var rects = [];
      var k, extent, r;
      ctx.beginPath();
        for (k=0, extent; extent=extents[k]; k++) {
          var p0 = self.map.getPixelFromCoordinate([extent[0], extent[1]]);
          var p1 = self.map.getPixelFromCoordinate([extent[2], extent[3]]);
          rects.push([p0[0],p0[1],p1[0]-p0[0],p1[1]-p0[1]]);
          ctx.rect(p0[0],p0[1],p1[0]-p0[0],p1[1]-p0[1]);
        }
      ctx.stroke();
      for (k=0, r; r=rects[k]; k++) {
        ctx.clearRect(r[0],r[1],r[2],r[3]);
      }
      e.context.save();
        e.context.globalAlpha = .1;
        e.context.drawImage(canvas,0,0);
      e.context.restore();
    });
  }

  for (var i=0, c; c = this.wapp.param.vectorCache[i]; i++) {
    if (c.id_guichet === guichet.id_groupe) {
      var g = new ol_layer_Group({ 
        title: c.nom, 
        name: c.id_guichet+'-'+c.id, 
        vectorCache: c,
        baseLayer: true 
      });
      var l;
      for (var k=0; l=c.layers[k]; k++) if (l.featureType) {
        cache.push(l);
        l = this.wapp.layerWebpart(l, this.getCacheFileName(c,k)+'/', c.extent);
        // if (c.layers.length===1) l.set('displayInLayerSwitcher',false);
        g.getLayers().push(l);
        // Marquer le layer sur l'objet
        l.getSource().on('addfeature', function (e) {
          e.feature.layer = this; 
        }.bind(l));
      }
      // Red border
      if (g.getLayers().getLength()) {
        layers.push(g);
        l = new ol_layer_Vector({ 
          title: 'extent',
          displayInLayerSwitcher: false,
          source: new ol_source_Vector()
        });
        addPostcompose(l, c.extents);
        g.getLayers().push(l);
      }
    }
  }
  return layers;
};

/** Set Guichet courant
 */
CacheVector.prototype.setCurrentGuichet = function(guichet) {
  this.currentGuichet = guichet;
};

/** Get Guichet courant
 */
CacheVector.prototype.getCurrentGuichet = function() {
  return this.currentGuichet;
};

/** Afficher les cartes en cache
 */
CacheVector.prototype.showList = function() {
console.warn('[DEPRECATED] showlist')
return;
  var ul = $('.offline ul.cartes', this.page);
  var tmp = $('[data-role="template"]', ul);
  ul.html('').append(tmp);
  if (!this.wapp.param.vectorCache) return;
  var guichet = this.getCurrentGuichet();
  // Cache list
  this.wapp.param.vectorCache.forEach((cache) => {
    if (cache.id_guichet !== guichet.id_groupe) return;
    var li = $("<li>").html(tmp.html())
      .data('cache', cache)
      .appendTo(ul);
    var ddate = new Date() - new Date(cache.date);
    if (ddate > 15*24*60*60*1000) li.addClass('err');
    else if (ddate > 7*24*60*60*1000) li.addClass('warn');
    var layerName = '';
    cache.layers.forEach((l) => {
      layerName += (layerName ? ' - ':'') + l.nom;
    });
    $(".info .layer", li).text(layerName);
    $(".info .date", li).text(cache.date);
    // Input
    $('input', li).val(cache.nom)
      .on('change', () => {
        cache.nom = this.value;
      });
    // Buttons
    $('.fa-map-o', li).click(() => {
      this.loadCache(cache);
    });
    $('.tools-locate', li).click(() => {
      this.locateCache(cache);
    });
    $('.fa-refresh', li).click(() => {
      this.updateCache(cache);
    });
    $('.fa-trash', li).click(() => {
      this.removeCache(cache);
    });

    // Comptage des objets dans le cache
    let nb = 0;
    $('.nb', li).hide();
    for (var k=0; k<cache.layers.length; k++) {
      const url = this.getCacheFileName(cache,k) + '/editions.txt';
      CordovApp.File.read(
        url, 
        // Success
        (data) => { 
          data = JSON.parse(data);
          nb += data.Insert + data.Update + data.Delete;
          $('.nb', li).html(nb).show();
        }
      );
    }
  });
};

/**
 * Supprimer le cache
 * @param {*} cache 
 */
CacheVector.prototype.removeCache = function(cache) {
  console.log('removeCACHE')
  // Remove in cache list
  for (var i=this.wapp.param.vectorCache.length-1; i>=0; i--) {
    if (this.wapp.param.vectorCache[i] === cache) {
      this.wapp.param.vectorCache.splice(i, 1);
    }
  }
  // Remove file on device
  var dir = this.getCacheFileName(cache);
  CordovApp.File.getDirectory(dir, function(entry){
    if (entry.isDirectory) entry.removeRecursively();
  });
  // Update
  this.wapp.saveParam();
  this.showList();
  var guichet = this.getCurrentGuichet();
  if (this.wapp.getIdGuichet()===guichet.id_groupe) {
    this.wapp.setGuichet(guichet);
  }
};

/** Save modifications and update layers
 * @param {Array<ol.layer.Vector>} 
 * @param {} cache
 * @param {Array<ol.l.Vector>} toload
 */
CacheVector.prototype.saveLayer = function(layers, cache, toload) {
  console.log('LOADING', cache, this.wapp.ripart.getGroupById(cache.id_guichet))
  this.setCurrentGuichet(this.wapp.ripart.getGroupById(cache.id_guichet));
  const l = layers.pop();
  if (!toload) toload = [];
  if (l) {
    // Find the layer indice in the layercache
    cache.layers.forEach((c, i) => {
      if (c.featureType.database+':'+c.featureType.name === l.get('name')) {
        toload.push(i);
      }
    });
    if (l.get('cache') && l.getSource().nbModifications()) {
      this.wapp.wait('Sauvegarde des modifications...<br/>'+l.get('title'))
      l.getSource().save(()=>{
        this.wapp.notification(l.get('title')+' sauvegardé...');
        // Next
        this.saveLayer(layers, cache, toload);
      }, (error, transaction) => {
        this.wapp.wait(false);
        // Look for transaction
        console.log('ERROR', error, transaction)
        if (transaction) {
          this.wapp.handleConflict(transaction, l);
        } else {
          this.wapp.alert('Impossible de sauvegarder '+l.get('title')+'<br/><i class="error">'+error+'</i>');
        }
      });
    } else {
      // Next
      this.saveLayer(layers, cache, toload);
    }
  } else {
    // Recharger le cache
    this.uploadLayers(cache, true, toload);
  }
};

/**
 * Mettre a jour le cache
 * @param {*} cache 
 */
CacheVector.prototype.updateCache = function(cache) {
  console.warn('[CacheVector:updateCache] DEPRECATED')
  this.wapp.wait('Chargement...');
  this.uploadLayers(cache, true);
};

/**
 * Afficher la page de chargement du cache
 * @param {*} cache 
 * @param {boolean} cancel true to enable cancel
 */
CacheVector.prototype.loadCache = function(cache, cancel) {
  this.wapp.showPage(this.loadPage.attr('id'));
  if (cancel) this.loadPage.addClass('cancelable');
  else this.loadPage.removeClass('cancelable')
  this.currentCache = cache;
};

/**
 * Charger l'emprise courante
 */
CacheVector.prototype.uploadCache = function(update) {
  var cache = this.currentCache;
  // Add current extent
  var ex = this.map.getView().calculateExtent(this.map.getSize());
  cache.extents.push(ex);
  ol_extent_extend(cache.extent, ex);
  // Get upload list
  this.wapp.wait('Chargement...');
  this.uploadLayers(cache, update);
};

/**
 * Charger les layers du cache
 * @param {*} cache  the cache
 * @param {boolean} update true to update layer, false to reload
 * @param {*} toload list of layer indice to load, default load all layers from cache
 * @param {*} layers list of layers that remains (private / internal / recursive)
 */
CacheVector.prototype.uploadLayers = function(cache, update, toload, layers) {
  cache.date = (new Date()).toISODateString();
  var i, l;
  var guichet = this.getCurrentGuichet();
  // Search for layers
  if (!layers) {
    layers = [];
    cache.layers.forEach((l, i) => {
      // Reload all
      if (!update) {
        delete l.numrec;
        // remove cache dir
        var dir = this.getCacheFileName(cache, i, null, true);
        CordovApp.File.getDirectory(dir, function(entry){
          if (entry.isDirectory) entry.removeRecursively();
        });
      }
      // Add new layer
      var wp = this.wapp.layerWebpart(l);
      layers.push(wp);
      // Upload when ready
      wp.on('ready', () => { 
        this.uploadLayers(cache, update, toload, layers); 
      });
      wp.on("error", (e) => {
        this.wapp.alert ("Impossible de charger la couche <i>"
          +(wp.get('name')||wp.get('title'))
          +"</i>.<i class='error'><br/>"+e.status+" - "+e.error+"</i>");
      });
    });
  } else {
    var ready = true;
    for (i=0; l=layers[i]; i++) {
      if (!l.getSource()) ready = false;
    }
    // Ready to load? (all layers have a source)
    if (ready) {
      // Check numrec
      var hasNumrec = true;
      var loading = false;
      for (i=0; l=layers[i]; i++) {
        if (!toload || toload.indexOf(i) >= 0) {
          if (!cache.layers[i].hasOwnProperty('numrec')) {
            hasNumrec = false;
          } else {
            loading = true;
          }
        }
      }
      // Ready to load: layer has numrec
      if (!hasNumrec) {
        // Still loading numrec on last sources
        if (loading) return;
        // Create layer cache
        layers.forEach((l, i) => {
          if (!toload || toload.indexOf(i) >= 0) {
            var ft = cache.layers[i].featureType = l.getFeatureType();
            cache.layers[i].date = (new Date()).toISODateString();
            $.ajax({
              url: ft.uri + '/max-numrec',
              beforeSend: (xhr) => { 
                xhr.setRequestHeader("Authorization", "Basic " + this.wapp.ripart.getHash()); 
                xhr.setRequestHeader("Accept-Language", null);
              },    
              success: (result) => {
                cache.layers[i].numrec = result.numrec;
                this.uploadLayers(cache, update, toload, layers);
                console.log('NUMREC', cache.layers[i].numrec)
              },
              error: (e) => {
                if (e.status === 403 || e.status === 404) {
                  cache.layers[i].numrec = false;
                  this.uploadLayers(cache, update, toload, layers);
                } else {
                  wapp.wait(false);
                  this.wapp.alert ("Impossible de charger la couche <i>"
                    +(l.get('name')||l.get('title'))
                    +"</i>.<i class='error'><br/>"+e.status+" - "+e.error+"</i>");
                }
              }
            })
          }
        });
      } else {
        // Ready to load
        var tiles = [];
        // calculate tiles to load
        for (i=0; l=layers[i]; i++) {
          if (!toload || toload.indexOf(i) >= 0) {
            tiles.push ({
              id_layer: i,
              source: l.getSource(),
              numrec: (update && cache.layers[i].numrec),
              tiles: this.calculateTiles(cache, l)
            })
          }
        }
        // load tile
        this.uploadTiles(cache, tiles);
        this.wapp.saveParam();
        if (guichet) this.showList();
      }
    }
  }
};

/**
 * Calculer les tuiles a charger
 * @param {*} cache 
 * @param {*} l 
 */
CacheVector.prototype.calculateTiles = function(cache, l) {
  var tgrid = l.getSource().getTileGrid();
  var tiles = {};
  for (var i=0, ex; ex=cache.extents[i]; i++){
    var p0 = [ex[0],ex[1]];
    var p1 = [ex[2],ex[3]];
    var t0 = tgrid.getTileCoordForCoordAndZ(p0,tgrid.getMinZoom());
    var t1 = tgrid.getTileCoordForCoordAndZ(p1,tgrid.getMinZoom());
    var z = t0[0];
    var x0 = Math.min(t0[1], t1[1]);
    var x1 = Math.max(t0[1], t1[1]);
    var y0 = Math.min(t0[2], t1[2]);
    var y1 = Math.max(t0[2], t1[2]);
    for (var x=x0; x<=x1; x++) for (var y=y0; y<=y1; y++) {
      tiles[z+'-'+x+'-'+y] = [z, x, y];
    }
  }
  var tabTiles = [];
  for (var t in tiles) tabTiles.push(tiles[t]);
  return tabTiles;
};

/**
 * Nom du fichier de cache
 * @param {*} cache 
 * @param {*} id_layer 
 * @param {*} tileCoord 
 */
CacheVector.prototype.getCacheFileName = function(cache, id_layer, tileCoord, numrec) {
  var dir = 'FILE/cache';
  if (!cache) return dir;
  dir += '/' + CordovApp.File.fileName ('G'+cache.id_guichet);
  if (!id_layer && id_layer!==0) return dir;
  var l = cache.layers[id_layer];
  var base = CordovApp.File.fileName(
              cache.id 
              + '-'
              + l.url.replace(/.*databasename=([^&]*).*/,"$1") 
              + '-' 
              + l.nom 
            );
  if (numrec) base += '/diff';
  if (!tileCoord) return dir+'/'+base;
  // Filename
  return dir+'/'+base+'/'+tileCoord.join('-');
};

/**
 * Chargement des tuiles recursif
 * @param {*} cache
 * @param {*} tiles tile list
 * @param {number} pos current position
 * @param {number} size size to load
 * @param {number} error nb error
 */
CacheVector.prototype.uploadTiles = function(cache, tiles, pos, size, error) {
  var self = this;
  var i, t;
//  this.wapp.wait('chargement', { pourcent:50 });

  if (!size) {
    this.canceled = false;
    var mes = $('<div>Chargement...</div>');
    if (this.loadPage.hasClass('cancelable')) {
      this.loadPage.removeClass('cancelable');
      this.wapp.wait(mes, { 
        pourcent: 0, 
        buttons: {
          'Annuler': () => {
            self.canceled = true;
          }
        } 
      });

    } else {
      this.wapp.wait(mes, { pourcent: 0 });
    }
    size=0;
    for (i=0; t=tiles[i]; i++) {
      size += t.tiles.length;
    }
    pos = 0;
    error = 0;
  } else {
    pos++;
    if (this.canceled) {
      this.wapp.wait(false);
      // wapp.vectorCache.removeCache(wapp.getCache(wapp.guichet).cache);
      this.removeCache(cache);
      wapp.hidePage();
      return;
    }
  }
  if (size>0) this.wapp.wait({ pourcent: Math.round(pos/size*100) });

  for (i=0; t=tiles[i]; i++) {
    if (t.tiles.length) {
      var tgrid = t.source.getTileGrid();
      var tcoord = t.tiles.pop();
      var extent = tgrid.getTileCoordExtent(tcoord);
      var parameters = t.source.getWFSParam(extent, this.map.getView().getProjection());
      if (t.numrec) {
        parameters.numrec = t.numrec;     // update
        parameters.filter = "{}";
      }
      parameters._T = (new Date()).getTime();         // Force refresh
      var p = "";
      for (var k in parameters) p += (p?'&':'?') +k+'='+parameters[k];
      // Chargement
      var url = (t.source.proxy_ || t.source.featureType_.wfs) + p;
      // Destination
      var fileName = this.getCacheFileName(cache, t.id_layer, tcoord, t.numrec);
/** /
      console.log('url')
      if (t.numrec) {
        $.ajax({
          url:url,
          success: function(e)  {
            console.log(e)
          },
          beforeSend: (xhr) => { 
            xhr.setRequestHeader("Authorization", "Basic " + this.wapp.ripart.getHash());
            xhr.setRequestHeader("Accept-Language", null);
          },    
        })
      }
/**/
      // Create dir if not exist
      CordovApp.File.getDirectory(
        this.getCacheFileName(cache),
        () => {
          CordovApp.File.dowloadFile(
            url,
            fileName,
            function() {
              // Go on loading
              self.uploadTiles(cache, tiles, pos, size, error);
              // Remove empty files
              CordovApp.File.info(fileName, (e) => {
                if (e.size === 0) CordovFile.delFile(fileName);
              })
            },
            function() {
              error++;
              self.uploadTiles(cache, tiles, pos, size, error);
            },{	
              headers: {
                'Authorization': 'Basic '+ self.wapp.ripart.getHash()
              }
            }
          );
        },
        function() {
          error++;
          self.uploadTiles(cache, tiles, pos, size, error);
        },
        true
      );
      return;
    }
  }
  // Alert on error
  if (error) {
    this.wapp.alert(error+ ' / ' + size + ' fichier(s) en erreur...', 'Chargement');
  } else {
    this.wapp.message(size + ' fichier(s) chargé(s).', 'Chargement');
  }
  // Reload Guichet
  if (this.wapp.getIdGuichet() === cache.id_guichet) {
    this.wapp.setGuichet(cache.id_guichet);
  }
  //getTileCoordExtent + getWFSParam
  this.wapp.wait(false);
};

/**
 * Zoom to the cache extent
 * @param {*} cache 
 */
CacheVector.prototype.locateCache = function(cache) {
  this.map.getView().fit(cache.extent, this.map.getSize());
  this.wapp.hidePage();
};

/**
 * Ajouter une carte en cache
 * @param {sting} name nom de la carte
 * @param {Array<*>} layers liste de layer a ajouter
 */
CacheVector.prototype.addCache = function(name, layers) {
  if (!layers.length) return;
  var guichet = this.getCurrentGuichet();

  if (!this.wapp.param.vectorCache) this.wapp.param.vectorCache = [];
  var id = 0;
  for (var i=0, c; c=this.wapp.param.vectorCache[i]; i++) {
    id = Math.max(id, c.id||0);
  }
  var cache = {
    id: id+1,
    id_guichet: guichet.id_groupe,
    nom: name,
    layers: layers,
    date: (new Date()).toISODateString(),
    extent: ol_extent_createEmpty(),
    extents: []
  }
  this.wapp.param.vectorCache.push (cache);
  this.wapp.saveParam();
  // Gestion de l'aide
  this.wapp.help.show("guichet-hors-ligne");
};

/** Dialogue d'ajout de carte
 */
CacheVector.prototype.addDialog = function(cback) {
  var self = this;
  var guichet = this.getCurrentGuichet();
  var content = CordovApp.template('dialog-guichet');
  var ul = $('ul.layerselect', content);
  for (var i=0, l; l = guichet.layers[i]; i++) {
    if (l.type === 'WFS' && l.tilezoom) {
      $("<li>").addClass('selected')
        .attr('data-input','')
        .text(l.nom)
        .data('layer', l)
        .click(function(){
          var li = $(this).toggleClass('selected').addClass('active');
          setTimeout (function(){
            li.removeClass('active');
          }, 200);
        })
        .appendTo(ul);
    }
  }
  // All/none
  $('.all', content).click(()=>{
    $('li', ul).each(function(){
      $(this).addClass('selected');
    })
  })
  $('.none', content).click(()=>{
    $('li', ul).each(function(){
      $(this).removeClass('selected');
    })
  })

  this.wapp.dialog.show (content, {
    title: "Définir une zone d'édition", 
    buttons: { valid:"Valider", cancel:"Annuler" },
    className: "attributes guichet",
    callback: function(b) {
      if (b=='valid') {
        var name = $('input',content).val() || 'Sans titre';
        var layers = [];
        $("li", ul).each(function() {
          var l = $(this).data('layer');
          if ($(this).hasClass('selected')) layers.push($.extend({},l));
        });
        self.addCache(name, layers);
        if (cback) cback();
      }
    }
  });
};

export default CacheVector
