/**
 * This utils class aims to manage projections
 */

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js';

export class ProjectionUtils {

  /**
   * Initialize all French projections
   * Define projections if not already defined
   */
  private _initProjections(): void {
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

  constructor() {
    this._initProjections();

  }
}