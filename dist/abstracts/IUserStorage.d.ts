import { User, Community } from "../collaborative/types";
/**
 * User storage interface
 * Abstract storage for user data
 * Implementation provided by consuming app
 * Necessary to remove the dependency to Cordova/Capacitor Storage from the core library
 */
export interface IUserStorage {
    saveUser(user: User): Promise<void>;
    getUser(): Promise<User | null>;
    clearUser(): Promise<void>;
    saveParam(param: any): Promise<void>;
    getParam(): Promise<any>;
    clearParam(): Promise<void>;
    saveCommunities(communities: Community[]): Promise<void>;
    getCommunities(): Promise<Community[]>;
    setActiveCommunity(communityId: number): Promise<void>;
    getActiveCommunity(): Promise<number | null>;
    saveCredentials(username: string, encryptedPassword: string): Promise<void>;
    getCredentials(): Promise<{
        username: string;
        password: string;
    } | null>;
    clearCredentials(): Promise<void>;
}
//# sourceMappingURL=IUserStorage.d.ts.map