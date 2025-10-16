declare module 'collaboratif-client-api' {
  export class ApiClient {
    constructor(...args: any[]);
    /**
     * User related methods
     */
    getUser(): Promise<{ data: User }>;
    login(username: string, password: string): Promise<{ data: User }>;
    disconnect(): Promise<void>;

    /**
     * Community related methods
     * to implement
     */
    // getCommunity(communityId: number): Promise<{ data: Community }>;
    // getCommunities(): Promise<{ data: Community[] }>;
    // setActiveCommunity(communityId: number): Promise<void>;
    // getActiveCommunity(): Promise<{ data: Community }>;


  }
}

