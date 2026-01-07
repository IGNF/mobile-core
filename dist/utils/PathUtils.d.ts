/**
 * Class listing a few helpers to manipulate strings and paths
 *
 */
export default class PathUtils {
    /**
     * Inspired from the CordovApp.File.fileName function in CordovApp, File.js line 60
     * @param filename name of a file to sanitize
     * @returns sanitized filename
     */
    sanitizeFileName(filename: string): string;
    /**
     * Get the domain from a full URL
     * @param URL like https://example.com/path/file.html
     * @returns the escaped domain, like example_com
     */
    getEscapedDomainFromURL(URL: string): string;
}
//# sourceMappingURL=PathUtils.d.ts.map