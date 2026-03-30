/**
 * User authentication and community management
 * @migrated from: collaboratif/UserManager.js
 *
 */
import { normalizeTable } from './normalize';
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
    constructor(config) {
        this.apiClient = config.apiClient;
        this.storage = config.storage;
        this._eventManager = new EventManager();
    }
    /**
     * Event subscription methods
     */
    on(event, handler) {
        this._eventManager.on(event, handler);
    }
    off(event, handler) {
        this._eventManager.off(event, handler);
    }
    once(event, handler) {
        this._eventManager.once(event, handler);
    }
    emit(event, data) {
        this._eventManager.emit(event, data);
    }
    /**
     * Get a user
     * Call getCommunity for each community in the user's communities_member array
     * and return the user with the communities
     * @returns User
     */
    async getUser() {
        const userResponse = await this.apiClient.getUser();
        let user = userResponse.data;
        user.communities_member = user.communities_member || [];
        /**
         * Question here:
         * Can't we return directly the profile key in the user object?
         */
        const responseCommunities = (await this.apiClient.getCommunities()).data;
        user.communities_member.map((member) => this.apiClient.getCommunity(member.community_id));
        user.communities = responseCommunities.map((response, index) => ({
            ...response,
            profile: user.communities_member?.[index]?.profile // profile is a key
        }));
        return user;
    }
    async checkUserInfo() {
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
    async getCommunities() {
        const user = await this.getUser();
        return user.communities;
    }
    /**
     * community = groupe = guichet
     * @returns The active community or null if not found
     */
    async getActiveCommunity() {
        const user = await this.getUser();
        return user.communities.find((community) => community.active === true) || null;
    }
    /**
     * Get the layers info for a given community
     * @param communityId - The ID of the community to get the layers info for
     * @returns CommunityLayer[]
     */
    async getLayersInfo(communityId) {
        if (!this.apiClient.username) {
            throw new Error('Unauthorized');
        }
        const responseLayers = await this.apiClient.getLayers(communityId, { limit: 100 });
        const layers = responseLayers.data;
        // Parallel fetch pattern: batch all geoservice/table requests together for performance
        const layerDataPromises = layers.map((layer) => this._fetchLayerData(layer));
        // Also fetch database extents in parallel for table-based layers
        const uniqueDatabaseIds = this._getUniqueDatabaseIds(layers);
        const databaseExtentsMap = await this._fetchDatabaseExtents(uniqueDatabaseIds);
        // Merge fetched geoservice/table data back into layers
        const enrichedData = await Promise.all(layerDataPromises);
        this._enrichLayers(layers, enrichedData, databaseExtentsMap);
        return layers;
    }
    /**
     * Fetch geoservice or table data for a single layer
     */
    async _fetchLayerData(layer) {
        const layerAny = layer; // Temporary cast until API types are refined
        if (layerAny.geoservice) {
            return this.apiClient.getGeoservice(layerAny.geoservice.id);
        }
        else if (layerAny.table && layerAny.database) {
            return this.apiClient.getTable(layerAny.database, layerAny.table);
        }
        return null;
    }
    /**
     * Extract unique database IDs from layers
     */
    _getUniqueDatabaseIds(layers) {
        const databaseIds = new Set();
        for (const layer of layers) {
            const layerAny = layer; // Temporary cast until API types are refined
            if (layerAny.table && layerAny.database) {
                databaseIds.add(layerAny.database);
            }
        }
        return Array.from(databaseIds);
    }
    /**
     * Fetch database extents for all database IDs
     */
    async _fetchDatabaseExtents(databaseIds) {
        if (databaseIds.length === 0) {
            return {};
        }
        const databasePromises = databaseIds.map(dbId => this.apiClient.getDatabase(dbId, { fields: "extent,id" }));
        const databaseResponses = await Promise.all(databasePromises);
        const extentsMap = {};
        for (const response of databaseResponses) {
            extentsMap[response.data.id] = response.data.extent;
        }
        return extentsMap;
    }
    /**
     * Enrich layers with fetched geoservice/table data and database extents
     * (UserManager.js lines 276-290)
     */
    _enrichLayers(layers, enrichedData, databaseExtentsMap) {
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]; // Temporary cast until API types are refined
            const data = enrichedData[i];
            if (!data) {
                continue;
            }
            if (layer.geoservice) {
                layer.geoservice = data.data;
            }
            else if (layer.table && layer.database) {
                const table = normalizeTable(data.data);
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
    async setActiveCommunity(communityId) {
        try {
            const community = await this.getGroupById(communityId);
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
        }
        catch (error) {
            this.emit('user:error', { error, code: 'SET_COMMUNITY_FAILED' });
            throw error;
        }
    }
    /**
    * Get the community with its ID
    * @param {number} id - The ID of the community to get
    * @returns {Community | null} - The community or null if not found
    */
    async getGroupById(id) {
        const user = await this.getUser();
        return user.communities.find((community) => community.id === id) || null;
    }
    /**
     *
     * @returns The service URL of the collaboratif API
     */
    async getServiceUrl() {
        return this.apiClient.getBaseUrl();
    }
    /**
     * Set the service URL of the collaboratif API
     * @param url - The new service URL to set
     * @returns {void} - The service URL of the collaboratif API
     */
    async setServiceUrl(url) {
        if (url === (await this.apiClient.getBaseUrl())) {
            return;
        }
        await this.apiClient.setBaseUrl(url);
    }
}
//# sourceMappingURL=UserManager.js.map