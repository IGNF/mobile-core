/**
 * This class aims to manage extents caching
 */

import { extend, Extent } from 'ol/extent';
import { createEmpty } from 'ol/extent';


export default class ExtentManager {
  constructor() {
  }

  async saveExtent(name: string, extent: Extent): Promise<void> {
    throw new Error('Not implemented');
  }

  async getExtent(name: string): Promise<Extent> {
    throw new Error('Not implemented');
  }

  async deleteExtent(name: string): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
     * Array of key value pairs of extent names
     * @return {Array<String>} 
     */
  async getExtentNames(): Promise<{ [key: string]: string }> {
    throw new Error('Not implemented');
    // where do we get the names from?
  }

  /**
   * Recupere un seul extent incluant tous les autres
   * @param {String or Array<String>} names
   * @return {ol.extent}
   */
  async getAllInOneExtent(names: string | string[]): Promise<Extent> {
    let extent = createEmpty();
    let extents = Array.isArray(names) ? await this.getAllExtents(names) : await this.getExtent(names);
    for (const extent of (extents as Extent[])) {
      extend(extent, extent);
    }
    return extent;
  }

  /**
   * Recupere un tableau de tous les extents
   * @param {Array<String>} names
   * @return {Array<ol.extent>}
   */
  async getAllExtents(names: string[]): Promise<Extent[]> {
    if (!Array.isArray(names)) throw new Error("names parameter must be an array");
    const extents = await Promise.all(names.map(name => this.getExtent(name)));
    return extents;
  }
}