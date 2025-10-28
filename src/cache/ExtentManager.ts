/**
 * This class aims to manage extents caching
 * Handles pre-saved areas for the cache manager
 * @migrated from: ol/cache/CacheExtents.js
 */

import { extend, Extent } from 'ol/extent';
import { createEmpty } from 'ol/extent';
import { ICacheStorage } from '../abstracts/ICacheStorage';

export default class ExtentManager {
  private readonly EXTENT_PREFIX = 'extent:';

  constructor(private storage: ICacheStorage) {
  }

  /**
   * Adds or replaces a named extent area
   * @param name - Name of the extent area (generated if not provided)
   * @param extents - Single extent or array of extents
   * @returns The name used to store the extents
   */
  async addExtent(name: string, extents: Extent | Extent[]): Promise<string> {
    const extentArray = Array.isArray(extents) ? extents : [extents];
    
    // Generate default name if not provided
    if (!name || name.trim() === '') {
      const existingNames = await this.getNames();
      name = `Sans titre ${existingNames.length}`;
    }

    const key = this.EXTENT_PREFIX + name;
    await this.storage.saveMetadata(key, {
      id: key,
      name: name,
      type: 'vector',
      created: new Date(),
      modified: new Date(),
      size: 0,
      extra: {
        extents: extentArray
      }
    });

    return name;
  }

  /**
   * Appends a single extent to an existing named area
   * @param name - Name of the extent area
   * @param extent - Extent to append
   */
  async appendExtent(name: string, extent: Extent): Promise<void> {
    const existing = await this.get(name);
    const extents = existing.length > 0 ? [...existing, extent] : [extent];
    await this.addExtent(name, extents);
  }

  /**
   * Retrieves the extent array for a given name
   * Returns empty array if not found
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async get(name: string): Promise<Extent[]> {
    const key = this.EXTENT_PREFIX + name;
    const metadata = await this.storage.getMetadata(key);
    
    if (!metadata || !metadata.extra?.extents) {
      return [];
    }
    
    return metadata.extra.extents as Extent[];
  }

  /**
   * Retrieves a single extent for a given name (alias for get)
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async getExtent(name: string): Promise<Extent[]> {
    return this.get(name);
  }

  /**
   * Returns all stored extent names
   * @returns Array of extent area names
   */
  async getNames(): Promise<string[]> {
    const allMetadata = await this.storage.listMetadata(this.EXTENT_PREFIX);
    return allMetadata
      .filter(meta => meta.id.startsWith(this.EXTENT_PREFIX))
      .map(meta => meta.id.substring(this.EXTENT_PREFIX.length));
  }

  /**
   * Returns key-value pairs of extent names
   * @returns Object mapping names to themselves
   */
  async getExtentNames(): Promise<{ [key: string]: string }> {
    const names = await this.getNames();
    const extentNames: { [key: string]: string } = {};
    for (const name of names) {
      extentNames[name] = name;
    }
    return extentNames;
  }

  /**
   * Removes a named extent area
   * @param name - Name of the extent area to remove
   */
  async deleteExtent(name: string): Promise<void> {
    const key = this.EXTENT_PREFIX + name;
    await this.storage.deleteMetadata(key);
  }

  /**
   * Retrieves a single extent that encompasses all extents for the given name(s)
   * @param names - Single name or array of names
   * @returns Combined extent
   */
  async getAllInOneExtent(names: string | string[]): Promise<Extent> {
    const extent = createEmpty();
    const extents = Array.isArray(names) 
      ? await this.getAllExtents(names) 
      : await this.get(names);
    
    for (const ext of extents) {
      extend(extent, ext);
    }
    
    return extent;
  }

  /**
   * Retrieves all extents for multiple names as a flat array
   * @param names - Array of extent area names
   * @returns Flattened array of all extents
   */
  async getAllExtents(names: string[]): Promise<Extent[]> {
    if (!Array.isArray(names)) {
      throw new Error("names parameter must be an array");
    }
    
    const extentsArrays = await Promise.all(
      names.map(name => this.get(name))
    );
    
    return extentsArrays.flat();
  }
}