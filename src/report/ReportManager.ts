/**
 * Report manager
 * Manages the creation, submission, and management of reports
 * 
 * @migrated from: report/Report.js
 * 
 * Events:
 * - 'report:created': Emitted when a report is created
 * - 'report:updated': Emitted when a report is updated
 * - 'report:deleted': Emitted when a report is deleted
 * - 'report:submitted': Emitted when a report is submitted to server
 * - 'report:error': Emitted when an error occurs
 * - 'attachment:uploading': Emitted during photo upload
 * - 'attachment:uploaded': Emitted when a photo is uploaded
 * 
 * TODO:
 * - See if the functions FEATURE2SKETCH and feature2sketch are required here, and what they do (see report/Report.js line 131)
 */
import { ApiClient } from 'collaboratif-client-api';

// Local types
import { 
  Report, 
  ReportPostParams,
  ReportManagerOptions,
  ReportManagerParams,
  ReportManagerEvents
} from './types';
import { ReportFilter } from '../sources/types';
import { IReportStorage } from '../abstracts/IReportStorage';
import Feature from 'ol/Feature';
import { Projection, transform } from 'ol/proj';
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
  private _apiClient: ApiClient;
  private _storage: IReportStorage;
  private _eventManager: EventManager;

  public options: ReportManagerOptions;
  public params: ReportManagerParams;

  private _defaultParams: ReportManagerParams = { 
    georems: {}, 
    protocol: 'georem',
    version: '1.0',
    territory: 'fr',
    theme: '',
    themes: '',
    insee: ''
  };

  constructor(apiClient: ApiClient, storage: IReportStorage, options: ReportManagerOptions = {}) {
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
  on<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void {
    this._eventManager.on(event, handler);
  }

  off<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void {
    this._eventManager.off(event, handler);
  }

  once<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void {
    this._eventManager.once(event, handler);
  }

  private emit<K extends keyof ReportManagerEvents>(event: K, data: ReportManagerEvents[K]): void {
    this._eventManager.emit(event, data);
  }

  /**
   * Create a new report *locally*
   * equivalent to postGeorem of ReportForm.js
   * @param report 
   * 
   * TODO: see the difference between the local and server report creation
   */
  async createReport(params: ReportPostParams, withSubmit: boolean = false): Promise<Report> {
    if (!this.params || !this.params.geometry || (!this.params.lon && !this.params.lat)) {
      throw Error('BADREM: neither geometry, lon or lat exists');
    }

    const post: any = {
      comment: params.comment,
      geometry: this.params.geometry || `POINT(${this.params.lon} ${this.params.lat})`,
    };

    // Optional attributes => to implement
    if (params.sketch) {
      post.sketch = params.sketch;
    } else if (params.features) {
      post.sketch = this.feature2sketch(params.features, this.params.proj);
    }


    post.community = params.communityId > 0 ? params.communityId : "-1";
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
      const report: Report = response.data;

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
    } catch (error: any) {
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
  async submitReport(_reportId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * See if the type is correct
   * equivalent to postPhotosPending of ReportForm.js
   * @param file: File to upload
   */
  async uploadAttachements(reportId: number, report: ReportPostParams): Promise<void> {
    if (!report.photos || !report.photos?.length || !report.photosToSend) return;

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

    const photoPromises = [];
    for (const i in photos) {
      photoPromises.push(this._storage.getBlob(photos[i])); //  this will be implemented on the consuming app
    }
    
    this.emit('attachment:uploading', { reportId, progress: 0 });
    
    Promise.all(photoPromises).then((blobs) => {
      const post: any = {};
      for (const i in blobs) {
        post["photo" + i] = blobs[i];
      }
      this._apiClient.addAttachments(reportId, post).then(() => {
        setTimeout(() => {
          this._storage.saveParam(this.params);
          this.emit('attachment:uploaded', { reportId, attachmentId: gremIndice });
          // this.onUpdate(); // see what this does
        }, 300)
      }).catch(() => {
        if (this.params.georems && this.params.georems[gremIndice]) {
          this.params.georems[gremIndice].photosToSend = true;
          this.params.georems[gremIndice].error = "Echec d'envoi des images";
        }
        this._storage.saveParam(this.params);
        this.emit('report:error', { 
          error: new Error("Echec d'envoi des images"), 
          message: "Echec d'envoi des images" 
        });
        // this.onUpdate(); // see what this does
      })
    }).catch((error) => {
      if (this.params.georems && this.params.georems[gremIndice]) {
        this.params.georems[gremIndice].photosToSend = true;
        this.params.georems[gremIndice].error = error;
      }
      this._storage.saveParam(this.params);
      this.emit('report:error', { 
        error, 
        message: error.message || 'Failed to upload attachments' 
      });
      // this.onUpdate(); // see what this does
    });
  }

  /**
   * Update a report locally
   * Note: Once submitted, the report is no longer editable
   * @param _report 
   */
  async updateReport(_report: Partial<Report>): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * Delete a report
   * @param _reportId 
   */
  async deleteReport(_reportId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Get a report
   * @param _reportId 
   * @param _fromServer
   */
  async getReport(_reportId: number, _fromServer: boolean = true): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * List reports
   * @param _filter 
   * @param _fromServer
   */
  async listReports(_filter?: ReportFilter, _fromServer: boolean = true): Promise<Report[]> {
    throw new Error('Not implemented');
  }

  /** Write feature(s) to sketch
     * @param {ol.feature|Array<ol.feature>} the feature(s) to write
     * @param {ol.proj.ProjectionLike} projection of the features (optional, defaults to WGS84)
     * @return {Object} the sketch in json format
     */
  feature2sketch(features: Feature[], proj?: Projection): string {
    if (!features) return "";
    if (!(features instanceof Array)) features = [features];

    const format = new WKT();
    const geoJsonFormat = new GeoJSON();
    let projectionTransform;

    const geometry = features[0]?.getGeometry();
    // we add a test here because getGeometry seems to return a Geometry object, not a SimpleGeometry object
    // but Geometry does not have a getFirstCoordinate method
    if (geometry instanceof SimpleGeometry) {
      projectionTransform = geometry.getFirstCoordinate();
    } else if (geometry) { // just as fallback
      projectionTransform = getCenter(geometry.getExtent());
    }

    if (projectionTransform && proj) {
      projectionTransform = transform(projectionTransform, proj, DEFAULT_REPORT_VALUES.FEATURE2SKETCH.TRANSFORM_PROJECTION);
    }

    const croquis: any = {
      context: {
        ...DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT,
        lon: projectionTransform?.[0]?.toFixed(7) || DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT.lon,
        lat: projectionTransform?.[1]?.toFixed(7) || DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_CONTEXT.lat,
      },
      objects: []
    };

    for (const feature of features) {
      const object: any = { style: DEFAULT_REPORT_VALUES.FEATURE2SKETCH.SKETCH_STYLE };
      const geoClone = feature.getGeometry()?.clone();
      const attributes = feature.getProperties();
      delete attributes.geometry;

      if (proj) {
        geoClone?.transform(proj, DEFAULT_REPORT_VALUES.FEATURE2SKETCH.TRANSFORM_PROJECTION);
      }
      if ((geoClone as SimpleGeometry)?.getLayout() === 'XYZM') {
        attributes.geom = geoJsonFormat.writeGeometry(geoClone as SimpleGeometry);
      }

      object.name = "";
      object.attributes = attributes;
      object.geometry = format.writeGeometry(geoClone as SimpleGeometry);
      switch ((geoClone as SimpleGeometry)?.getType()) {
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
  sketch2feature(sketch: string | any, proj: Projection): Feature[] {
    if (typeof sketch === 'string') {
      sketch = JSON.parse(sketch);
    }

    const features: Feature[] = [];
    const format = new WKT();
    const objects = sketch.objects;
    for (const object of objects) {
      const prop: any = object.attributes ? object.attributes : {};
      prop.geometry = format.readGeometry(object.geometry);
      prop.geometry.transform(DEFAULT_REPORT_VALUES.SKETCH2FEATURE.TRANSFORM_PROJECTION, proj || DEFAULT_REPORT_VALUES.SKETCH2FEATURE.TRANSFORM_PROJECTION_FALLBACK);
      features.push(new Feature(prop));
    }
    return features;
  }

}