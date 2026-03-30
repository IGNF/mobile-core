import { AUTH_ERROR_CODES } from "./ErrorCodes";
import { generateCodeVerifier, generateCodeChallengeFromVerifier } from "./helper";
import { mapApiUserToUser } from "./mapper";
import { ApiClient } from "collaboratif-client-api";
// Capacitor dependencies
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { CapacitorHttp } from '@capacitor/core';
export class AuthManager {
    constructor(config) {
        this.config = config;
        this.apiClient = new ApiClient(config.apiBaseUrl, config.oAuthBaseUrl, config.oAuthClientId);
    }
    /**
     * Classic 'old' login with email and password
     * @param email
     * @param password
     * @returns
     */
    async loginWithPassword(email, password) {
        try {
            this.apiClient.setCredentials(email, password);
            const response = await this.apiClient.user.get('me');
            const user = mapApiUserToUser(response.data);
            return { success: true, user };
        }
        catch (error) {
            try {
                this.apiClient.disconnect();
            }
            catch (disconnectError) {
                throw new Error(AUTH_ERROR_CODES.FAILED_TO_DISCONNECT);
            }
            if (error.response && error.response.status === 401) {
                return {
                    success: false,
                    user: null,
                    error: new Error(AUTH_ERROR_CODES.UNAUTHORIZED),
                };
            }
            return {
                success: false,
                user: null,
                error: new Error(AUTH_ERROR_CODES.LOGIN_FAILED),
            };
        }
    }
    /**
     * Login with OAuth
     * @param redirectUri the redirect URI to use for the OAuth flow - is different depending on the platform
     * @returns the authentication result
     */
    async loginWithOAuth(redirectUri, platform) {
        try {
            const clearTempCodeVerifier = async () => {
                try {
                    localStorage.removeItem('temp_code_verifier');
                }
                catch (error) {
                    throw new Error(AUTH_ERROR_CODES.CODE_VERIFIER_MISSING);
                }
            };
            // Generate PKCE values
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
            // Store code verifier for later use in token exchange
            localStorage.setItem('temp_code_verifier', codeVerifier);
            const authUrl = `${this.config.oAuthBaseUrl}/auth?` + new URLSearchParams({
                client_id: this.config.oAuthClientId,
                redirect_uri: redirectUri,
                response_type: 'code',
                scope: 'openid profile email',
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            }).toString();
            if (platform === 'web') {
                // On web, redirect to OAuth provider directly
                // The callback will be handled by the /auth/callback route
                window.location.href = authUrl;
                // Return a pending result - the actual auth will complete after redirect
                return {
                    success: false,
                    user: null,
                    error: new Error(AUTH_ERROR_CODES.OAUTH_REDIRECT),
                };
            }
            // Mobile flow: use native app URL listeners
            return new Promise((resolve) => {
                let appUrlListener = null;
                let browserFinishedListener = null;
                let settled = false;
                let ignoreBrowserFinished = false;
                const settle = (result) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    void appUrlListener?.remove();
                    void browserFinishedListener?.remove();
                    resolve(result);
                };
                const handleCallback = async ({ url }) => {
                    // Only handle our redirect URI
                    if (!url.startsWith(redirectUri.split('?')[0])) {
                        return;
                    }
                    ignoreBrowserFinished = true;
                    void appUrlListener?.remove();
                    // void Browser.close(); // implement on the consumer app side
                    try {
                        const urlObject = new URL(url);
                        const code = urlObject.searchParams.get('code');
                        const error = urlObject.searchParams.get('error');
                        if (error) {
                            await clearTempCodeVerifier();
                            settle({
                                success: false,
                                user: null,
                                error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
                            });
                            return;
                        }
                        if (!code) {
                            await clearTempCodeVerifier();
                            settle({
                                success: false,
                                user: null,
                                error: new Error(AUTH_ERROR_CODES.NO_AUTHORIZATION_CODE),
                            });
                            return;
                        }
                        // Exchange code for tokens
                        const tokenResult = await this.exchangeCodeForTokens(code, redirectUri);
                        if (!tokenResult.success || !tokenResult.tokens) {
                            settle({ success: false, user: null, error: tokenResult.error });
                            return;
                        }
                        this.apiClient.setExternalToken(tokenResult.tokens.accessToken, tokenResult.tokens.refreshToken, tokenResult.tokens.expiresIn, tokenResult.tokens.refreshExpiresIn);
                        if (tokenResult.tokens.refreshExpiresIn) {
                            const refreshTokenExpiresAt = Date.now() + (tokenResult.tokens.refreshExpiresIn * 1000);
                            localStorage.setItem('refresh_token_expires_at', refreshTokenExpiresAt.toString());
                        }
                        const response = await this.apiClient.user.get('me');
                        const user = mapApiUserToUser(response.data);
                        if (!user) {
                            settle({ success: false, user: null, error: new Error(AUTH_ERROR_CODES.FAILED_TO_FETCH_USER_INFO) });
                            return;
                        }
                        settle({ success: true, user });
                    }
                    catch (err) {
                        await clearTempCodeVerifier();
                        settle({
                            success: false,
                            user: null,
                            error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
                        });
                    }
                };
                void (async () => {
                    try {
                        appUrlListener = await App.addListener('appUrlOpen', handleCallback);
                        browserFinishedListener = await Browser.addListener('browserFinished', async () => {
                            if (ignoreBrowserFinished) {
                                return;
                            }
                            await clearTempCodeVerifier();
                            settle({
                                success: false,
                                user: null,
                                error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
                            });
                        });
                        await Browser.open({ url: authUrl });
                    }
                    catch (error) {
                        await clearTempCodeVerifier();
                        settle({
                            success: false,
                            user: null,
                            error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
                        });
                    }
                })();
            });
        }
        catch (error) {
            try {
                localStorage.removeItem('temp_code_verifier');
            }
            catch { }
            return {
                success: false,
                user: null,
                error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
            };
        }
    }
    /**
   * Refresh the access token using the stored refresh token
   */
    async refreshAccessToken(refreshToken) {
        try {
            if (!refreshToken) {
                return { success: false, error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_MISSING) };
            }
            // Check if refresh token is expired
            const refreshExpiresAt = localStorage.getItem('refresh_token_expires_at');
            if (refreshExpiresAt && Date.now() >= parseInt(refreshExpiresAt, 10)) {
                return { success: false, error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED) };
            }
            const tokenUrl = `${this.config.oAuthBaseUrl}/token`;
            const response = await CapacitorHttp.post({
                url: tokenUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: this.config.oAuthClientId,
                    refresh_token: refreshToken,
                }).toString(),
            });
            if (response.status >= 400) {
                return { success: false, error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_FAILED) };
            }
            const tokenResponse = response.data;
            const accessTokenExpiresAt = new Date(Date.now() + (tokenResponse.expires_in * 1000));
            localStorage.setItem('access_token_expires_at', accessTokenExpiresAt.toISOString());
            const authTokens = {
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token,
                expiresIn: tokenResponse.expires_in,
                refreshExpiresIn: tokenResponse.refresh_expires_in,
            };
            return { success: true, tokens: authTokens };
        }
        catch (err) {
            return {
                success: false,
                error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_FAILED),
            };
        }
    }
    /**
   * Exchange authorization code for tokens
   */
    async exchangeCodeForTokens(code, redirectUri) {
        try {
            const codeVerifier = localStorage.getItem('temp_code_verifier');
            if (!codeVerifier) {
                return {
                    success: false,
                    error: new Error(AUTH_ERROR_CODES.CODE_VERIFIER_MISSING),
                };
            }
            const tokenUrl = `${this.config.oAuthBaseUrl}/token`;
            // Use CapacitorHttp to bypass CORS restrictions
            const response = await CapacitorHttp.post({
                url: tokenUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: this.config.oAuthClientId,
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                }).toString(),
            });
            if (response.status >= 400) {
                return {
                    success: false,
                    error: new Error(AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED),
                };
            }
            localStorage.removeItem('temp_code_verifier');
            const authTokens = {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                expiresIn: response.data.expires_in,
                refreshExpiresIn: response.data.refresh_expires_in,
            };
            return { success: true, tokens: authTokens };
        }
        catch (err) {
            try {
                localStorage.removeItem('temp_code_verifier');
            }
            catch (cleanupError) {
                throw new Error(AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED);
            }
            return {
                success: false,
                error: new Error(AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED),
            };
        }
    }
    /**
   * Logout and clear credentials.
   * Clears local session state first so logout still completes even if the
   * revoke request is slow, fails, or the app is backgrounded immediately after.
   * Token revocation remains best-effort.
   * @param accessToken - The access token to revoke
   * @param refreshToken - The refresh token to revoke
   * @returns the result of the logout operation
   */
    async logout(accessToken, refreshToken) {
        try {
            this.clearInMemoryAuthState();
            void this.revokeToken(accessToken);
            void this.revokeToken(refreshToken);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: new Error(AUTH_ERROR_CODES.UNKNOWN_ERROR) };
        }
    }
    /**
     * Revoke a token
     * @param token - The token to revoke
     * @returns the result of the revoke token operation
     */
    async revokeToken(token) {
        if (!token || token.length === 0) {
            return { success: false, error: new Error(AUTH_ERROR_CODES.TOKEN_MISSING) };
        }
        try {
            await CapacitorHttp.post({
                url: `${this.config.oAuthBaseUrl}/revoke`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams({
                    client_id: this.config.oAuthClientId,
                    token,
                }).toString(),
            });
            return { success: true };
        }
        catch (error) {
            console.error('revokeToken => error', error);
            return { success: false, error: new Error(AUTH_ERROR_CODES.UNKNOWN_ERROR) };
        }
    }
    /**
     * Clear the in-memory authentication state
     */
    clearInMemoryAuthState() {
        this.apiClient.username = null;
        this.apiClient.password = null;
        if (!this.apiClient.clientAuth) {
            return;
        }
        this.apiClient.clientAuth.started = false;
        this.apiClient.clientAuth.usesExternalToken = false;
        this.apiClient.clientAuth.token = null;
        this.apiClient.clientAuth.refreshToken = null;
        this.apiClient.clientAuth.expirationDate = null;
        this.apiClient.clientAuth.refreshExpirationDate = null;
    }
    /**
     * Check if the access token is expired or about to expire
     * @param bufferSeconds - Consider token expired this many seconds before actual expiry (default: 60)
     * @returns true if the access token is expired or about to expire, false otherwise
     */
    async isAccessTokenExpired(bufferSeconds = 60) {
        try {
            const expiresAt = localStorage.getItem('access_token_expires_at');
            if (!expiresAt) {
                return true; // No expiry stored, consider expired
            }
            const expiryTime = parseInt(expiresAt, 10);
            const bufferMs = bufferSeconds * 1000;
            return Date.now() >= (expiryTime - bufferMs);
        }
        catch (error) {
            console.error('isAccessTokenExpired => error', error);
            return true;
        }
    }
}
//# sourceMappingURL=AuthManager.js.map