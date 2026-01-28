import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';
/**
 * Report status
 */
export var ReportStatus;
(function (ReportStatus) {
    ReportStatus["Draft"] = "draft";
    ReportStatus["Cluster"] = "cluster";
    ReportStatus["Submit"] = "submit";
    ReportStatus["Pending"] = "pending";
    ReportStatus["Pending_Qualification"] = "pending0";
    ReportStatus["Pending_Entry"] = "pending1";
    ReportStatus["Pending_Validation"] = "pending2";
    ReportStatus["Valid"] = "valid";
    ReportStatus["Valid_Already_Treated"] = "valid0";
    ReportStatus["Reject"] = "reject";
    ReportStatus["Reject_Irrelevant"] = "reject0";
})(ReportStatus || (ReportStatus = {}));
export var ClosedReportStatus;
(function (ClosedReportStatus) {
    ClosedReportStatus["Valid"] = "valid";
    ClosedReportStatus["Valid_Already_Treated"] = "valid0";
    ClosedReportStatus["Reject"] = "reject";
    ClosedReportStatus["Reject_Irrelevant"] = "reject0";
})(ClosedReportStatus || (ClosedReportStatus = {}));
export const BASE_RADIUS = 8;
export const baseCircleFill = new Fill({ color: [255, 255, 255, 0.8] });
export const STATUS_STYLES = {
    [ReportStatus.Cluster]: new Style({
        image: new CircleStyle({
            radius: BASE_RADIUS,
            stroke: new Stroke({ color: [255, 255, 255], width: 3 }),
            fill: baseCircleFill
        }),
        text: new Text({
            font: 'bold 12px Sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
            offsetY: 1,
            fill: new Fill({ color: [255, 255, 255] })
        })
    }),
    [ReportStatus.Pending]: new Style({
        image: new CircleStyle({
            radius: BASE_RADIUS,
            stroke: new Stroke({ color: [255, 128, 0], width: 3 }),
            fill: baseCircleFill
        })
    }),
    [ReportStatus.Submit]: new Style({
        image: new CircleStyle({
            radius: BASE_RADIUS,
            stroke: new Stroke({ color: [51, 102, 153], width: 3 }),
            fill: baseCircleFill
        })
    }),
    [ReportStatus.Valid]: new Style({
        image: new CircleStyle({
            radius: BASE_RADIUS,
            stroke: new Stroke({ color: [0, 192, 0], width: 3 }),
            fill: baseCircleFill
        })
    }),
    [ReportStatus.Reject]: new Style({
        image: new CircleStyle({
            radius: BASE_RADIUS,
            stroke: new Stroke({ color: [255, 0, 0], width: 3 }),
            fill: baseCircleFill
        })
    }),
};
//# sourceMappingURL=types.js.map