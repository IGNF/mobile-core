export const DEFAULT_REPORT_VALUES = {
    FEATURE2SKETCH: {
        TRANSFORM_PROJECTION: 'EPSG:4326',
        SKETCH_STYLE: {
            "graphicName": "circle",
            "diam": 2,
            "frontcolor": "#FFAA00;1",
            "backcolor": "#FFAA00;0.5"
        },
        SKETCH_CONTEXT: {
            "lon": 0,
            "lat": 0,
            "zoom": 15,
            "layers": ["GEOGRAPHICALGRIDSYSTEMS.MAPS"]
        }
    },
    SKETCH2FEATURE: {
        TRANSFORM_PROJECTION: 'EPSG:4326',
        TRANSFORM_PROJECTION_FALLBACK: 'EPSG:3857',
    }
};
//# sourceMappingURL=DefaultReportValues.js.map