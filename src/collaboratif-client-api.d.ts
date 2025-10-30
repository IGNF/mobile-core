declare module 'collaboratif-client-api' {
  export class ApiClient {
    constructor(...args: any[]);

    // Should they really be here?
    username: string;
    password: string;

    /**
     * User related methods
     */
    getUser(): Promise<{ data: User }>;
    login(username: string, password: string): Promise<{ data: User }>;
    disconnect(): Promise<void>;


    /**
     * Document related methods
     */
    /**
     * Get a document by its ID
     * @param id - The ID of the document
     * @returns The document URL and name
     */
    getDocument(id: string): Promise<{ data: { url: string, name: string } }> {
      // this is probably not the correct implementation, but it's a start
      // finish the implementation during the mobile app development
      return fetch(`${this.baseUrl}/documents/${id}`).then(response => { return { data: { url: response.url, name: response.name } }; });
    }

    // see what format is expected for the file (Blob, FormData, etc.)
    uploadFile(url: string, file: Blob | FormData): Promise<{ data: any }>;

    deleteDocument(documentId: number): Promise<void>;


    /**
     * Geoservice related methods
     */
    getGeoservice(geoserviceId: number): Promise<{ data: Geoservice }>;

    /**
     * Layers related methods
     */
    getLayers(communityId: number, params: any): Promise<{ data: Layer[] }>;

    /**
     * Database related methods
     */
    getDatabase(databaseId: number, params: any): Promise<{ data: Database }>;

    /**
     * Table related methods
     */
    getTable(databaseId: number, tableName: string): Promise<{ data: Table }>;

    /**
     * Community related methods
     * to implement
     */
    getCommunity(communityId: number): Promise<{ data: Community }>;
    getCommunities(): Promise<{ data: Community[] }>;
    setActiveCommunity(communityId: number): Promise<void>;
    getActiveCommunity(): Promise<{ data: Community }>;

    /**
     * Service URL related methods
     */
    getBaseUrl(): Promise<string>;
    setBaseUrl(url: string): Promise<void>;

    /**
     * Report related methods
     */
    getReports(params: any): Promise<any>; // to type
    addReport(params: any): Promise<any>; // to type
    addAttachments(reportId: number, params: any): Promise<any>; // to type
    postPhotosPending(reportId: number, params: any): Promise<any>; // to type
    postPhotos(reportId: number, params: any): Promise<any>; // to type
  }
}

