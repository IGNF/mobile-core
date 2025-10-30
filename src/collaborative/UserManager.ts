/**
 * User authentication and community management
 * @migrated from: collaboratif/UserManager.js
 * 
 */

import { ApiClient } from 'collaboratif-client-api';

import { User, Community, CommunityMember, UserManagerConfig, CommunityLayer, TableColumn, UserManagerEvents } from './types';

import { IUserStorage } from '../abstracts/IUserStorage';

import EventManager from '../utils/EventManager';

/**
 * User authentication and community management
 * 
 * Events:
 * - 'user:connect': Emitted when a user successfully logs in
 * - 'user:disconnect': Emitted when a user logs out
 * - 'community:change': Emitted when the active community changes
 * - 'user:error': Emitted when an error occurs
 */
export class UserManager {

  public apiClient: ApiClient;
  public storage: IUserStorage;
  private _eventManager: EventManager;

  constructor(config: UserManagerConfig) {
    this.apiClient = config.apiClient;
    this.storage = config.storage;
    this._eventManager = new EventManager();
  }

  /**
   * Event subscription methods
   */
  on<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void {
    this._eventManager.on(event, handler);
  }

  off<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void {
    this._eventManager.off(event, handler);
  }

  once<K extends keyof UserManagerEvents>(event: K, handler: (data: UserManagerEvents[K]) => void): void {
    this._eventManager.once(event, handler);
  }

  private emit<K extends keyof UserManagerEvents>(event: K, data: UserManagerEvents[K]): void {
    this._eventManager.emit(event, data);
  }

  async login(username: string, password: string): Promise<User> {
    try {
      const userResponse = await this.apiClient.login(username, password); // see what exists instead
      if (!userResponse.data) {
        throw new Error('Login failed');
      }
      const user = userResponse.data;
      this.emit('user:connect', { user });
      return user;
    } catch (error: any) {
      this.emit('user:error', { error, code: 'LOGIN_FAILED' });
      throw error;
    }
  }

  async initialize(): Promise<void> {
    try {
      const cacheData = await this.storage.getCredentials();
      if (cacheData && cacheData.username && cacheData.password) {
        const user = await this.login(cacheData.username, cacheData.password);
        await this.storage.saveUser(user);
      }
    } catch (error: any) {
      this.emit('user:error', { error, code: 'INIT_FAILED' });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.disconnect(); // see what exists instead
      await this.storage.clearUser();
      await this.storage.clearCredentials();
      this.emit('user:disconnect', {});
    } catch (error: any) {
      this.emit('user:error', { error, code: 'LOGOUT_FAILED' });
      throw error;
    }
  }

  /**
   * Get a user
   * Call getCommunity for each community in the user's communities_member array
   * and return the user with the communities
   * @returns User
   */
  async getUser(): Promise<User> {
    const userResponse = await this.apiClient.getUser();
    let user: User = userResponse.data;
    user.communities_member = user.communities_member || [];

    /**
     * Question here:
     * Can't we return directly the profile key in the user object?
     */

    const responseCommunities = (await this.apiClient.getCommunities()).data;
    user.communities_member.map((member: CommunityMember) =>
      this.apiClient.getCommunity(member.community_id)!
    );

    user.communities = responseCommunities.map((response: Community, index: number) => ({
      ...response,
      profile: user.communities_member?.[index]?.profile // profile is a key
    }));

    return user;
  }

  async checkUserInfo(): Promise<void> {
    // Is it really needed? Can't we do it in the mobile side?
    /**
     * Original code:
    this.getUserInfo().then((user) => {
            self.sharedThemes = user.shared_themes;
            self.param.communities = user.communities;
            let active_web_community = null;
            for (var i in user.communities) {
                if (user.communities[i].active == true) {
                    active_web_community = user.communities[i];
                    break;
                }
            }

            let active = null;
            if (self.param.active_community) {
                active = self.param.active_community;
            } else if (active_web_community) {
                active = active_web_community.id;
            } else if (self.param.communities && self.param.communities.length) {
                active = self.param.communities[0].id;
            }
            self.setCommunity(active);
            success(user);
            self.saveParam();
            if (typeof(allways)==='function') allways({});
        }).catch((error) => {
            if (self.param.active_community) self.setCommunity(self.param.active_community);
            fail(error);
            if (typeof(allways)==='function') allways({}, error);
        });
     */
  }

  async getCommunities(): Promise<Community[]> {
    const user = await this.getUser();
    return user.communities;
  }

  /**
   * community = groupe = guichet
   * @returns The active community or null if not found
   */
  async getActiveCommunity(): Promise<Community | null> {
    const user = await this.getUser();
    return user.communities.find((community: Community) => community.active === true) || null;
  }

