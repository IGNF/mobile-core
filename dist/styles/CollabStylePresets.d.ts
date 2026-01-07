/**
 * Domain-specific style presets for collaborative layers
 * Extracted from CollabStyler to separate concerns
 */
import { Feature } from "ol";
import { Style } from "ol/style";
import { CollabStyler } from "./CollabStyler";
/**
 * Collection of preset style functions for specific feature types
 * These presets are domain-specific and rely on CollabStyler utilities
 */
export declare class CollabStylePresets {
    private styler;
    constructor(styler: CollabStyler);
    zombie(): (feature: Feature) => Style[];
    detruit(): (feature: Feature) => Style[];
    vivant(): (feature: Feature) => Style[];
    combine(styleFns: ((feature: Feature, res: number) => Style | Style[])[] | ((feature: Feature, res: number) => Style | Style[])): (feature: Feature, res: number) => Style[];
    troncon_de_route(options: any): any;
    sens(options: any): (feature: Feature) => Style[];
    toponyme(options: any): (feature: any, res: number) => Style[];
    batiment(options: any): (feature: any) => Style[];
    getSymbol(feature: Feature): string | null;
}
//# sourceMappingURL=CollabStylePresets.d.ts.map