/**
 * This utils class aims to manage projections
 */

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js';
import { Extent } from 'ol/extent';

export class ProjectionUtils {

  /**
   * Initialize all French projections
   * Define projections if not already defined
   */
  public initProjections(): void {
    if (!proj4.defs("EPSG:2154")) proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    if (!proj4.defs("IGNF:LAMB93")) proj4.defs("IGNF:LAMB93", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    if (!proj4.defs("EPSG:27572")) proj4.defs("EPSG:27572", "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs");
    if (!proj4.defs("EPSG:2975")) proj4.defs("EPSG:2975", "+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    // Saint-Pierre et Miquelon
    if (!proj4.defs("EPSG:4467")) proj4.defs("EPSG:4467", "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    // Antilles
    if (!proj4.defs("EPSG:4559")) proj4.defs("EPSG:4559", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    if (!proj4.defs("EPSG:5490")) proj4.defs("EPSG:5490", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    // Guyane
    if (!proj4.defs("EPSG:2972")) proj4.defs("EPSG:2972", "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    // Mayotte
    if (!proj4.defs("EPSG:EPSG:4471")) proj4.defs("EPSG:4471", "+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    register(proj4);
  }

  public registerCustomProjection(code: string, proj4def: string){
    if(!proj4.defs(code)){
      proj4.defs(code, proj4def);
    }
  }

  /**
   * Transform coordinates from one projection to another
   * @param coords - Coordinates as [x, y] or [longitude, latitude]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed coordinates as [x, y]
   */
  public transformCoordinates(coords: [number, number], fromProj: string, toProj: string): [number, number] {
    const result = proj4(fromProj, toProj, coords);
    return [result[0], result[1]];
  }

  /**
   * Transform an extent from one projection to another
   * @param extent - Extent as [minX, minY, maxX, maxY]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed extent as [minX, minY, maxX, maxY]
   */
  public transformExtent(extent: Extent, fromProj: string, toProj: string): Extent {
    const [minX, minY, maxX, maxY] = extent;
    
    // Transform all four corners of the extent
    const bottomLeft = proj4(fromProj, toProj, [minX, minY]);
    const bottomRight = proj4(fromProj, toProj, [maxX, minY]);
    const topLeft = proj4(fromProj, toProj, [minX, maxY]);
    const topRight = proj4(fromProj, toProj, [maxX, maxY]);
    
    // Find the new bounds
    const transformedMinX = Math.min(bottomLeft[0], bottomRight[0], topLeft[0], topRight[0]);
    const transformedMinY = Math.min(bottomLeft[1], bottomRight[1], topLeft[1], topRight[1]);
    const transformedMaxX = Math.max(bottomLeft[0], bottomRight[0], topLeft[0], topRight[0]);
    const transformedMaxY = Math.max(bottomLeft[1], bottomRight[1], topLeft[1], topRight[1]);
    
    return [transformedMinX, transformedMinY, transformedMaxX, transformedMaxY];
  }

  

  constructor() {
    // see if it's really useful here
    this.initProjections();
  }
}