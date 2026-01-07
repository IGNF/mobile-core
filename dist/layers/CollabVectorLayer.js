/**
 * Collaborative vector layer
 * @migrated from: ol/layer/CollabVector.js
 */
import VectorLayer from "ol/layer/Vector";
import { DEFAULT_LAYERS_VALUES } from "./DefaultLayersValues";
import CollabVectorSource from "../sources/CollabVectorSource";
import { View } from "ol";
import { CollabStyler } from "../styles/CollabStyler";
export class CollabVectorLayer extends VectorLayer {
    constructor(options, sourceOptions) {
        sourceOptions = sourceOptions || {};
        const superOptions = CollabVectorLayer._computeCollabVectorLayerOptions(options);
        super(superOptions);
        this.set("name", options.database + ':' + options.name);
        sourceOptions.client = options.client;
        if (options.cacheUrl) {
            // TODO, pass directly the file uri from the file system in the options???
            // previous code: source_options.cacheUrl = CordovApp.File.getFileURI(options.cacheUrl) //options.cacheUrl;
            sourceOptions.cacheUrl = options.cacheUrl;
            sourceOptions.online = (sourceOptions.online != undefined) ? sourceOptions.online : false;
            this.set("cache", true);
        }
        this.createSource(options, sourceOptions, options.table);
    }
    /**
     * Computes the options for the CollabVector layer
     * @param options
     * @returns The options for the VectorLayer super constructor
     */
    static _computeCollabVectorLayerOptions(options) {
        return {
            database: options.database,
            name: options.name,
            url: options.url,
            renderMode: options.renderMode || DEFAULT_LAYERS_VALUES.COLLAB_VECTOR_RENDER_MODE,
        };
    }
    /**
     * Creates the source for the CollabVector layer
     * @param options
     * @param sourceOptions
     * @param table
     * @returns The source for the CollabVector layer
     *
     * TODO
     * See if we can refactor the "table" attribute, options.table seems to equal sourceOptions.table and table
     */
    createSource(options, sourceOptions, table) {
        // Ensure sourceOptions has required properties
        const completeSourceOptions = {
            ...sourceOptions,
            table: table,
            client: sourceOptions.client || options.client,
        };
        if (options.checkSourceOptions) {
            options.checkSourceOptions(this, completeSourceOptions, table);
        }
        // CollabVector source
        const vectorSource = new CollabVectorSource(completeSourceOptions);
        this.setSource(vectorSource);
        // CollabVector Layer
        this.set("title", table.title);
        // Set zoom level / resolution for the layer
        const view = new View();
        if (table.maxZoomLevel && table.maxZoomLevel < 20) {
            view.setZoom(table.maxZoomLevel);
            this.setMinResolution(view.getResolution() ?? 0);
        }
        if (table.minZoomLevel || table.minZoomLevel === 0) {
            view.setZoom(Math.max(table.minZoomLevel, 4));
            this.setMaxResolution((view.getResolution() ?? 0) + 1);
        }
        // Decode condition (parse string)
        if (table.style && table.style.children) {
            for (const child of table.style.children) {
                if (typeof (child.condition) === 'string') {
                    try {
                        child.condition = JSON.parse(child.condition);
                    }
                    catch (e) { /* ok */ }
                }
            }
        }
        if (table.styles && table.styles.length) {
            let found = false;
            table.styles.forEach((st) => {
                if (table.style && st.id === table.style.id) {
                    found = true;
                }
                if (st.children) {
                    st.children.forEach((s) => {
                        if (typeof (s.condition) === 'string') {
                            try {
                                s.condition = JSON.parse(s.condition);
                            }
                            catch (e) { /* ok */ }
                        }
                    });
                }
            });
            if (!found && table.style) {
                table.styles.unshift(table.style);
            }
        }
        // Apply default styling using CollabStyler if no custom style provided
        if (!options.style) {
            // todo, "options.cacheUrl" was before CordovApp.File.getFileURI(options.cacheUrl)
            // see if we can now pass directly the cacheURL in the options (see this file in the contructor - same issue)
            const styleFunction = CollabStyler.getFeatureStyleFunction(table, options.cacheUrl ?? '', completeSourceOptions);
            this.setStyle(styleFunction); // Cast needed due to OL StyleLike vs StyleFunction typing
        }
        this.dispatchEvent({ type: "ready", source: vectorSource });
    }
    /**
     * Get the table for the CollabVector layer
     * @returns The table for the CollabVector layer, or undefined if not ready
     */
    getTable() {
        const source = this.getSource();
        if (this.isReady() && source)
            return source.table;
        return undefined;
    }
    /**
     * Get the style for features in this layer
     * @returns The layer style, or undefined if not ready
     */
    getFeatureStyle() {
        const source = this.getSource();
        if (this.isReady() && source)
            return source.table.style;
        return undefined;
    }
    /**
     * Check if the layer is ready (has a source with a table)
     * @returns True if the layer is ready, false otherwise
     */
    isReady() {
        const source = this.getSource();
        return source !== null && source.table !== undefined;
    }
    /**
     * Set the online/offline mode for the layer
     * @param online - True for online mode, false for offline mode
     */
    setOnline(online) {
        const source = this.getSource();
        if (!source)
            return;
        source.localProperties.online = online;
        source.refresh();
    }
}
//# sourceMappingURL=CollabVectorLayer.js.map