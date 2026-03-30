/**
 * Generate a random code verifier for PKCE
 */
export declare function generateCodeVerifier(): string;
/**
 * Base64URL encode a buffer
 */
export declare function base64urlEncode(buffer: Uint8Array): string;
/**
 * Generate SHA-256 hash of a string
 */
export declare function sha256(plain: string): Promise<ArrayBuffer>;
/**
 * Generate a code challenge from a code verifier
 */
export declare function generateCodeChallengeFromVerifier(codeVerifier: string): Promise<string>;
/**
 * Generate a code challenge
 * Follows the full process to generate a code challenge
 * 1. Generate a code verifier
 * 2. Generate a code challenge from the code verifier
 * 3. Return the code challenge
 */
export declare function generateCodeChallenge(): Promise<string>;
//# sourceMappingURL=helper.d.ts.map