  /**
   * Get the layers info for a given community
   * @param communityId - The ID of the community to get the layers info for
   * @returns CommunityLayer[]
   */
  async getLayersInfo(communityId: number): Promise<CommunityLayer[]> {
    if (!this.apiClient.username) {
      throw new Error('Unauthorized');
    }

    const responseLayers = await this.apiClient.getLayers(communityId, { limit: 100 });
    const layers: CommunityLayer[] = responseLayers.data;

    // Fetch all geoservices and tables in parallel
    const layerDataPromises = layers.map((layer: CommunityLayer) => this._fetchLayerData(layer));

    // Fetch unique database extents for table-based layers
    const uniqueDatabaseIds = this._getUniqueDatabaseIds(layers);
    const databaseExtentsMap = await this._fetchDatabaseExtents(uniqueDatabaseIds);

    // Add fetched data to layers
    const enrichedData = await Promise.all(layerDataPromises);
    this._enrichLayers(layers, enrichedData, databaseExtentsMap);

    return layers;
  }

  /**
   * Fetch geoservice or table data for a single layer
   */
  private async _fetchLayerData(layer: CommunityLayer): Promise<any> {
    const layerAny = layer as any; // Temporary cast until API types are refined
    if (layerAny.geoservice) {
      return this.apiClient.getGeoservice(layerAny.geoservice.id);
    } else if (layerAny.table && layerAny.database) {
      return this.apiClient.getTable(layerAny.database, layerAny.table);
    }
    return null;
  }

  /**
   * Extract unique database IDs from layers
   */
  private _getUniqueDatabaseIds(layers: CommunityLayer[]): number[] {
    const databaseIds = new Set<number>();
    for (const layer of layers) {
      const layerAny = layer as any; // Temporary cast until API types are refined
      if (layerAny.table && layerAny.database) {
        databaseIds.add(layerAny.database);
      }
    }
    return Array.from(databaseIds);
  }

  /**
   * Fetch database extents for all database IDs
   */
  private async _fetchDatabaseExtents(databaseIds: number[]): Promise<Record<number, string>> {
    if (databaseIds.length === 0) {
      return {};
    }

    const databasePromises = databaseIds.map(dbId =>
      this.apiClient.getDatabase(dbId, { fields: "extent,id" })
    );
    const databaseResponses = await Promise.all(databasePromises);

    const extentsMap: Record<number, string> = {};
    for (const response of databaseResponses) {
      extentsMap[response.data.id] = response.data.extent;
    }
    return extentsMap;
  }

  /**
   * Enrich layers with fetched geoservice/table data and database extents
   * (UserManager.js lines 276-290)
   */
  private _enrichLayers(
    layers: CommunityLayer[],
    enrichedData: any[],
    databaseExtentsMap: Record<number, string>
  ): void {
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i] as any; // Temporary cast until API types are refined
      const data = enrichedData[i];

      if (!data) {
        continue;
      }

      if (layer.geoservice) {
        layer.geoservice = data.data;
      } else if (layer.table && layer.database) {
        const table = data.data;
        // Transform columns from indexed array to array format
        table.columns = Object.values(table.columns) as TableColumn[];
        layer.table = table;
        layer.extent = databaseExtentsMap[layer.database].split(',');
      }
    }
  }

  /**
   * Set the active community
   * If no layers are found, get them from the API
   * @param communityId - The ID of the community to set as active
   * @returns void
   */
  async setActiveCommunity(communityId: number): Promise<void> {
    try {
      const community: Community | null = await this.getGroupById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }
      await this.storage.setActiveCommunity(communityId); // save in cache storage

      const param = await this.storage.getParam();
      param.offline = community.offline_allowed;

      if (!community.layers) {
        community.layers = await this.getLayersInfo(communityId);
        await this.storage.saveParam(param); // save in cache storage
      }
      
      this.emit('community:change', { community });
    } catch (error: any) {
      this.emit('user:error', { error, code: 'SET_COMMUNITY_FAILED' });
      throw error;
    }
  }


  /**
  * Get the community with its ID
  * @param {number} id - The ID of the community to get
  * @returns {Community | null} - The community or null if not found
  */
  async getGroupById(id: number): Promise<Community | null> {
    const user = await this.getUser();
    return user.communities.find((community: Community) => community.id === id) || null;
  }

  /**
   * 
   * @returns The service URL of the collaboratif API
   */
  async getServiceUrl(): Promise<string> {
    return this.apiClient.getBaseUrl();
  }

  /**
   * Set the service URL of the collaboratif API
   * @param url - The new service URL to set
   * @returns {void} - The service URL of the collaboratif API
   */
  async setServiceUrl(url: string): Promise<void> {
    if (url === (await this.apiClient.getBaseUrl())) {
      return;
    }
    await this.logout();
    await this.apiClient.setBaseUrl(url);
  }
}