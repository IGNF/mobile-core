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
import { Report, ReportPostParams, ReportManagerOptions, ReportManagerParams, ReportManagerEvents } from './types';
import { ReportFilter } from '../sources/types';
import { IReportStorage } from '../abstracts/IReportStorage';
import Feature from 'ol/Feature';
import { Projection } from 'ol/proj';
/**
 * Report manager
 */
export declare class ReportManager {
    private _apiClient;
    private _storage;
    private _eventManager;
    options: ReportManagerOptions;
    params: ReportManagerParams;
    private _defaultParams;
    constructor(apiClient: ApiClient, storage: IReportStorage, options?: ReportManagerOptions);
    /**
     * Event subscription methods
     */
    on<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void;
    off<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void;
    once<K extends keyof ReportManagerEvents>(event: K, handler: (data: ReportManagerEvents[K]) => void): void;
    private emit;
    /**
     * Create a new report *locally*
     * equivalent to postGeorem of ReportForm.js
     * @param report
     *
     * TODO: see the difference between the local and server report creation
     */
    createReport(params: ReportPostParams, withSubmit?: boolean): Promise<Report>;
    /**
     * Submit a report to the server
     * @param _reportId
     */
    submitReport(_reportId: number): Promise<void>;
    /**
     * See if the type is correct
     * equivalent to postPhotosPending of ReportForm.js
     * @param file: File to upload
     */
    uploadAttachements(reportId: number, report: ReportPostParams): Promise<void>;
    /**
     * Update a report locally
     * Note: Once submitted, the report is no longer editable
     * @param _report
     */
    updateReport(_report: Partial<Report>): Promise<Report>;
    /**
     * Delete a report
     * @param _reportId
     */
    deleteReport(_reportId: number): Promise<void>;
    /**
     * Get a report
     * @param _reportId
     * @param _fromServer
     */
    getReport(_reportId: number, _fromServer?: boolean): Promise<Report>;
    /**
     * List reports
     * @param _filter
     * @param _fromServer
     */
    listReports(_filter?: ReportFilter, _fromServer?: boolean): Promise<Report[]>;
    /** Write feature(s) to sketch
       * @param {ol.feature|Array<ol.feature>} the feature(s) to write
       * @param {ol.proj.ProjectionLike} projection of the features (optional, defaults to WGS84)
       * @return {Object} the sketch in json format
       */
    feature2sketch(features: Feature[], proj?: Projection): string;
    /** Get feature(s) from sketch
      * @param sketch the sketch in json
      * @param proj projection of the features, default `EPSG:3857`
      * @return the feature(s)
      */
    sketch2feature(sketch: string | any, proj?: Projection): Feature[];
}
//# sourceMappingURL=ReportManager.d.ts.map