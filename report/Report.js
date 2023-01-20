import {ApiClient} from 'collaboratif-client-api';
import { wappStorage } from 'cordovapp/cordovapp/CordovApp'
import ol_Feature from 'ol/Feature'
import ol_geom_Point from 'ol/geom/Point'
import ol_geom_LineString from 'ol/geom/LineString'
import ol_geom_Polygon from 'ol/geom/Polygon'
import ol_format_WKT from 'ol/format/WKT'
import {transform as ol_proj_transform} from 'ol/proj'


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
        post.community = params.community_id>0 ? params.community_id : "-1";
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
     * @param {String} sketch the sketch in json
     * @param {ol.proj.ProjectionLike} proj projection of the features, default `EPSG:3857`
     * @return {Array<ol.feature>} the feature(s)
     */
    sketch2feature(sketch , proj) {
        if (typeof(sketch) === "string") sketch = JSON.parse(sketch);
        const features = [];
        const format = new ol_format_WKT();
        let objects = sketch.objects;
        for (var i=0, f; f=objects[i]; i++) {
            var prop = f.attributes ? f.attributes : {};
            prop.geometry = format.readGeometry(f.geometry);
            prop.geometry.transform("EPSG:4326", proj||"EPSG:3857")
            features.push (new ol_Feature(prop));
        }
        return features;
    };


    /** Write feature(s) to sketch
     * @param {ol.feature|Array<ol.feature>} the feature(s) to write
     * @param {ol.proj.ProjectionLike} projection of the features
     * @return {Object} the sketch in json format
     */
    feature2sketch(f , proj) {
        if (!f) return "";
        if (!(f instanceof Array)) f = [f];
        const format = new ol_format_WKT();
        var pt = f[0].getGeometry().getFirstCoordinate();
        if (proj) {
            pt = ol_proj_transform(pt, proj, 'EPSG:4326')
        }

        let style = {
            "graphicName": "circle",
            "diam": 2,
            "frontcolor": "#FFAA00;1",
            "backcolor": "#FFAA00;0.5"
        };

        var croquis = {
            "contexte": {
                "lon": pt[0].toFixed(7),
                "lat": pt[1].toFixed(7),
                "zoom": 15,
                "layers": ["GEOGRAPHICALGRIDSYSTEMS.MAPS"]
            },
            "objects": []
        };

        for (var i=0; i<f.length; i++) {
            var t=""; 
            var object = {"style": style};
            var g = f[i].getGeometry().clone();
            var att = f[i].getProperties();
            delete att.geometry;
            if (proj) {
                g.transform(proj, 'EPSG:4326');
            }
            object.name = "";
            object.attributes = att;
            object.geometry = format.writeGeometry(g);
            // Geometry
            switch (f[i].getGeometry().getType()) {
                case 'Point': 
                    t = 'Point';
                    break;
                case 'LineString': 
                    t = 'Ligne'; 
                    break;
                case 'MultiPolygon': 
                case 'Polygon': 
                    t = 'Polygone';
                    break;
            }
            object.type = t;
            croquis.objects.push(object);
        }
        return JSON.stringify(croquis);
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