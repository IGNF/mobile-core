/**
 * User authentication and community management
 * @migrated from: collaboratif/UserManager.js
 * Ajouter ici:
 * 
 * canReplyToReport(report) {
 * 
 * // add equivalent to:
 * let communities = wapp.userManager.param.communities;
        let communityIds = communities.map(c => c.id);
        for (var i in georem.attributes) {
            if (communityIds.indexOf(georem.attributes[i].community) == -1) return false;
        }
        return true;
 * }
 */

import { ApiClient } from 'collaboratif-client-api';

// import types
import { User, Community, CommunityMember, UserManagerConfig, IUserStorage } from './types';

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
    if(cacheData && cacheData.username && cacheData.password) {
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

  async getActiveCommunity(): Promise<Community | null> {
    const user = await this.getUser();
    return user.communities.find((community: Community) => community.isActive === true) || null;
  }

  async getLayersInfo(): Promise<void> {
    throw new Error('Not implemented');
  }

  async setActiveCommunity(communityId: number): Promise<void> {
    // const community = await this.getGroupById(communityId);
    // if (community) {
    //   community.isActive = true;

    // }
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