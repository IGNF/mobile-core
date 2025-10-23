declare module 'collaboratif-client-api' {
  export class ApiClient {
    constructor(...args: any[]);
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
     * Community related methods
     * to implement
     */
    // getCommunity(communityId: number): Promise<{ data: Community }>;
    // getCommunities(): Promise<{ data: Community[] }>;
    // setActiveCommunity(communityId: number): Promise<void>;
    // getActiveCommunity(): Promise<{ data: Community }>;

    /**
     * Report related methods
     */
    getReports(params: any): Promise<any>; // to type


  }
}

