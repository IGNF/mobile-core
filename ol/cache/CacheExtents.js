import {extend as ol_extent_extend} from 'ol/extent'
import {createEmpty as ol_extent_createEmpty} from 'ol/extent'

/**
 * Classe de gestion des zones preenregistrees pour la creation des caches
 */
class CacheExtents {
    constructor(wapp) {
        this.wapp = wapp;
    }

    /**
     * Ajoute une nouvelle zone
     * @param {String} name 
     * @param {Array<ol.extent>} extents 
     * @return {String} name
     */
    add(name, extents) {
        if (!this.wapp.param.cacheExtents) this.wapp.param.cacheExtents = {};
        let indice = Object.keys(this.wapp.param.cacheExtents).length;
        if (!name) name = "Sans titre " + indice;
        if (!Array.isArray(extents)) extents = [extents];
        this.wapp.param.cacheExtents[name] = extents;
        this.wapp.saveParam();
        return name;
    }

    /**
     * Ajoute une étendue à une zone
     * @param {String} name 
     * @param {ol.extent} extent
     */
    addExtent(name, extent) {
        if (!this.wapp.param.cacheExtents) this.wapp.param.cacheExtents = {};
        if (!this.wapp.param.cacheExtents[name]) this.wapp.param.cacheExtents[name] = [];
        this.wapp.param.cacheExtents[name].push(extent);
        this.wapp.saveParam();
    }

    /**
     * retourne le tableau extents pour un nom donne
     * ou tous les cacheExtents enregistres si aucun nom fourni
     * null si non trouve
     * @param {String} name 
     * @return {*}
     */
    get(name) {
        if (!this.wapp.param.cacheExtents) return {};
        if (!name) return this.wapp.param.cacheExtents;
        if (!this.wapp.param.cacheExtents[name]) return [];
        return this.wapp.param.cacheExtents[name];
    }

    /**
     * Retoure le nom des extents enregistrees
     * @returns {Array<String>}
     * 
     */
    getNames() {
        if (!this.wapp.param.cacheExtents) return [];
        return Object.keys(this.wapp.param.cacheExtents);
    }

    /**
     * 
     * @param {String} name 
     * @return {void}
     */
    remove(name) {
        if (!this.wapp.param.cacheExtents || !this.wapp.param.cacheExtents[name]) return;
        delete this.wapp.param.cacheExtents[name];
        this.wapp.saveParam();
    }

    /**
     * Centrer le cache sur les extents
     * @param {String} name
     * @returns {void}
     */
    center(name) {
        let extents = this.get(name);
        if (!extents || !extents.length) {
            return;
        }
        let extent = this.getAllInOneExtent(name);
        this.wapp.map.getView().fit(extent);
    }

    /**
     * Afficher le contour des extents donnees
     * @param {ol.layer.Vector} l la couche sur laquelle on veut afficher le contour des extents
     * @param {String} extentNameKey cle servant a stocker le nom de l extent qu on veut afficher sur la layer
     */ 
    addPostcompose(l, extentNameKey) {
        var self = this;
        l.on('postcompose', function(e){
            let cacheExtentName = l.get(extentNameKey);
            if (!cacheExtentName) return;
            let extents = self.get(cacheExtentName);
            if (!extents || !extents.length) return;
            var canvas = document.createElement('canvas');
            canvas.width = e.context.canvas.width;
            canvas.height = e.context.canvas.height;
            var ctx = canvas.getContext('2d');
            if (!extents || !extents.length) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
            ctx.strokeStyle = 'rgb(255,0,0)';
            ctx.lineWidth = Math.max(30, 1000 * e.frameState.pixelRatio / e.frameState.viewState.resolution);
            ctx.scale(e.frameState.pixelRatio,e.frameState.pixelRatio);
            var rects = [];
            var k, extent, r;
            ctx.beginPath();
            for (k=0, extent; extent=extents[k]; k++) {
                var p0 = self.wapp.map.getPixelFromCoordinate([extent[0], extent[1]]);
                var p1 = self.wapp.map.getPixelFromCoordinate([extent[2], extent[3]]);
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

    /**
     * Tableau clé valeur des noms de zones
     * @return {Array<String>} 
     */
    getExtentNames() {
        let names = this.getNames();
        let extentsNames = {};
        for (var i in names) {
            extentsNames[names[i]] = names[i];
        }
        return extentsNames;
    }

    /**
     * Recupere un seul extent incluant tous les autres
     * @param {String or Array<String>} names
     * @return {ol.extent}
     */
    getAllInOneExtent(names) {
        let extent = ol_extent_createEmpty();
        let extents = Array.isArray(names) ? this.getAllExtents(names) : this.get(names);
        for (let i in extents) {
            ol_extent_extend(extent, extents[i]);
        }
        return extent;
    }

    /**
     * Recupere un tableau de tous les extents
     * @param {Array<String>} names
     * @return {Array<ol.extent>}
     */
    getAllExtents(names) {
        if (!Array.isArray(names)) throw new Error("names parameter must be an array");
        let extentsArr = [];
        for (let i in names) {
            extentsArr = extentsArr.concat(this.get(names[i])); 
        }
        return extentsArr;
    }
}

export default CacheExtents;