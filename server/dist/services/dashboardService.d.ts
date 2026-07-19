export interface ComplaintDashboardSummary {
    totalComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    escalatedComplaints: number;
    resolutionRate: number;
    averageResolutionTimeHours: number;
    complaintsByCategory: Array<{
        category: string;
        count: number;
    }>;
    complaintsByWard: Array<{
        ward: string;
        count: number;
    }>;
    averageResponseTimeHours: number;
}
export declare const buildDashboardSummary: (complaints: Array<Record<string, unknown>>) => ComplaintDashboardSummary;
//# sourceMappingURL=dashboardService.d.ts.map