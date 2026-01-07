/**
 * User authentication and community management
 * @migrated from: collaboratif/UserManager.js
 *
 */
import { ApiClient } from 'collaboratif-client-api';
import { User, Community, UserManagerConfig, CommunityLayer, UserManagerEvents } from './types';
import { IUserStorage } from '../abstracts/IUserStorage';
/**
 * User authentication and community management
 *
 * Events:
 * - 'user:connect': Emitted when a user successfully logs in
 * - 'user:disconnect': Emitted when a user logs out
 * - 'community:change': Emitted when the active community changes
 * - 'user:error': Emitted when an error occurs
 */
export declare class UserManager {
    apiClient: ApiClient;
    storage: IUserStorage;
    private _eventManager;
    constructor(config: UserManagerConfig);
    /**
     * Event subscription methods
     */
    on<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void;
    off<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void;
    once<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void;
    private emit;
    login(username: string, password: string): Promise<User>;
    initialize(): Promise<void>;
    logout(): Promise<void>;
    /**
     * Get a user
     * Call getCommunity for each community in the user's communities_member array
     * and return the user with the communities
     * @returns User
     */
    getUser(): Promise<User>;
    checkUserInfo(): Promise<void>;
    getCommunities(): Promise<Community[]>;
    /**
     * community = groupe = guichet
     * @returns The active community or null if not found
     */
    getActiveCommunity(): Promise<Community | null>;
    /**
     * Get the layers info for a given community
     * @param communityId - The ID of the community to get the layers info for
     * @returns CommunityLayer[]
     */
    getLayersInfo(communityId: number): Promise<CommunityLayer[]>;
    /**
     * Fetch geoservice or table data for a single layer
     */
    private _fetchLayerData;
    /**
     * Extract unique database IDs from layers
     */
    private _getUniqueDatabaseIds;
    /**
     * Fetch database extents for all database IDs
     */
    private _fetchDatabaseExtents;
    /**
     * Enrich layers with fetched geoservice/table data and database extents
     * (UserManager.js lines 276-290)
     */
    private _enrichLayers;
    /**
     * Set the active community
     * If no layers are found, get them from the API
     * @param communityId - The ID of the community to set as active
     * @returns void
     */
    setActiveCommunity(communityId: number): Promise<void>;
    /**
    * Get the community with its ID
    * @param {number} id - The ID of the community to get
    * @returns {Community | null} - The community or null if not found
    */
    getGroupById(id: number): Promise<Community | null>;
    /**
     *
     * @returns The service URL of the collaboratif API
     */
    getServiceUrl(): Promise<string>;
    /**
     * Set the service URL of the collaboratif API
     * @param url - The new service URL to set
     * @returns {void} - The service URL of the collaboratif API
     */
    setServiceUrl(url: string): Promise<void>;
}
//# sourceMappingURL=UserManager.d.ts.map