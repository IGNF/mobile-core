import {ApiClient} from 'collaboratif-client-api';
import { wappStorage } from '../cordovapp/CordovApp';

const connectEvent = 'api_connect';
const disconnectEvent = 'api_disconnect';
const groupEvent = 'changegroup';

/**
 * classe de gestion de l utilisateur
 * triggers events "api_connect" and "api_disconnect" on document
 */
class UserManager {
    /**
     * @constructor
     * @param {ApiClient} apiClient
     */
    constructor (apiClient) {
        this.apiClient = apiClient;
        this.defaultUrl = this.getServiceUrl();
        this.param = wappStorage('user') || {};
    }

    /**
     * Initialization de l utilisateur s il existe
     * @return {voids}
     */
    initialize() {
        if (this.param.username && this.param.password) {
            this.setUser(this.param.username, this.param.password, true);
        }
    }

    /**
     * 
     * @param {String} url l url de base de l api collaborative
     * @returns {Boolean} true si l url a ete changée
     */
    setServiceUrl(url) {
        if (!url) url = this.defaultUrl;
        if (url === this.apiClient.getBaseUrl()) return false;
        return this.apiClient.setBaseUrl(url);
    }

    /**
     * 
     * @returns {String} l url de base de l api collaborative
     */
    getServiceUrl() {
        return this.apiClient.getBaseUrl();
    }

    /**
     * Changement des parametres d authentification a l api
     * @param {String} authUrl
     * @param {String} clientId
     * @param {String} clientSecret
     * @returns {Boolean} true si les parametres ont ete changes false sinon
     */
    switchAuthParams(authUrl, clientId, clientSecret) {
        if (
            this.apiClient.clientAuth && 
            clientId+clientSecret+authUrl == this.apiClient.clientAuth.clientId+this.apiClient.clientAuth.clientSecret+this.apiClient.clientAuth.getBaseUrl()
        ) {
            return false;
        }
        return this.apiClient.setAuthParams(authUrl, clientId, clientSecret);
    }

    /**
     * Get the user name
     * @returns {String} user name
     */
    getUser() {
        return this.apiClient.username;
    }

    /**
     * Get encrypted password
     * @returns {String} encrypted password
     */
    getPassword() {
        return this.apiClient.password;
    }

    /** 
     * Changement d'utilisateur
     * @param {String} user user name
     * @param {String} password user pwd
     * @param {Boolean} encrypted true si le mot de passe est deja encrypte
     * 
     */
    setUser(user, password, encrypted = false) {
        if (!user || !password) throw "Can't set user without user and password";
        if (this.apiClient.username && this.apiClient.username != user) {
            this.disconnect();
        }
        this.apiClient.setCredentials(user, password, encrypted);
        this.saveParam();
        $(document).trigger(connectEvent);
    }

    /**
     * Deconnexion
     */
    disconnect() {
        this.apiClient.disconnect();
        this.param = {};
        $(document).trigger(disconnectEvent);
    }

    /**
     * Recupere les informations de l utilisateur connecte avec les groupes associes
     * on triche: au lieu de garder l objet community_member avec une cle community
     * on recupere la cle profile (seule info de community_member dont on se sert) sur la community
     * et on garde seulement le tableau des communities
     * @returns l utilisateur avec ses groupes lies
     */
    async getUserInfo() {
        if (!this.apiClient.username) {
            throw new Error('Unauthorized');
        }
        
        let userResponse = await this.apiClient.getUser();
        var user = userResponse.data;
        let groupPromises = [];
        for (var i in user.communities_member) {
            groupPromises[i] = this.apiClient.getCommunity(user.communities_member[i].community_id);
        }
        let responseCommunities = await Promise.all(groupPromises);
        let communities = [];
        for (var i in responseCommunities) {
            let community = responseCommunities[i].data;
            community.profile = user.communities_member[i].profile; // @TODO voir ou est ce qu on reporte les attributs
            communities.push(community);
        }
        delete user.communities_member;
        user.communities = communities;
        return user;
    }

