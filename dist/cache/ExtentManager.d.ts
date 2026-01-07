/**
 * This class aims to manage extents caching
 * Handles pre-saved areas for the cache manager
 * @migrated from: ol/cache/CacheExtents.js
 */
import { Extent } from 'ol/extent';
import { ICacheStorage } from '../abstracts/ICacheStorage';
export default class ExtentManager {
    private storage;
    private readonly EXTENT_PREFIX;
    constructor(storage: ICacheStorage);
    /**
     * Adds or replaces a named extent area
     * @param name - Name of the extent area (generated if not provided)
     * @param extents - Single extent or array of extents
     * @returns The name used to store the extents
     */
    addExtent(name: string, extents: Extent | Extent[]): Promise<string>;
    /**
     * Appends a single extent to an existing named area
     * @param name - Name of the extent area
     * @param extent - Extent to append
     */
    appendExtent(name: string, extent: Extent): Promise<void>;
    /**
     * Retrieves the extent array for a given name
     * Returns empty array if not found
     * @param name - Name of the extent area
     * @returns Array of extents
     */
    get(name: string): Promise<Extent[]>;
    /**
     * Retrieves a single extent for a given name (alias for get)
     * @param name - Name of the extent area
     * @returns Array of extents
     */
    getExtent(name: string): Promise<Extent[]>;
    /**
     * Returns all stored extent names
     * @returns Array of extent area names
     */
    getNames(): Promise<string[]>;
    /**
     * Returns key-value pairs of extent names
     * @returns Object mapping names to themselves
     */
    getExtentNames(): Promise<{
        [key: string]: string;
    }>;
    /**
     * Removes a named extent area
     * @param name - Name of the extent area to remove
     */
    deleteExtent(name: string): Promise<void>;
    /**
     * Retrieves a single extent that encompasses all extents for the given name(s)
     * Unions multiple extent boxes into one bounding box that contains all of them
     * @param names - Single name or array of names
     * @returns Combined extent
     */
    getAllInOneExtent(names: string | string[]): Promise<Extent>;
    /**
     * Retrieves all extents for multiple names as a flat array
     * @param names - Array of extent area names
     * @returns Flattened array of all extents
     */
    getAllExtents(names: string[]): Promise<Extent[]>;
}
//# sourceMappingURL=ExtentManager.d.ts.map