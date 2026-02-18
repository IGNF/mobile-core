import Feature from 'ol/Feature';
import { transform } from 'ol/proj';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import { SimpleGeometry } from 'ol/geom';
import { getCenter } from 'ol/extent';
import { DEFAULT_REPORT_VALUES } from './DefaultReportValues';
import EventManager from '../utils/EventManager';
/**
 * Report manager
 */
export class ReportManager {
    constructor(apiClient, storage, options = {}) {
        this._defaultParams = {
            georems: {},
            protocol: 'georem',
            version: '1.0',
            territory: 'fr',
            theme: '',
            themes: '',
            insee: ''
        };
        this._apiClient = apiClient;
        this._storage = storage;
        this._eventManager = new EventManager();
        this.options = options;
        // Initialize params from storage or defaults
        const storedParams = this._storage.loadParams('report');
        this.params = {
            ...this._defaultParams,
            ...options.defaultParams,
            ...storedParams
        };
        // Set communityId and themeId if provided in options
        if (options.communityId) {
            this.params.communityId = options.communityId;
        }
        if (options.themeId) {
            this.params.themeId = options.themeId;
        }
    }
    /**
     * Event subscription methods
     */
    on(event, handler) {
        this._eventManager.on(event, handler);
    }
    off(event, handler) {
        this._eventManager.off(event, handler);
    }
    once(event, handler) {
        this._eventManager.once(event, handler);
    }
    emit(event, data) {
        this._eventManager.emit(event, data);
    }
    /**
     * Create a new report *locally*
     * equivalent to postGeorem of ReportForm.js
     * @param report
     *
     * TODO: see the difference between the local and server report creation
     */
    async createReport(params, withSubmit = false) {
        if (!this.params || !this.params.geometry || (!this.params.lon && !this.params.lat)) {
            throw Error('BADREM: neither geometry, lon or lat exists');
        }
        const post = {
            comment: params.comment,
            geometry: this.params.geometry || `POINT(${this.params.lon} ${this.params.lat})`,
        };
        // Optional attributes => to implement
        if (params.sketch) {
            post.sketch = params.sketch;
        }
        else if (params.features) {
            post.sketch = this.feature2sketch(params.features, this.params.proj);
        }
        post.community = params.communityId > 0 ? params.communityId : "-1";
        // Parse theme string (format: "groupId::themeName") and bundle with custom attributes
        if (params.themes) {
            let th = params.themes.split("::");
            var group = parseInt(th[0]);
            post.attributes = JSON.stringify({
                "community": group,
                "theme": params.theme,
                "attributes": params.attributes ? JSON.parse(params.attributes) : {}
            });
        }
        try {
            // if withSubmit?
            const response = await this._apiClient.addReport(post);
            const reportId = response.data.id;
            const report = response.data;
            if (params.photos && params.photos.length) {
                params.photosToSend = true;
            }
            await this.uploadAttachements(reportId, params); // see type here
            // Emit success event
            this.emit('report:created', { report });
            if (withSubmit) {
                this.emit('report:submitted', { report, serverId: reportId });
            }
            return report;
        }
        catch (error) {
            this.emit('report:error', {
                error,
                message: error.message || 'Failed to create report'
            });
            throw error;
        }
    }
    /**
     * Submit a report to the server
     * @param _reportId
     */
    async submitReport(_reportId) {
        throw new Error('Not implemented');
    }
    /**
     * See if the type is correct
     * equivalent to postPhotosPending of ReportForm.js
     * @param file: File to upload
     */
    async uploadAttachements(reportId, report) {
        if (!report.photos || !report.photos?.length || !report.photosToSend)
            return;
        const gremIndice = new Date().getTime(); // temporary index, the getIndice is actually implemented in ReportForm.js, L418
        // const gremIndice = this.getIndice(grem);
        // Initialize georems if not present
        if (!this.params.georems) {
            this.params.georems = {};
        }
        // Initialize this specific georem entry if not present
        if (!this.params.georems[gremIndice]) {
            this.params.georems[gremIndice] = {};
        }
        this.params.georems[gremIndice].photosToSend = false;
        delete this.params.georems[gremIndice].error;
        const photos = report.photos;
        this.emit('attachment:uploading', { reportId, progress: 0 });
        try {
            const blobs = await Promise.all(photos.map((photo) => this._storage.getBlob(photo)) // this will be implemented on the consuming app
            );
            const post = {};
            blobs.forEach((blob, index) => {
                post[`photo${index}`] = blob;
            });
            await this._apiClient.addAttachments(reportId, post);
            await this._storage.saveParam(this.params);
            this.emit('attachment:uploaded', { reportId, attachmentId: gremIndice });
            // this.onUpdate(); // see what this does
        }
        catch (error) {
            if (this.params.georems && this.params.georems[gremIndice]) {
                this.params.georems[gremIndice].photosToSend = true;
                this.params.georems[gremIndice].error = error?.message || "Echec d'envoi des images";
            }
            await this._storage.saveParam(this.params);
            const uploadError = error instanceof Error
                ? error
                : new Error("Echec d'envoi des images");
            this.emit('report:error', {
                error: uploadError,
                message: uploadError.message || "Echec d'envoi des images"
            });
            // this.onUpdate(); // see what this does
            throw uploadError;
        }
    }
    /**
     * Update a report locally
     * Note: Once submitted, the report is no longer editable
     * @param _report
     */
    async updateReport(_report) {
        throw new Error('Not implemented');
    }
    /**
     * Delete a report
     * @param _reportId
     */
    async deleteReport(_reportId) {
        throw new Error('Not implemented');
    }
    /**
     * Get a report
     * @param _reportId
     * @param _fromServer
     */
    async getReport(_reportId, _fromServer = true) {
        throw new Error('Not implemented');
    }
    /**
     * List reports
     * @param _filter
     * @param _fromServer
     */
    async listReports(_filter, _fromServer = true) {
        throw new Error('Not implemented');
    }
    /** Write feature(s) to sketch
       * @param {ol.feature|Array<ol.feature>} the feature(s) to write
       * @param {ol.proj.ProjectionLike} projection of the features (optional, defaults to WGS84)
       * @return {Object} the sketch in json format
       */
    feature2sketch(features, proj) {
        if (!features)
            return "";
        if (!(features instanceof Array))
            features = [features];
        const format = new WKT();
        const geoJsonFormat = new GeoJSON();
        let projectionTransform;
        const geometry = features[0]?.getGeometry();
        // we add a test here because getGeometry seems to return a Geometry object, not a SimpleGeometry object
        // but Geometry does not have a getFirstCoordinate method
        if (geometry instanceof SimpleGeometry) {
            projectionTransform = geometry.getFirstCoordinate();
        }
        else if (geometry) { // just as fallback
            projectionTransform = getCenter(geometry.getExtent());
        }
        if (projectionTransform && proj) {
            projectionTransform = transform(projectionTransform, proj, DEFAULT_REPORT_VALUES.FEATURE2SKETCH.TRANSFORM_PROJECTION);
        }
        const croquis = {
            context: {
                ...DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT,
                lon: projectionTransform?.[0]?.toFixed(7) || DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT.lon,
                lat: projectionTransform?.[1]?.toFixed(7) || DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT.lat,
            },
            objects: []
        };
        for (const feature of features) {
            const object = { style: DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_STYLE };
            const geoClone = feature.getGeometry()?.clone();
            const attributes = feature.getProperties();
            delete attributes.geometry;
            if (proj) {
                geoClone?.transform(proj, DEFAULT_REPORT_VALUES.FEATURE2SKETCH.TRANSFORM_PROJECTION);
            }
            if (geoClone?.getLayout() === 'XYZM') {
                attributes.geom = geoJsonFormat.writeGeometry(geoClone);
            }
            object.name = "";
            object.attributes = attributes;
            object.geometry = format.writeGeometry(geoClone);
            switch (geoClone?.getType()) {
                case 'Point':
                    object.type = 'Point';
                    break;
                case 'LineString':
                    object.type = 'LineString';
                    break;
                case 'Polygon':
                case 'MultiPolygon':
                    object.type = 'Polygone';
                    break;
            }
            croquis.objects.push(object);
        }
        return JSON.stringify(croquis);
    }
    /** Get feature(s) from sketch
      * @param sketch the sketch in json
      * @param proj projection of the features, default `EPSG:3857`
      * @return the feature(s)
      */
    sketch2feature(sketch, proj) {
        if (typeof sketch === 'string') {
            sketch = JSON.parse(sketch);
        }
        const features = [];
        const format = new WKT();
        const objects = sketch.objects;
        for (const object of objects) {
            const prop = object.attributes ? object.attributes : {};
            prop.geometry = format.readGeometry(object.geometry);
            prop.geometry.transform(DEFAULT_REPORT_VALUES.SKETCH2FEATURE.TRANSFORM_PROJECTION, proj || DEFAULT_REPORT_VALUES.SKETCH2FEATURE.TRANSFORM_PROJECTION_FALLBACK);
            features.push(new Feature(prop));
        }
        return features;
    }
}
//# sourceMappingURL=ReportManager.js.map