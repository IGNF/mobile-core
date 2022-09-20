/** @module ripart/RIPart
 */
/* global wapp, FileUploadOptions, FileTransfer, FileTransferError */
var CryptoJS = require("crypto-js")
import CordovApp from '../CordovApp'
import { wappStorage } from '../cordovapp/CordovApp'
import ol_Feature from 'ol/Feature'
import ol_geom_Point from 'ol/geom/Point'
import ol_geom_LineString from 'ol/geom/LineString'
import ol_geom_Polygon from 'ol/geom/Polygon'
import {transform as ol_proj_transform} from 'ol/proj'
import ol_format_GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature';
import {ApiClient} from 'collaboratif-client-api';

/** @class RIPart
 * Recuperation des signalements de l'espace collaboratif.
 * 
 * Documentation : {@link https://espacecollaboratif.ign.fr/api/doc/georem}
 * 
 * @constructor
 * @param {} options
 * 	@param {string} options.url url du service, default https://espacecollaboratif.ign.fr/api/
 * 	@param {string} options.user utilisateur du service
 * 	@param {string} options.pwd mot de passe de l'utilisateur
 *  @param {string} options.authBaseUrl url de base pour l' authentification monauthurl/openidconnect
 *  @param {string} options.apiBaseUrl url de l'api, default https://espacecollaboratif.ign.fr/gcms/api/
 *  @param {string} options.clientId l'identifiant du client pour l authentification
 *  @param {string} options.clientSecret le secret du client pour l authentification
 */
