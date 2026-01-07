/**
 * This utils class aims to manage projections
 */
import { Extent } from 'ol/extent';
export declare class ProjectionUtils {
    /**
     * Initialize all French projections
     * Define projections if not already defined
     */
    initProjections(): void;
    registerCustomProjection(code: string, proj4def: string): void;
    /**
     * Transform coordinates from one projection to another
     * @param coords - Coordinates as [x, y] or [longitude, latitude]
     * @param fromProj - Source projection code (e.g., 'EPSG:4326')
     * @param toProj - Target projection code (e.g., 'EPSG:2154')
     * @returns Transformed coordinates as [x, y]
     */
    transformCoordinates(coords: [number, number], fromProj: string, toProj: string): [number, number];
    /**
     * Transform an extent from one projection to another
     * @param extent - Extent as [minX, minY, maxX, maxY]
     * @param fromProj - Source projection code (e.g., 'EPSG:4326')
     * @param toProj - Target projection code (e.g., 'EPSG:2154')
     * @returns Transformed extent as [minX, minY, maxX, maxY]
     */
    transformExtent(extent: Extent, fromProj: string, toProj: string): Extent;
    constructor();
}
//# sourceMappingURL=ProjectionUtils.d.ts.map