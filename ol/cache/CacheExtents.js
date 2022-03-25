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
     */
    add(name, extents) {
        if (!this.wapp.param.cacheExtents) this.wapp.param.cacheExtents = {};
        this.wapp.param.cacheExtents[name] = extents;
        this.wapp.saveParam();
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
     * Tableau clé valeur des noms de zones avec la cle new en plus
     */
    getExtentNamesPlusNew() {
        let names = this.getNames();
        let extentsNames = {};
        for (var i in names) {
            extentsNames[names[i]] = names[i];
        }
        extentsNames["new"] = "Nouvelle..."
        return extentsNames;
    }

    /**
     * recupere un seul extent incluant tous les autres
     */
    getAllInOneExtent(name) {
        let extent = ol_extent_createEmpty();
        let extents = this.get(name);
        for (let i in extents) {
            ol_extent_extend(extent, extents[i]);
        }
        return extent;
    }
}

export default CacheExtents;