var RIPart = function(options) {
  options = options || {};
  // 
  var secret = 'Espace Collaboratif IGN';
  var defaultUrl = 'https://espacecollaboratif.ign.fr/api/'
  // Url du service
  var url = options.url || defaultUrl;
  let apiBaseUrl = options.apiBaseUrl || 'https://espacecollaboratif.ign.fr/gcms/api/'
  var user, pwd;
  this.param = {};
  this.apiClient = new ApiClient(options.authBaseUrl, apiBaseUrl, options.clientId, options.clientSecret);

  /** Changement de l'url du service
  * @param {String} u url du service
  */
  this.setServiceUrl = function(u) {
    url = u || defaultUrl;
  };

  /** Recupere l'url du service
  * @return {String} url du service
  */
  this.getServiceUrl = function() {
    return url;
  };

  /** Check the service url
   * @param {String} u url du service
   * @return {boolean}
   */
  this.isService = function(u) {
    return (u || defaultUrl) !== this.getServiceUrl();
  };
  
  /** Changement d'utilisateur
  * @param {String} user user name
  * @param {String} password user pwd
  * @param {boolean} b true to get the password (crypted)
  * @TODOAPI plus de gestion de l utilisateur a ce niveau
  */
  this.setUser = function(u, p, cryp) {
    if (user && user !== u) {
      this.deconnect();
    }
    user = u;
    if (!p) return;
    this.apiClient.setCredentials(u, p);
    // Pass
    this.param.user = u;
    if (cryp) {
      pwd = p;
      this.param.pwd = CryptoJS.AES.encrypt(p, secret).toString();
    } else  {
      this.param.pwd = p;
      pwd = CryptoJS.AES.decrypt(p, secret).toString(CryptoJS.enc.Utf8);
    }
  };
  this.setUser (options.user, options.pwd);

  /** Get the user name or pass
   * @param {boolean} b true to get the password (crypted)
   */
  this.getUser = function(b) {
    if (b) return pwd;
    else return user;
  };

  /** Get user hash 
   */
  this.getHash = function() {
    return btoa(user + ":" + pwd)
  };

  /* Decode l'erreur */
  function responseError (d) {
    var error = d.find("REPONSE ERREUR");
    var status = error.attr("code");
    // console.log(status+" : "+error.text())
    return ( status=="OK" ? false : { error:true, status: status, statusText: error.text() } );
  }

  /* Attributs a decoder */
  var georemAttr = { 
    id:"ID_GEOREM", autorisation:"AUTORISATION", url:"LIEN", source:"SOURCE", version:"VERSION",
    date:"DATE", valid:"DATE_VALID", maj:"MAJ", 
    lon:"LON", lat:"LAT", statut:"STATUT",
    id_dep:"ID_DEP", dep:"DEPARTEMENT", commune:"COMMUNE", comment:"COMMENTAIRE", 
    auteur:"AUTEUR", id_auteur:"ID_AUTEUR", groupe:"GROUPE", id_groupe:"ID_GEOGROUPE",
    doc:"DOC"
  };
  /*
  var themeAttr = { 
    groupe:"ID_GEOGROUPE", nom:"NOM" 
  };
  */
  var georepAttr = { 
    id:"ID_GEOREP", auteur:"AUTEUR", id_auteur:"ID_AUTEUR", 
    titre:"TITRE", date:"DATE", statut:"STATUT", comment:"REPONSE" 
  };

  /* Formater les attributs en texte (pour affichage)
  * @param {Object} vals a list of key/values
  * @param {Object} infos a list of key/values with infos on attributes
  * @return {string} formated attributes
  */
  var formatAttributString = this.formatAttributString = function(vals, infos) {
    var v = "";
    if (vals) {
      for (var i in vals) {
        // if (infos && !infos[i]) console.log('ERROR:', i, infos)
        if (vals[i] || vals[i]===false) {
          if (infos && infos[i]) {
            var val;
            if (infos[i].type === 'list') {
              val = infos[i].val[vals[i]] || vals[i];
            } else {
              val = (vals[i]===false ? "0" : (vals[i]===true ? "1":vals[i]));
            }
            v += (infos[i].title || i)+": "+val+"\n"

          } else {
            v += i+": "+(vals[i]===false ? "0" : (vals[i]===true ? "1":vals[i]))+"\n"
          }
        }
      }
    }
    return v;
  };

  /** Get a georem 
   * @param {XMLNode} rem signalement (XML) a decoder
   * @param {any} options 
   * 	@param {boolean} options.croquis extraire les croquis
   * @param {Array<*>} groupes list des groupes
   * @return {} le signalement en json
   */
  function getGeorem (rem, options, groupes) {
    var r = {};
    for (var i in georemAttr) {
      r[i] = rem.find("> "+georemAttr[i]).first().text();
    }
    r.lon = Number(r.lon);
    r.lat = Number(r.lat);
    r.croquis = rem.find('CROQUIS');
    if (options && options.croquis && r.croquis.length) {
      r.sketch = '<CROQUIS>'
        + r.croquis.html().replace(/\n/g,'')
        +'</CROQUIS>';
    }
    r.croquis = (r.croquis.length>0);
    r.themes = [];
    r.attText="";
    rem.find("THEME").each(function() {
      var th = {};
      th.nom = $(this).find("NOM").text();
      th.id_groupe = $(this).find("ID_GEOGROUPE").text();
      th.groupe = $(this).attr("groupe");
      var attribut = {};
      var nb = 0;
      $(this).find("ATTRIBUT").each(function() {
        attribut[$(this).attr('nom')] = $(this).text();
        nb++;
      });
      if (nb) th.attribut = attribut;
      // Get attributes info
      var infos;
      var groupe = groupes ? groupes.find((g)=> g.id_groupe == th.id_groupe) : null;
      if (groupe) {
        var gtheme = groupe.themes.find((t) => t.nom === th.nom);
        if (gtheme) {
          gtheme.attributs.forEach(a => {
            if (!infos) infos = {};
            infos[a.att] = a;
          });
        }
      }
      // Format attribut string
      r.attText += formatAttributString(attribut, infos);
      r.themes.push(th);
    });
    r.rep = [];
    rem.find("GEOREP").each(function() {
      var rep = {};
      for (var i in georepAttr) {
        rep[i] = $(this).find(georepAttr[i]).first().text();
      }
      r.rep.push(rep);
    });
    //console.log(r);
    return r;
  }

  /* Requete sur l'espace collaboratif
  * @param {String} action a realiser
  * @param {Object} liste des parametres a envoyer lors de l'action
  * @param {function} fonction de decodage xml => json
  * @param {function} callback (response, error)
  * @return {boolean} false if not connected
  */
  function sendRequest (action, options, decode, cback) {
    if (!user || !pwd) {
      if (cback) cback(null, { error:true, status: 401, statusText: "Unauthorized" });
      return false;
    }
    var format = options.format || 'xml';
    delete options.format;

    // Transfert OK
    function win (resp) {
      var r={};
      var error;
      if (format === "xml") {
        error = responseError($(resp));
        if (!error) r = decode($(resp));
      } else {
        r = resp;
      }
      // console.log(r)
      // Callback
      if (cback) cback(r,error);
      else console.log(r);
    }
    // Ooops
    function fail (resp) {
      // Callback
      if (cback) cback( null, { error: true, status: resp.status, statusText: resp.statusText });
      else console.log("ERROR: "+resp.status);
    }

    // Envoyer avec fichier joint (via FileTransfer)
    if (options.photo) {
      CordovApp.File.getFile(options.photo,
        function(fileEntry) {
          // Options
          var trOptions = new FileUploadOptions();
          trOptions.fileKey = "file-0";
          trOptions.fileName = "image_"+new Date().getTime()+".jpg";
          delete options.photo;
          trOptions.params = options;
          // Authentification
          var hash = btoa(user+":"+pwd);
          trOptions.headers = { 'Authorization': "Basic "+hash };
          // Transfert
          var ft = new FileTransfer();
          var timeout = setTimeout(function() { ft.abort(); }, 30000);
          ft.upload (
            fileEntry.toURL(), 
            url+"georem/"+action+".xml", 
            function(r) {
              if (timeout) clearTimeout(timeout);
              win(r.response); 
            },
            function(r) {
              if (timeout) clearTimeout(timeout);
              r.status = r.http_status;
              if (r.status == 401) {
                r.statusText = "Unauthenticated"; 
              } else {
                switch (r.code) {
                  case FileTransferError.FILE_NOT_FOUND_ERR: 
                    r.statusText = "File not found"; 
                    break;
                  case FileTransferError.INVALID_URL_ERR: 
                    r.statusText = "Invalid URL"; 
                    break;
                  case FileTransferError.CONNECTION_ERR: 
                    r.statusText = "Connection error"; 
                    break;
                  case FileTransferError.ABORT_ERR: 
                    r.statusText = "Operation aborted"; 
                    break;
                  case FileTransferError.NOT_MODIFIED_ERR: 
                    r.statusText = "Not modified"; 
                    break;
                  default: 
                    r.statusText = "Unknown error"; 
                    break;
                }
              }
              fail(r);
            },
            trOptions
          );		
        },
        function() {
          fail({ status:0, statusText: "File not found" });
        }
      );
    } else {
      // Sans fichier joint
      $.ajax ({
        type: /post/.test(action) ? "POST" : "GET",
        url: url+"georem/"+action+"."+(format || "xml"),
        dataType: (format || "xml"),
        cache: false,
        // Bug with user/pwd in Android 4.1
        beforeSend: function(xhr){ 
          xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pwd)); 
          xhr.setRequestHeader("Accept-Language", null);
        },
        /*
        username: user,
        password: pwd,
        statusCode: 
        {	401: function (data) 
          {	// alert('401: Unauthenticated');
          }
        },
        */
        data: options,
        success: win,
        error: fail,
        timeout: 30000
      });
    }
    return true;
  }

  /** Recuperer les info de l'utilisateur connecte
  * @param {function} callback function (response, error)
  */
  this.getUserInfo = function (cback) {
    if (!this.apiClient.username) {
      if (cback) cback(null, { error:true, status: 401, statusText: "Unauthorized" });
      return false;
    }
    
    this.apiClient.getUser().then( (response) => response.json()).then((data) => {
      console.log(data);
    });
    // Origine
    var serviceHost = this.getServiceUrl().replace(/(^https:\/\/[^/]*)(.*)/,'$1');
    // Decodage de la reponse
    function decode(resp) {
      var r = {};
      r.auteur = {
        nom: resp.find("AUTEUR NOM").text(),
        statut: resp.find("AUTEUR STATUTXT").text()
      };
      r.offline = false;
      r.profil = {
        id: Number(resp.find("PROFIL ID_GEOPROFIL").text()),
        titre: resp.find("PROFIL TITRE").text(),
        id_groupe: Number(resp.find("PROFIL ID_GEOGROUPE").text()),
        groupe: resp.find("PROFIL GROUPE").text(),
        logo: resp.find("PROFIL LOGO").text(),
        filtre: resp.find("PROFIL FILTRE").text()
      };
      if (typeof(r.profil.filtre) === 'string') {
        try {
          r.profil.filtre = JSON.parse(r.profil.filtre);
        } catch(e) { /* ok */ }
      }
      r.groupes = [];
      resp.find("GEOGROUPE").each(function() {
        var att = $(this);
 
        var filter;
        try {
          filter = JSON.parse(att.find("FILTER").first().text());
        } catch(e){ 
          filter = [] 
        }
        
        var g = {
          nom: att.find("NOM").first().text(),
          desc: att.find("DESCRIPTION").first().text(),
          id_groupe: Number(att.find("ID_GEOGROUPE").text()),
          commentaire_georem: att.find("COMMENTAIRE_GEOREM").text(),
          global: (att.find("STATUS").first().text() == "global"),
          status: att.find("STATUS").first().text(),
          active: !!att.find("ACTIVE").first().text(),
          filter: filter,
          logo: att.find("LOGO").text(),
          offline: !!att.find("OFFLINE_ALLOWED").text(),
          lonlat: [ Number(att.find("LON").text()), Number(att.find("LAT").text()) ],
          layers:[]
        };
        r.offline = r.offline || g.offline;
        att.find("LAYER").each(function()
        {	var l = {	
            nom: $(this).find("NOM").text(),
            type: $(this).find("TYPE").text(),
            description: $(this).find("DESCRIPTION").text(),
            minzoom: Number($(this).find("MINZOOM").text()),
            maxzoom: Number($(this).find("MAXZOOM").text()),
            extent: $(this).find("EXTENT").text().split(","),
            url: $(this).find("URL").text()
          };
          if (l.nom) {
            if (l.type==="WMS" || l.type === 'WMTS') {
              for (var k=0; k<l.extent.length; k++) l.extent[k] = Number(l.extent[k]);
              l.version = $(this).find("VERSION").text();
              l.layer = $(this).find("LAYER").text();
              l.format = $(this).find("FORMAT").text() || "image/png";
              try {
                l.getFeatureInfoMask = JSON.parse($(this).find("GETFEATUREINFOMASK").text());
              } catch(e){ /* ok */ }
            }
            if (l.type==='WFS') {
              // BUG : force https
              l.url = l.url.replace(/^http:/, 'https:');
              l.external = !(new RegExp('^'+ serviceHost)).test(l.url);
              l.version = $(this).find("VERSION").text();
              l.typename = $(this).find("TYPENAME").text();
              l.format = $(this).find("FORMAT").text();
              l.mask = $(this).find("GETFEATUREINFOMASK").text();
              try {
                l.mask = JSON.parse(l.mask);
              } catch(e) { l.mask = false; }
            }
            g.layers.push(l);
          }
        });
        var th={attributs: []}
        var themes = [];
        $(this).find("THEMES >").each(function() {
          switch ($(this).prop("tagName")) {
            case "THEME":
              th = {
                nom: $(this).find('NOM').text(),
                id_groupe: g.id_groupe,
                global: ($(this).find('GLOBAL').text() == 1),
                aide: $(this).find('AIDE').text(),
                attributs: []
              };
              themes.push(th);
              break;
            case "ATTRIBUT":
              att = {
                nom: $(this).find('NOM').text(),
                att: $(this).find('ATT').text(),
                type: $(this).find('TYPE').text(),
                defaultVal: $(this).find('DEFAULTVAL').text(),
                val: {}
              };
              var title = $(this).find('ATT').attr('display');
              if (title) att['title'] = title;
              if ($(this).find('OBLIGATOIRE').length > 0) att.obligatoire = true;
              $(this).find('VAL').each(function() {
                var val = $(this).text();
                att.val[val] = $(this).attr('display') || val;
              });
              switch(att.type) {
                case 'checkbox':
                  att.val = [(att.val[0] == 1)];
                  att.defaultVal = (att.defaultVal == 1 || att.defaultVal==='true');
                break;
                case 'list': 
                case 'date': 
                default:
                break;
              }
              th.attributs.push(att);
              break;
            default: break;
          }
        });
        g.themes = themes;
        r.groupes.push(g);
      });
      r.themes = [];
      var t, th = {};
      var themes = resp.find("THEMES").first();
      themes.find("THEME").each(function() {
        var att = $(this);
        t = {
          nom: att.find("NOM").text(),
          id_groupe: Number(att.find("ID_GEOGROUPE").text()),
          global: ($(this).find('GLOBAL').text() == 1),
          attributs: []
        };
        r.themes.push(t);
        th[t.id_groupe+":"+t.nom] = t;
      });
      themes.find("ATTRIBUT").each(function(){
        var att = $(this);
        var vals = att.find("VAL");
        for (var i=0; i<vals.length; i++) vals[i] = $(vals[i]).text();
        var id = att.find("ID_GEOGROUPE").text()+":"+att.find("NOM").text();
        if (th[id]) th[id].attributs.push({
          att: att.find("ATT").text(),
          type: att.find("TYPE").text(),
          obligatoire: (att.find('OBLIGATOIRE').length > 0),
          val: vals
        });
      });
      // Recover OBLIGATOIRE from profil themes
      r.groupes.forEach((g) => {
        g.themes.forEach((t) => {
          var ti = th[g.id_groupe+':'+t.nom];
          if (ti) {
            ti.attributs.forEach((ai) => {
              t.attributs.forEach((a) => {
                if (ai.obligatoire && ai.att === a.att) {
                  a.obligatoire = true;
                }
              });
            });
          }
        });
      });
      return r;
    }

    // Demander au serveur
    return sendRequest ("geoaut_get", {}, decode, cback);
    /*
    return sendRequest ("geoaut_get", {}, decode, function(auth, error)
    {	if (error) cback(auth, error); 
      else
      {	sendRequest ("geoaut_get", { format:'json' }, null, function(resp) 
        {	console.log(auth, resp);
          cback(auth);
        });
      }
    });
    */
  };

  /**
   * Response callback when get a ripart request
   * @callback RIPart.getGeoremCB
   * @param {} response json response
   * @param {} error
   */

  /** Recuperer les info d'une remontee
  * @param {String} id de la remontee
  * @param {RIPart.getGeoremCB} callback function (response, error)
  * @param {} options 
  * 	@param {boolean} options.croquis extraire les croquis
  */
  this.getGeorem = function (id, cback, options) {
    var groupes = this.param.groupes;
    // Decodage de la reponse
    function decode(resp) {
      return getGeorem (resp.find("GEOREM"), options, groupes);
    }
    // Demander au serveur
    return sendRequest ("georem_get/"+id, {}, decode, cback);
  };

  /** Recuperer un ensemble de remontees
   * @param {Object} params de la requete { offset, limit, territory, departement, group, status, box, ... }
   *  @param {boolean} params.croquis extraire les croquis
   * @param {RIPart.getGeoremCB} callback function (response, error)
   */
  this.getGeorems = function (params, cback) {
    if (!params) params = {};
    var groupes = this.param.groupes;
    var croquis = params.croquis;
    delete params.croquis;
    // Decodage de la reponse
    function decode(resp) {
      var r = [];
      resp.find("GEOREM").each(function() {
        r.push (getGeorem($(this), { croquis: croquis }, groupes));
      });
      return r;
    }
    // Demander au serveur
    return sendRequest ("georems_get", params, decode, cback);
  };

  /** Envoyer une remontee
   * @param {Object} list des parametres a envoyer { comment, geometry, lon,lat, territory, attributes, sketch, features, proj, insee, protocol, version, photo }
   * @param {function} callback function (response, error)
   */
  this.postGeorem = function (params, cback) {
    // Bad command
    if (!params || (
      !Object.prototype.hasOwnProperty.call(params,'geometry') 
      && (
        !Object.prototype.hasOwnProperty.call(params,'lon') 
        || !Object.prototype.hasOwnProperty.call(params,'lat')
      )
    )) {
      if (cback) cback(null, { status:'BADREM'});
      return false;
    }
    // Post parameters
    var post = {
      comment: params.comment,
      geometry: params.geometry || "POINT("+params.lon+" "+params.lat+")",
      territory: params.territory || "FXX",
    };
    // Optional attributes
    if (params.sketch) {
      post.sketch = params.sketch;
    } else if (params.features) {
      post.sketch = this.feature2sketch(params.features, params.proj);
    }
    if (params.id_groupe>0) post.group = params.id_groupe;
    if (params.themes) {
      post.attributes = params.themes;
      if (params.attributes) post.attributes += params.attributes;
    }
    if (params.insee) post.insee = params.insee;
    if (params.protocol) post.protocol = params.protocol;
    if (params.version) post.version = params.version;
    if (params.photo) post.photo = params.photo;
    // Decode response
    var groupes = this.param.groupes;
    function decode(resp) {
      return getGeorem (resp.find("GEOREM"), { croquis: true }, groupes);
    }
    // Send request
    return sendRequest ("georem_post", post, decode, cback);
  };

  /** Send a response
   * @param {Object} georep parameters to send { id, comment, statut }
   * @param {function} callback function (response, error)
   * @return {boolean} false if not connected
   */
  this.postGeorep = function (georep, cback) {
    var groupes = this.param.groupes;
    function decode(resp) {
      return getGeorem (resp.find("GEOREM"), { croquis: true }, groupes);
    }
    var post = {
      id: georep.id,
      title: georep.title || '',
      content: georep.comment,
      status: georep.statut
    }
    return sendRequest ("georep_post", post, decode, cback);
  };

  /** Get feature(s) from sketch
  * @param {String} sketch the sketch
  * @param {ol.proj.ProjectionLike} proj projection of the features, default `EPSG:3857`
  * @return {Array<ol.feature>} the feature(s)
  */
  this.sketch2feature = function(sketch , proj) {
    const features = [];
    sketch = "<CROQUIS>"+sketch+"</CROQUIS>";
    var xml = $.parseXML(sketch.replace(/gml:|xmlns:/g,""));
    var objects = $(xml).find("objet");
    for (var i=0, f; f=objects[i]; i++) {
      var atts = $(f).find("attribut");
      var prop = {};
      for (var j=0, a; a=atts[j]; j++) {
        prop[$(a).attr("name")] = $(a).text();
      }
      var g = $(f).find("coordinates").text().split(" ");
      for (var k=0; k<g.length; k++) {
        g[k] = g[k].split(',');
        g[k][0] = Number(g[k][0]);
        g[k][1] = Number(g[k][1]);
      }
      switch ($(f).attr('type')) {
        case "Point":
        case "Texte":
          prop.geometry = new ol_geom_Point(g[0]);
        break;
        case "LineString":
        case "Ligne":
          prop.geometry = new ol_geom_LineString(g);
        break;
        case "Polygon":
        case "Polygone":
          prop.geometry = new ol_geom_Polygon([g]);
        break;
        default: continue;
      }
      prop.geometry.transform("EPSG:4326", proj||"EPSG:3857")
      features.push (new ol_Feature(prop));
    }
    return features;
  };
  
  /** Write feature(s) to sketch
  * @param {ol.feature|Array<ol.feature>} the feature(s) to write
  * @param {ol.proj.ProjectionLike} projection of the features
  * @return {String} the sketch
  */
  this.feature2sketch = function(f , proj) {
    if (!f) return "";
    if (!(f instanceof Array)) f = [f];
    const format = new ol_format_GeoJSON();
    var croquis = "";
    var symb = "<symbole><graphicName>circle</graphicName><diam>2</diam><frontcolor>#FFAA00;1</frontcolor><backcolor>#FFAA00;0.5</backcolor></symbole>";
    var pt = f[0].getGeometry().getFirstCoordinate();
    if (proj) {
      pt = ol_proj_transform(pt, proj, 'EPSG:4326')
    }
    croquis += "<contexte><lon>"+pt[0].toFixed(7)+"</lon><lat>"+pt[1].toFixed(7)+"</lat><zoom>15</zoom><layers><layer>GEOGRAPHICALGRIDSYSTEMS.MAPS</layer></layers></contexte>";
    //var format = new ol.format.GML({ featureNS:'', featurePrefix: 'gml', extractAttributes: false });
    for (var i=0; i<f.length; i++) {
      var t=""; 
      var geo="", g = f[i].getGeometry().clone();
      var att = f[i].getProperties();
      delete att.geometry;
      if (proj) {
        g.transform(proj, 'EPSG:4326');
      }
      if (g.getLayout()==='XYZM') att.geom = format.writeGeometry(g);
      g = g.getCoordinates();
      // Geometry
      switch (f[i].getGeometry().getType()) {
        case 'Point': 
          t = 'Point'; 
          g = [g];
          geo = "<geometrie><gml:Point><gml:coordinates>COORDS</gml:coordinates></gml:Point></geometrie>";
          break;
        case 'LineString': 
          t = 'Ligne'; 
          geo = "<geometrie><gml:LineString><gml:coordinates>COORDS</gml:coordinates></gml:LineString></geometrie>";
          break;
        case 'MultiPolygon': 
          g = g[0];
          // falls through
        case 'Polygon': 
          t = 'Polygone'; 
          g = g[0];
          geo = "<geometrie><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>COORDS</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></geometrie>";
          break;
      }
      // Attributes
      var a, attr = "";
      for (a  in att) {
        if (!(att[a] instanceof Feature)) {
          attr += '<attribut name="'+a.replace('"',"_")+'">'
            + String(att[a]).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") 
            +'</attribut>';
        }
      }
      attr = "<attributs>"+attr+"</attributs>";
      // Write!
      if (t) {
        var coords="";
        for (var k=0; k<g.length; k++) {
          coords += ( k>0 ? ' ' : '') 
            + g[k][0].toFixed(7) +','
            + g[k][1].toFixed(7);
        }
        croquis += "<objet type='"+t+"'><nom></nom>" + symb + attr + geo.replace('COORDS', coords) + "</objet>";
      }
    }
    croquis = "<CROQUIS xmlns:gml='http://www.opengis.net/gml' version='1.0'>"+croquis+"</CROQUIS>";
    return croquis;
  };


  /** Encrypt password in groupes object
   * @param {*} list of groupes with password key
   * @param {boolean} crypt true: encrypt, false: decrypt
   */
  function cryptPwd (groupes, crypt) {
    if (!groupes) return;
    for (var i=0, g; g=groupes[i]; i++) {
      for (var j=0, l; l=g.layers[j]; j++) {
        if (l.password) {
          if (crypt) {
            l.password = CryptoJS.AES.encrypt(l.password, secret).toString();
          } else {
            l.password = CryptoJS.AES.decrypt(l.password, secret).toString(CryptoJS.enc.Utf8);
          }
        }
      }
    }
  }

  /** Load connection parameters to wappStorage
   * + decrypt password
   */
  this.loadParam = function() {
    this.param = wappStorage('ripart') || { georems:[], nbrem:0 };
    cryptPwd (this.param.groupes, false);
  };

  /** Save connection parameters to wappStorage
   * + encrypt password
   */
  this.saveParam = function() {
    var pwd = this.param.pwd;
    // Ne pas sauvegarder les mots de passe 
    // if (!window.cordova) delete this.param.pwd;
    // Ou les encrypter
    cryptPwd (this.param.groupes, true);
    // Enregistrer
    wappStorage('ripart', this.param);
    // Decrypter
    cryptPwd (this.param.groupes, false);
    this.param.pwd = pwd;
    this.onUpdate();
  };

  /** Load file from server 
   * @param {string} url file url
   * @param {function} callback
   * @param {string} mimeType 
   * @api
   */
  this.loadDocument = function(url, callback, mimeType) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    var hash = btoa(user+":"+pwd);
    xhr.setRequestHeader("Authorization", "Basic " + hash);
    xhr.setRequestHeader("Accept-Language", null);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: mimeType || 'image/jpeg' });
      const urlCreator = window.URL || window.webkitURL;
      callback(urlCreator.createObjectURL(blob));
    };
    xhr.onerror = function () {
    };
    xhr.send();
  };

  this.loadParam();
  this.initialize(options);
};