    /**
     * getUserInfo et set default group
     * @param {function} success on success callback
     * @param {function} fail on fail callback
     * @param {function} allways callback
     */
    checkUserInfo (success, fail, allways) {
        var self = this;

        if (typeof(success) != "function") {
            success = function() {
                notification(_T("Connecté au service..."),"2s")
            }
        }
        if (typeof(fail) != "function") {
            fail = function(error) {
                switch (error.status) {
                case 401: {
                    alertDlg ("Utilisateur inconnu.","Accès interdit");
                    break;
                }
                default: {
                    alertDlg (error.statusText);
                    break;
                }
                }
            }
        }

        this.getUserInfo().then((user) => {
            self.param.communities = user.communities;
            let active_web_community = null;
            for (var i in user.communities) {
                if (user.communities[i].active == true) {
                    active_web_community = user.communities[i];
                    break;
                }
            }

            if (self.param.active_community) {
                self.setCommunity(self.param.active_community);
            } else if (active_web_community) {
                self.setCommunity(active_web_community.id);
            } else if (self.param.communities && self.param.communities.length) {
                self.setCommunity(self.param.communities[0].id);
            }
            success(user);
            self.saveParam();
            if (typeof(allways)==='function') allways({});
        }).catch((error) => {
            if (self.param.active_community) self.setCommunity(self.param.active_community);
            fail(error);
            if (typeof(allways)==='function') allways({}, error);
        });
    }

    /**
     * Changer de groupe actif
     * @param {Integer} communityId l'identifiant du groupe
     */
    setCommunity(communityId) {
        var self = this;
        this.param.active_community = communityId;
        this.saveParam();
        if (!communityId) return;
        
        var community = this.getGroupById(communityId);
        if (community.layers) {
            $(document).trigger({ type: groupEvent, community: community });
            return community;
        }
        this.getLayersInfo(communityId).then((layers) => {
            community.layers = layers;
            $(document).trigger({ type: groupEvent, community: community });
        }).catch((error) => {
            self.param.active_community = null;
            self.saveParam();
        });
    }

    /**
     * Recupere les layers du groupe et geoservice/featureType lies
     * @param {Integer} communityId identifiant du groupe
     * @returns les layers associees au groupe
     */
    async getLayersInfo(communityId) {
        if (!this.apiClient.username) {
            throw new Error('Unauthorized', {"code": 401});
        }
    
        let responseLayers = await this.apiClient.getLayers(communityId);
        let layers = responseLayers.data;

        let promises = [];
        for (let i in layers) {
            if (layers[i]["geoservice"]) {
                promises[i] = this.apiClient.getGeoservice(layers[i]["geoservice"]["id"]);
            } else if (layers[i]["table"] && layers[i]["database"]) {
                promises[i] = this.apiClient.getTable(layers[i]["database"], layers[i]["table"]);
            } else {
                promises[i] = null;
            }
        }
        
        let tableOrGeoserviceListResp = await Promise.all(promises);
        for (let i in layers) {
            if (layers[i]["geoservice"]) {
                layers[i]["geoservice"] = tableOrGeoserviceListResp[i].data;
            } else if (layers[i]["table"] && layers[i]["database"]) {
                layers[i]["table"] = tableOrGeoserviceListResp[i].data;
            }
        }
    
        return layers;
    }

    /**
     * Sauvegarde dans les parametres 
     * restent en cache a la fermeture de l'appli
     * @returns {void}
     */
    saveParam() {
        this.param.username = this.getUser();
        this.param.password = this.getPassword();
        //@TODO sauvegarde du guichet et des groupes
        wappStorage('user', this.param);
    }

    /** 
     * Load connection parameters from wappStorage
     * @returns {void}
     */
    loadParam() {
        this.param = wappStorage('user') || {};
        // Recuperation de l'utilisateur
        if (this.param.username && this.param.pwd) this.setUser (this.param.username, this.param.pwd, true);

    };

    /**
     * Recupere le groupe avec son identifiant
     * @param {number} id 
     * @return {object | null}
     */
    getGroupById(id) {
        var community = null;
        if (this.param.communities) {
            for (var i=0; community=this.param.communities[i]; i++) {
                if (community.id === id) break;
            }
        }
        return community;
    };

    /**
     * Recupere le guichet courant (le groupe donc)
     * @returns {object | null} le groupe correspondant au guichet actif
     */
    getGuichet() {
        return getGroupById(wapp.user.param.active_community);
    }
}

export default UserManager;