import { AuthManagerConfig, AuthResult, LogoutResult, Platform, RefreshResult, RevokeTokenResult } from "./type";
import { ApiClient } from "collaboratif-client-api";
export declare class AuthManager {
    apiClient: ApiClient;
    config: AuthManagerConfig;
    constructor(config: AuthManagerConfig);
    /**
     * Classic 'old' login with email and password
     * @param email
     * @param password
     * @returns
     */
    loginWithPassword(email: string, password: string): Promise<AuthResult>;
    /**
     * Login with OAuth
     * @param redirectUri the redirect URI to use for the OAuth flow - is different depending on the platform
     * @returns the authentication result
     */
    loginWithOAuth(redirectUri: string, platform: Platform): Promise<AuthResult>;
    /**
   * Refresh the access token using the stored refresh token
   */
    refreshAccessToken(refreshToken: string): Promise<RefreshResult>;
    /**
   * Exchange authorization code for tokens
   */
    private exchangeCodeForTokens;
    /**
   * Logout and clear credentials.
   * Clears local session state first so logout still completes even if the
   * revoke request is slow, fails, or the app is backgrounded immediately after.
   * Token revocation remains best-effort.
   * @param accessToken - The access token to revoke
   * @param refreshToken - The refresh token to revoke
   * @returns the result of the logout operation
   */
    logout(accessToken: string, refreshToken: string): Promise<LogoutResult>;
    /**
     * Revoke a token
     * @param token - The token to revoke
     * @returns the result of the revoke token operation
     */
    revokeToken(token: string): Promise<RevokeTokenResult>;
    /**
     * Clear the in-memory authentication state
     */
    private clearInMemoryAuthState;
    /**
     * Check if the access token is expired or about to expire
     * @param bufferSeconds - Consider token expired this many seconds before actual expiry (default: 60)
     * @returns true if the access token is expired or about to expire, false otherwise
     */
    isAccessTokenExpired(bufferSeconds?: number): Promise<boolean>;
}
//# sourceMappingURL=AuthManager.d.ts.map