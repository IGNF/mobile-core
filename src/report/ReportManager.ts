/**
 * Report manager
 * Manages the creation, submission, and management of reports
 * 
 * @migrated from: report/Report.js
 * 
 * TODO:
 * - See if the functions sketch2feature and feature2sketch are required here, and what they do (see report/Report.js line 131)
 */
import { ApiClient } from 'collaboratif-client-api';

// Local types
import { Report, ReportFilter, ReportPostParams } from '../types/report';
import { IReportStorage } from '../abstracts/IReportStorage';
import Feature from 'ol/Feature';
import { Projection } from 'ol/proj';

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

  feature2sketch(features: Feature[], proj: Projection): string {
    throw new Error('Not implemented');

    // to implement:
    // if (!f) return "";
    //     if (!(f instanceof Array)) f = [f];
    //     const format = new ol_format_WKT();
    //     const geojsonFormat = new ol_format_GeoJSON();
    //     var pt = f[0].getGeometry().getFirstCoordinate();
    //     if (proj) {
    //         pt = ol_proj_transform(pt, proj, 'EPSG:4326')
    //     }

    //     let style = {
    //         "graphicName": "circle",
    //         "diam": 2,
    //         "frontcolor": "#FFAA00;1",
    //         "backcolor": "#FFAA00;0.5"
    //     };

    //     var croquis = {
    //         "contexte": {
    //             "lon": pt[0].toFixed(7),
    //             "lat": pt[1].toFixed(7),
    //             "zoom": 15,
    //             "layers": ["GEOGRAPHICALGRIDSYSTEMS.MAPS"]
    //         },
    //         "objects": []
    //     };

    //     for (var i=0; i<f.length; i++) {
    //         var t=""; 
    //         var object = {"style": style};
    //         var g = f[i].getGeometry().clone();
    //         var att = f[i].getProperties();
    //         delete att.geometry;
    //         if (proj) {
    //             g.transform(proj, 'EPSG:4326');
    //         }
    //         if (g.getLayout()==='XYZM') {
    //             att.geom = geojsonFormat.writeGeometry(g);
    //         }
    //         object.name = "";
    //         object.attributes = att;
    //         object.geometry = format.writeGeometry(g);
    //         // Geometry
    //         switch (f[i].getGeometry().getType()) {
    //             case 'Point': 
    //                 t = 'Point';
    //                 break;
    //             case 'LineString': 
    //                 t = 'Ligne'; 
    //                 break;
    //             case 'MultiPolygon': 
    //             case 'Polygon': 
    //                 t = 'Polygone';
    //                 break;
    //         }
    //         object.type = t;
    //         croquis.objects.push(object);
    //     }
    //     return JSON.stringify(croquis);
  }

  sketch2feature(sketch: string, proj: Projection): Feature[] {
    throw new Error('Not implemented');

    // to implement:
    // if (typeof (sketch) === "string") sketch = JSON.parse(sketch);
    // const features = [];
    // const format = new ol_format_WKT();
    // let objects = sketch.objects;
    // for (var i = 0, f; f = objects[i]; i++) {
    //   var prop = f.attributes ? f.attributes : {};
    //   prop.geometry = format.readGeometry(f.geometry);
    //   prop.geometry.transform("EPSG:4326", proj || "EPSG:3857")
    //   features.push(new ol_Feature(prop));
    // }
    // return features;
  }

}