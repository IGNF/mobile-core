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


    getDocument(url: string): Promise<{ data: Blob }> {
      return fetch(url).then(response => response.blob());
    }


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


  }
}

