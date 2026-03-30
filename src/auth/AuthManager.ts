import { AUTH_ERROR_CODES } from "./ErrorCodes";
import { generateCodeVerifier, generateCodeChallengeFromVerifier } from "./helper";
import { ApiUserResponse, mapApiUserToUser } from "./mapper";
import { AuthManagerConfig, AuthResult, AuthTokens, Platform, RefreshResult, TokenExchangeResult } from "./type";
import { ApiClient } from "collaboratif-client-api";

// Capacitor dependencies
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { CapacitorHttp } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

export class AuthManager {
  public apiClient: ApiClient;
  public config: AuthManagerConfig;

  constructor(config: AuthManagerConfig) {
    this.config = config;
    this.apiClient = new ApiClient(config.apiBaseUrl, config.oAuthBaseUrl, config.oAuthClientId);
  }

  /**
   * Classic 'old' login with email and password
   * @param email 
   * @param password 
   * @returns 
   */
  public async loginWithPassword(email: string, password: string): Promise<AuthResult> {
    try {
      this.apiClient.setCredentials(email, password);
      const response = await this.apiClient.user.get('me');
      const user = mapApiUserToUser(response.data as ApiUserResponse);

      return { success: true, user };
    } catch (error: any) {
      try {
        this.apiClient.disconnect();
      } catch (disconnectError) {
        throw new Error(AUTH_ERROR_CODES.FAILED_TO_DISCONNECT);
      }

      if (error.response.status === 401) {
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
      }
    }
  }

  /**
   * Login with OAuth
   * @param redirectUri the redirect URI to use for the OAuth flow - is different depending on the platform
   * @returns the authentication result
   */
  public async loginWithOAuth(redirectUri: string, platform: Platform): Promise<AuthResult> {
    try {
      const clearTempCodeVerifier = async () => {
        try {
          await localStorage.removeItem('temp_code_verifier');
        } catch (error) {
          throw new Error(AUTH_ERROR_CODES.CODE_VERIFIER_MISSING);
        }
      };

      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);

      // Store code verifier for later use in token exchange
      await localStorage.setItem('temp_code_verifier', codeVerifier);

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
        let appUrlListener: PluginListenerHandle | null = null;
        let browserFinishedListener: PluginListenerHandle | null = null;
        let settled = false;
        let ignoreBrowserFinished = false;

        const settle = (result: AuthResult) => {
          if (settled) {
            return;
          }

          settled = true;
          void appUrlListener?.remove();
          void browserFinishedListener?.remove();
          resolve(result);
        };

        const handleCallback = async ({ url }: { url: string }) => {
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

            this.apiClient.setExternalToken(
              tokenResult.tokens.accessToken,
              tokenResult.tokens.refreshToken,
              tokenResult.tokens.expiresIn,
              tokenResult.tokens.refreshExpiresIn
            );

            if (tokenResult.tokens.refreshExpiresIn) {
              const refreshTokenExpiresAt = Date.now() + (tokenResult.tokens.refreshExpiresIn * 1000);
              await localStorage.setItem('refresh_token_expires_at', refreshTokenExpiresAt.toString());
            }

            const response = await this.apiClient.user.get('me');
            const user = mapApiUserToUser(response.data as ApiUserResponse);
            if (!user) {
              settle({ success: false, user: null, error: new Error(AUTH_ERROR_CODES.FAILED_TO_FETCH_USER_INFO) });
              return;
            }

            settle({ success: true, user });
          } catch (err) {
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
          } catch (error) {
            await clearTempCodeVerifier();
            settle({
              success: false,
              user: null,
              error: new Error(AUTH_ERROR_CODES.OAUTH_CALLBACK_FAILED),
            });
          }
        })();
      });
    } catch (error) {
      try {
        await localStorage.removeItem('temp_code_verifier');
      } catch { }
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
  public async refreshAccessToken(refreshToken: string): Promise<RefreshResult> {
    try {
      if (!refreshToken) {
        return { success: false, error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_MISSING) };
      }

      // Check if refresh token is expired
      const refreshExpiresAt = await localStorage.getItem('refresh_token_expires_at');
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

      const authTokens: AuthTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
      };

      return { success: true, tokens: authTokens };
    } catch (err) {
      return {
        success: false,
        error: new Error(AUTH_ERROR_CODES.REFRESH_TOKEN_FAILED),
      };
    }
  }


  /**
 * Exchange authorization code for tokens
 */
  public async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenExchangeResult> {
    try {
      const codeVerifier = await localStorage.getItem('temp_code_verifier');

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

      await localStorage.removeItem('temp_code_verifier');

      const authTokens: AuthTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
      };

      return { success: true, tokens: authTokens };
    } catch (err) {
      try {
        await localStorage.removeItem('temp_code_verifier');
      } catch (cleanupError) {
        throw new Error(AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED);
      }
      return {
        success: false,
        error: new Error(AUTH_ERROR_CODES.TOKEN_EXCHANGE_FAILED),
      };
    }
  }


}