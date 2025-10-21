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
  sanitizeFileName(filename: string): string {
    var illegalRe = /[/?<>\\:*|":]/g;
    //eslint-disable-next-line
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    var windowsTrailingRe = /[. ]+$/;

    return (filename || '_')
      .replace(illegalRe, '_')
      .replace(controlRe, '_')
      .replace(reservedRe, '_')
      .replace(windowsReservedRe, '_')
      .replace(windowsTrailingRe, '_');
  }

  /**
   * Get the domain from a full URL
   * @param URL like https://example.com/path/file.html
   * @returns the escaped domain, like example_com
   */
  getEscapedDomainFromURL(URL: string): string {
    return URL.replace(/^((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?$/, "$3").replace(/\./g, '_');
  }

}