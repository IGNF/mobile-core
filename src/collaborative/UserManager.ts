/**
 * User authentication and community management
 * @migrated from: collaboratif/UserManager.js
 * 
 */

import { ApiClient } from 'collaboratif-client-api';

import { User, Community, CommunityMember, UserManagerConfig, IUserStorage, CommunityLayer, TableColumn } from './types';

import EventManager from '../utils/EventManager';

export class UserManager {

  public apiClient: ApiClient;
  public storage: IUserStorage;
  private _eventManager: EventManager;

  constructor(config: UserManagerConfig) {
    this.apiClient = config.apiClient;
    this.storage = config.storage;
    this._eventManager = new EventManager();
  }

  async login(username: string, password: string): Promise<User> {
    const userResponse = await this.apiClient.login(username, password); // see what exists instead
    if (!userResponse.data) {
      throw new Error('Login failed');
    }
    return userResponse.data;
  }

  async initialize(): Promise<void> {
    const cacheData = await this.storage.getCredentials();
    if (cacheData && cacheData.username && cacheData.password) {
      const userResponse = await this.login(cacheData.username, cacheData.password);
      await this.storage.saveUser(userResponse);
    }
  }

  async logout(): Promise<void> {
    await this.apiClient.disconnect(); // see what exists instead
    this._eventManager.emit('disconnect');
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
  private async _fetchLayerData(layer: any): Promise<any> {
    if (layer.geoservice) {
      return this.apiClient.getGeoservice(layer.geoservice.id);
    } else if (layer.table && layer.database) {
      return this.apiClient.getTable(layer.database, layer.table);
    }
    return null;
  }

  /**
   * Extract unique database IDs from layers
   */
  private _getUniqueDatabaseIds(layers: any[]): number[] {
    const databaseIds = new Set<number>();
    for (const layer of layers) {
      if (layer.table && layer.database) {
        databaseIds.add(layer.database);
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
    layers: any[],
    enrichedData: any[],
    databaseExtentsMap: Record<number, string>
  ): void {
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
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
    const community: Community | null = await this.getGroupById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    this.storage.setActiveCommunity(communityId); // save in cache storage

    const param = await this.storage.getParam();
    param.offline = community.offline_allowed;

    if (!community.layers) {
      community.layers = await this.getLayersInfo(communityId);

      this.storage.saveParam(param); // save in cache storage
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