/**
 * Report manager
 * Manages the creation, submission, and management of reports
 * 
 * @migrated from: report/Report.js
 * 
 * TODO:
 * - See if the functions FEATURE2SKETCH and feature2sketch are required here, and what they do (see report/Report.js line 131)
 */
import { ApiClient } from 'collaboratif-client-api';

// Local types
import { Report, ReportPostParams } from './types';
import { ReportFilter } from '../sources/types';
import { IReportStorage } from '../abstracts/IReportStorage';
import Feature from 'ol/Feature';
import { Projection, transform } from 'ol/proj';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import { SimpleGeometry } from 'ol/geom';
import { getCenter } from 'ol/extent';
import { DEFAULT_REPORT_VALUES } from './DefaultReportValues';

/**
 * Report manager
 */

export class ReportManager {
  private _apiClient: ApiClient;
  private _storage: IReportStorage;

  public options: any;
  public params: any;

  private _defaultParams: any = { georems: [], nbrem: 0 };

  constructor(apiClient: ApiClient, storage: IReportStorage, options: any) {
    this.options = options;
    this.params = {};
    this._apiClient = apiClient;
    this._storage = storage;

    this.initialize(options);
  }

  async initialize(options: any): Promise<void> {
    this.params = this._storage.loadParams('report') || this._defaultParams;
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


    post.community = params.community_id > 0 ? params.community_id : "-1";
    if (params.themes) {
      let th = params.themes.split("::");
      var group = parseInt(th[0]);
      post.attributes = JSON.stringify({
        "community": group,
        "theme": params.theme,
        "attributes": params.attributes ? JSON.parse(params.attributes) : {}
      });
    }

    // if withSubmit?
    const response = await this._apiClient.addReport(post);
    const reportId = response.data.id;

    if (params.photos && params.photos.length) {
      params.photosToSend = true;
    }
    await this.uploadAttachements(reportId, params); // see type here

    return response.data;
  }

  /**
   * Submit a report to the server
   * @param reportId 
   */
  async submitReport(reportId: number): Promise<void> {
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

    this.params.georems[gremIndice].photosToSend = false;
    delete this.params.georems[gremIndice].error;
    let photos = report.photos;


    let photoPromises = [];
    for (let i in photos) {
      photoPromises.push(this._storage.getBlob(photos[i])); //  this will be implemented on the consuming app
    }
    Promise.all(photoPromises).then((blobs) => {
      let post: any = {};
      for (let i in blobs) {
        post["photo" + i] = blobs[i];
      }
      this._apiClient.addAttachments(reportId, post).then(() => {
        setTimeout(() => {
          this._storage.saveParam(this.params);
          // this.onUpdate(); // see what this does
        }, 300)
      }).catch(() => {
        this.params.georems[gremIndice].photosToSend = true;
        this.params.georems[gremIndice].error = "Echec d'envoi des images";
        this._storage.saveParam(this.params);
        // this.onUpdate(); // see what this does
      })
    }).catch((error) => {
      this.params.georems[gremIndice].photosToSend = true;
      this.params.georems[gremIndice].error = error;
      this._storage.saveParam(this.params);
      // this.onUpdate(); // see what this does
    });
  }

  /**
   * Update a report locally
   * Note: Once submitted, the report is no longer editable
   * @param report 
   */
  async updateReport(report: Partial<Report>): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * Delete a report
   * @param reportId 
   */
  async deleteReport(reportId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Get a report
   * @param reportId 
   */
  async getReport(reportId: number, fromServer: boolean = true): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * List reports
   * @param filter 
   */
  async listReports(filter?: ReportFilter, fromServer: boolean = true): Promise<Report[]> {
    throw new Error('Not implemented');
  }

  /** Write feature(s) to sketch
     * @param {ol.feature|Array<ol.feature>} the feature(s) to write
     * @param {ol.proj.ProjectionLike} projection of the features
     * @return {Object} the sketch in json format
     */
  feature2sketch(features: Feature[], proj: Projection): string {
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

    if (projectionTransform) {
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