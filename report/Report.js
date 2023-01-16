import {ApiClient} from 'collaboratif-client-api';
import { wappStorage } from 'cordovapp/cordovapp/CordovApp'
import ol_Feature from 'ol/Feature'
import ol_geom_Point from 'ol/geom/Point'
import ol_geom_LineString from 'ol/geom/LineString'
import ol_geom_Polygon from 'ol/geom/Polygon'

class Report {
    static status = {
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
    /**
     * @constructor
     * @param {ApiClient} apiClient
     */
    constructor (apiClient, options) {
        this.options = options || {};
        this.param = {};
        this.apiClient = apiClient;

        this.loadParam();
        this.initialize(options);
    }

    /**
     * Envoyer une remontee
     * upload file
     * @param {Object} params liste des parametres a envoyer { comment, geometry, lon,lat, territory, attributes, sketch, features, proj, insee, protocol, version, photo }
     * @param {function} callback function (response, error)
     */
    postGeorem(params, callback) {
        var self = this;
        // Bad command
        if (!params || (
            !Object.prototype.hasOwnProperty.call(params,'geometry') 
            && (
            !Object.prototype.hasOwnProperty.call(params,'lon') 
            || !Object.prototype.hasOwnProperty.call(params,'lat')
            )
        )) {
            throw Error('BADREM: neither geometry, lon or lat exists');
        }

        // Post parameters
        var post = {
            comment: params.comment,
            geometry: params.geometry || "POINT("+params.lon+" "+params.lat+")"
        };
        // Optional attributes
        if (params.sketch) {
            post.sketch = params.sketch;
        } else if (params.features) {
            post.sketch = this.feature2sketch(params.features, params.proj);
        }
        if (params.community_id>0) post.community = params.community_id;
        if (params.themes) {
            let th = params.themes.split("::");
            var group = parseInt(th[0]);
            post.attributes = {
                "community": group,
                "theme": params.theme,
                "attributes": JSON.parse(params.attributes)
            }
        }

        if (params.photo) {
            CordovApp.File.getBlob (
                params.photo,
                function(blob) {
                    post.photo = blob;
                    self.apiClient.addReport(post).then((response) => {
                        callback({"error": false, "data": response.data});
                    }).catch((error) => {
                        callback({"error": true, "data": error});
                    });
                },
                callback
            );
        }
        else {
            this.apiClient.addReport(post).then((response) => {
                callback({"error": false, "data": response.data});
            }).catch((error) => {
                callback({"error": true, "data": error});
            });
        }
    }

    /** Get feature(s) from sketch
     * @param {String} sketch the sketch
     * @param {ol.proj.ProjectionLike} proj projection of the features, default `EPSG:3857`
     * @return {Array<ol.feature>} the feature(s)
     */
    sketch2feature(sketch , proj) {
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
    feature2sketch(f , proj) {
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
            if (!(att[a] instanceof ol_Feature)) {
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

    /**
     * Load connection parameters to wappStorage
     * @returns {void}
     */
     loadParam() {
        this.param = wappStorage('report') || { georems: [], nbrem: 0};
    }

    /**
     * Initialize function
     * @api
     */
    initialize(/* options */) {};
    
    /**
     * Something has changed
     * @api
     */
    onUpdate() {};

    /**
     * Logout
     * @returns {void}
     */
    logout() {
        this.param = { georems:[], nbrem:0 };
        if (this.layer) this.layer.getSource().clear();
        this.saveParam();
    }

    /**
     * Sauvegarde dans les parametres 
     * restent en cache a la fermeture de l'appli
     * @returns {void}
     */
    saveParam() {
        wappStorage('report', this.param);
        this.onUpdate();
    }

    /** 
     * Get current profil 
     * @returns {Object}
     */
    getProfil() {
        return this.param.profil;
    };

    /**
     * definit si l utilisateur courant a les droits de repondre a une alerte
     * ses groupes doivent etre passes en parametre
     * @param {Object} georem 
     * @returns {Boolean}
     */
    canReply(georem) {
        let communities = wapp.userManager.param.communities;
        let communityIds = communities.map(c => c.id);
        for (var i in georem.attributes) {
            if (communityIds.indexOf(georem.attributes[i].community) == -1) return false;
        }
        return true;
    }
}

export default Report;