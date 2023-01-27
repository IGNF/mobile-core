/** @module ol/cache/CacheVector
 */
import CordovApp from '../../CordovApp'
import {createEmpty as ol_extent_createEmpty} from 'ol/extent'
import {extend as ol_extent_extend} from 'ol/extent'
import ol_layer_Group from 'ol/layer/Group'
import ol_layer_Vector from 'ol/layer/Vector'
import ol_source_Vector from 'ol/source/Vector'
import CacheExtents from './CacheExtents'

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
  this.cacheExtents = new CacheExtents(wapp);

  if (!this.wapp.param.vectorCache) this.wapp.param.vectorCache = [];

  this.loadPage = $(options.loadPage || '#loadGuichet');

  $('.cancel', this.loadPage).click(() => {
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

  for (var i=0, c; c = this.wapp.param.vectorCache[i]; i++) {
    if (c.id_guichet === guichet.id) {
      var g = new ol_layer_Group({
        title: c.nom, 
        name: c.id_guichet+'-'+c.id, 
        vectorCache: c,
        baseLayer: true 
      });
      var l;
      for (var k=0; l=c.layers[k]; k++) if (l.table) {
        cache.push(l);
        l = this.wapp.layerCollabVector(l, this.getCacheFileName(c,k)+'/', c.extent);
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
  var guichet = this.getCurrentGuichet();
  if (this.wapp.getIdGuichet()===guichet.id) {
    this.wapp.setGuichet(guichet);
  }
};

/**
 * Delete cache for one layer
 * @param {*} cache 
 * @param ol.l.Vector layer layer to delete in cache
 * @param function cbk
 * @return {boolean} false if not deleted or not found true otherwise
 */
CacheVector.prototype.removeLayerCache = function(cache, layer, cbk) {
  if (!layer) return false;
  let layerId = false;
  cache.layers.forEach((c, i) => {
    if (c.table.database+':'+c.table.name == layer.get('name')) {
      layerId = i;
    }
  });
  if (false === layerId) {
    if (cbk) cbk(false);
    return;
  }
  if (cache.loaded) {
    let dir = this.getCacheFileName(cache, layerId);
    CordovApp.File.getDirectory(dir, function(entry){
      if (entry.isDirectory) entry.removeRecursively();
    });
  }
  
  // Update
  cache.layers.splice(layerId, 1);
  this.wapp.saveParam();
  if (cbk) cbk(true);

}

/** Save modifications and update cache data for layers
 * @param {Array<ol.layer.Vector>} 
 * @param {} cache
 * @param {Array<ol.l.Vector>} toload
 */
CacheVector.prototype.saveLayer = function(layers, cache, toload) {
  console.log('LOADING', cache, this.wapp.userManager.getGroupById(cache.id_guichet))
  this.setCurrentGuichet(this.wapp.userManager.getGroupById(cache.id_guichet));
  const l = layers.pop();
  if (!toload) toload = [];
  if (l) {
    // Find the layer indice in the layercache
    cache.layers.forEach((c, i) => {
      if (c.table.database+':'+c.table.name === l.get('name')) {
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
    this.wapp.wait('Chargement...');
    setTimeout(() => { 
      this.uploadLayers(cache, true, toload); 
    }, 300);
  }
};

/**
 * Mettre a jour le cache
 * @param {*} cache 
 */
CacheVector.prototype.updateCache = function(cache) {
  console.warn('[CacheVector:updateCache] DEPRECATED')
  this.wapp.wait('Chargement...');
  setTimeout(() => { 
    this.uploadLayers(cache, true); 
  }, 300);
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
 * Charger les emprises donnees
 * Charge l'emprise courante si non fournies
 * @param {boolean} update
 * @param {String} extent name
 */
CacheVector.prototype.uploadCache = function(update, extentName) {
  var cache = this.currentCache;
  // Add current extent
  if (!extentName) {
    extentName = this.cacheExtents.add(null, [this.map.getView().calculateExtent(this.map.getSize())]);
  }

  let extents = this.cacheExtents.get(extentName);
  
  cache.extentNames.push(extentName)
  for (let i in extents) cache.extents.push(extents[i]);
  
  let extent = ol_extent_createEmpty();
  for (let i in cache.extents) {
      ol_extent_extend(extent, cache.extents[i]);
  }
  cache.extent = extent;

  // Get upload list
  this.wapp.wait('Chargement...');
  setTimeout(() => { 
    this.uploadLayers(cache, update); 
  }, 300);
};

/**
 * Charger les layers du cache
 * @param {*} cache  the cache
 * @param {boolean} update true to update layer, false to reload
 * @param {*} toload list of layer indice to load, default load all layers from cache
 */
CacheVector.prototype.uploadLayers = function(cache, update, toload) {
  cache.date = (new Date()).toISODateString();
  // Search for layers
  const layers = [];
  cache.layers.forEach((l, i) => {
    // Reload all
    if (!update) {
      // remove cache dir
      var dir = this.getCacheFileName(cache, i, null, true);
      CordovApp.File.getDirectory(dir, function(entry){
        if (entry.isDirectory) entry.removeRecursively();
      });
    }
    // Handle numrec on update (save current numrec)
    if (update) {
      l.numrec0 = l.numrec;
    }
    delete l.numrec;
    // Add new layer
    var wp = this.wapp.layerCollabVector(l);
    layers.push(wp);
    // Upload when ready
    wp.on('ready', () => { 
      this.uploadLayers2(cache, update, toload, layers); 
    });
    wp.on("error", (e) => {
      wapp.wait(false);
      this.wapp.alert ("Impossible de charger la couche <i>"
        +(wp.get('name') || wp.get('title'))
        +"</i>.<i class='error'><br/>"+e.status+" - "+e.error+"</i>");
    });
  });
};

/**
 * Charger les layers du cache step 2
 * @param {*} cache  the cache
 * @param {boolean} update true to update layer, false to reload
 * @param {*} toload list of layer indice to load, default load all layers from cache
 * @param {*} layers list of layers that remains (private / internal / recursive)
 * @private
 */
CacheVector.prototype.uploadLayers2 = function(cache, update, toload, layers) {
  var i, l;
  var guichet = this.getCurrentGuichet();
  var ready = true;
  // Wait all sources ar loaded
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
    // Ready to load: some numrec are missing
    if (!hasNumrec) {
      // Still loading numrec on last sources (wait next call)
      if (loading) return;
      // Create layer cache
      layers.forEach((l, i) => {
        if (!toload || toload.indexOf(i) >= 0) {
          var table = cache.layers[i].table = l.getTable();
          cache.layers[i].date = (new Date()).toISODateString();
          var param = l.getSource().getWFSParam(cache.extent, this.map.getView().getProjection());
          this.wapp.userManager.apiClient.getTableMaxNumrec(table.database_id, table.id, {"bbox": param.bbox}).then((response) => {
            let result = response.data;
            if (update) {
              // get current numrec 
              cache.layers[i].numrec = cache.layers[i].numrec0;
              delete cache.layers[i].numrec0;
              cache.layers[i].numrec2 = result;
            } else {
              cache.layers[i].numrec = result;
            }
            this.uploadLayers2(cache, update, toload, layers);
            console.log('NUMREC', cache.layers[i].numrec)
          }).catch((e) => {
            if (e.response && (e.response.status === 403 || e.response.status === 404)) {
              if (update) {
                // get current numrec 
                cache.layers[i].numrec = cache.layers[i].numrec0;
                delete cache.layers[i].numrec0;
                cache.layers[i].numrec2 = false;
              } else {
                cache.layers[i].numrec = false;
              }
              this.uploadLayers2(cache, update, toload, layers);
            } else {
              wapp.wait(false);
              let msg = e.response ? e.response.status + " - " + e.response.error : "Erreur inattendue";
              this.wapp.alert ("Impossible de charger la couche <i>"
                +(l.get('name')||l.get('title'))
                +"</i>.<i class='error'><br/>"+msg+"</i>");
            }
          });
        }
      });
    } else {
      // Ready to load (all layers have a numrec)
      var tiles = [];
      // calculate tiles to load
      for (i=0; l=layers[i]; i++) {
        if (!toload || toload.indexOf(i) >= 0) {
          // load layer if no history or if updates (numrec > courrent numrec)
          if (!cache.layers[i].numrec || cache.layers[i].numrec !== cache.layers[i].numrec2) {
            tiles.push ({
              id_layer: i,
              source: l.getSource(),
              numrec: (update && cache.layers[i].numrec),
              tiles: this.calculateTiles(cache, l)
            })
          }
        }
      }
      // load tile
      this.uploadTiles(cache, tiles);
      this.wapp.saveParam();
      cache.loaded = true;
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
              + l.table.database 
              + '-' 
              + l.table.name 
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
CacheVector.prototype.uploadTiles = function(cache, tiles, pos, size, error, errorTiles) {
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
    errorTiles = [];
  } else {
    pos++;
    if (this.canceled) {
      this.wapp.wait(false);
      this.removeCache(cache);
      wapp.hidePage();
      return;
    }
  }
  if (size>0) this.wapp.wait({ pourcent: Math.round(pos/size*100) });

  for (i=0; t=tiles[i]; i++) {
    if (!errorTiles[i]) {
      errorTiles.push({
        id_layer: t.id_layer,
        numrec: t.numrec,
        source: t.source,
        tiles: []
      });
    }
    var tileError = errorTiles[i];
    // Next tile
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
      // Chargement
      var url = (t.source.proxy_ || t.source.table_.wfs);
      // Destination
      var fileName = this.getCacheFileName(cache, t.id_layer, tcoord, t.numrec);

      // Create dir if not exist
      CordovApp.File.getDirectory(
        this.getCacheFileName(cache),
        () => {
          self.wapp.userManager.apiClient.doRequest(url, "get", null, parameters).then((response) => {
            CordovApp.File.saveData(
              response.data,
              fileName,
              function() {
                // Go on loading
                self.uploadTiles(cache, tiles, pos, size, error, errorTiles);
                // Remove empty files
                CordovApp.File.info(fileName, (e) => {
                  if (e.size < 5) CordovFile.delFile(fileName);
                })
              },
              function() {
                error++;
                tileError.tiles.push(tcoord);
                self.uploadTiles(cache, tiles, pos, size, error, errorTiles);
              }
            );
          }).catch((e) => {
            error++;
            tileError.tiles.push(tcoord);
            self.uploadTiles(cache, tiles, pos, size, error, errorTiles);
          });
        },
        function() {
          error++;
          tileError.tiles.push(tcoord);
          self.uploadTiles(cache, tiles, pos, size, error, errorTiles);
        },
        true
      );
      return;
    }
  }
  // Ended?
  this.wapp.wait(false);
  // Alert on error
  if (error) {
    // Try to load errorTiles
    // this.wapp.alert(error+ ' / ' + size + ' fichier(s) en erreur...', 'Chargement');
    wapp.message(error+ ' / ' + size + ' fichier(s) en erreur...', 
      'Chargement',
      { ok: 'Recommencer', cancel:'Annuler' }, 
      (b) => {
        if (b==='ok') {
          // Restart
          wapp.wait(null, {anim: false});
          this.uploadTiles(cache, errorTiles);
        } else {
          // Reload Guichet
          if (this.wapp.getIdGuichet() === cache.id_guichet) {
            this.wapp.setGuichet(cache.id_guichet);
          }
        }
      });
      return;
  } else {
    this.wapp.message(size + ' fichier(s) chargé(s).', 'Chargement');
    // Reload Guichet
    if (this.wapp.getIdGuichet() === cache.id_guichet) {
      this.wapp.setGuichet(cache.id_guichet);
    }
  }
  //getTileCoordExtent + getWFSParam
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
    id_guichet: guichet.id,
    nom: name,
    layers: layers,
    date: (new Date()).toISODateString(),
    extent: ol_extent_createEmpty(),
    extents: [],
    extentNames: [], // noms de CacheExtent
    loaded: false
  }
  this.wapp.param.vectorCache.push (cache);
  this.wapp.saveParam();
};

/** Dialogue d'ajout de carte
 */
CacheVector.prototype.addDialog = function(cback) {
  var self = this;
  var guichet = this.getCurrentGuichet();
  var content = CordovApp.template('dialog-guichet');
  var ul = $('ul.layerselect', content);
  for (var i=0, l; l = guichet.layers[i]; i++) {
    if (l.table && l.table.tile_zoom_level) {
      $("<li>").addClass('selected')
        .attr('data-input','')
        .text(l.table.title)
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