/** Logout */
RIPart.prototype.logout = function() {
  this.param = { georems:[], nbrem:0 };
  if (this.layer) this.layer.getSource().clear();
  this.saveParam();
};

/** Get current profil */
RIPart.prototype.getProfil = function() {
  return this.param.profil;
};

/**
  * Recupere le groupe avec son identifiant
  * @param {number} id 
  * @return {groupe | null}
  */
RIPart.prototype.getGroupById = function(id) {
  var g = null;
  if (this.param.groupes) {
    for (var i=0; g=this.param.groupes[i]; i++) {
      if (g.id_groupe === id) break;
    }
  }
  return g;
};

/**
 * Recupere le guichet courant
 * @return {groupe | null}
 */
RIPart.prototype.getGuichet = function() {
  return this.getGroupById(wapp.ripart.param.guichet);
};

/** Initialize function 
 * @api
 */
RIPart.prototype.initialize = function(/* options */) {};

/** Samething has changed
 * @api
 */
RIPart.prototype.onUpdate = function() {};

/** Deconect
 * @api
 */
RIPart.prototype.deconnect = function() {
  this.param = { georems:[], nbrem:0 };
  this.saveParam();
  this.onUpdate();
  // Clear credentials
  var win;
  if (window.cordova) {
    if (cordova.InAppBrowser) {
      win = cordova.InAppBrowser.open('logout.html','_blank','clearsessioncache=yes,hidden=yes');
    } else {
      console.warn('InAppBrowser plugin is missing...');
    }
  } else {
    win = window.open('logout.html','_blank','clearsessioncache=yes,hidden=yes');
  }
  if (win) setTimeout(function(){ win.close(); }, 100);
};

/** Status */
RIPart.status = {
  "submit": "Reçu dans nos services", 
  "pending": "En cours de traitement",
  "pending1": "En attente de saisie", 
  "pending2": "En attente de validation", 
  "valid": "Pris en compte",
  "valid0": "Déjà pris en compte",
  "reject": "Rejeté (hors spéc.)",
  "reject0": "Rejeté (hors propos)",
  "pending0": "En demande de qualification"
};

export default RIPart;
