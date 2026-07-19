export interface RouteInput {
    origin: {
        latitude: number;
        longitude: number;
    };
    destination: {
        latitude: number;
        longitude: number;
    };
    time: string;
}
export interface HeatmapPointLike {
    latitude?: number;
    longitude?: number;
    riskScore?: number;
    severity?: string;
    issueType?: string;
}
export interface RouteRecommendationResult {
    routeRecommendation: string;
    riskExplanation: string;
    riskyAreasDetected: Array<{
        label: string;
        risk: number;
    }>;
    saferAlternativeExplanation: string;
}
export declare const recommendSaferRoute: (input: RouteInput, heatmapPoints?: HeatmapPointLike[]) => RouteRecommendationResult;
//# sourceMappingURL=routeSafetyService.d.ts.map