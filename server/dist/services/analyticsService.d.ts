export interface ComplaintLike {
    _id?: string;
    complaintId?: string;
    status?: string;
    severity?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    escalationLevel?: number;
    issueType?: string;
}
export declare const evaluateEscalation: (complaint: ComplaintLike) => {
    shouldEscalate: boolean;
    updatedComplaint: {
        status: string;
        _id?: string;
        complaintId?: string;
        severity?: string;
        latitude?: number;
        longitude?: number;
        createdAt?: Date | string;
        updatedAt?: Date | string;
        escalationLevel?: number;
        issueType?: string;
    };
};
export declare const buildSafetyHeatmap: (complaints: ComplaintLike[]) => {
    latitude: number;
    longitude: number;
    riskScore: number;
    issueType: string;
    severity: string;
    reportCount: number;
    lastReportedAt: string | Date;
    timeContext: string;
}[];
//# sourceMappingURL=analyticsService.d.ts.map