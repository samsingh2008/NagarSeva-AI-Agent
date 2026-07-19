export interface RoutingContext {
    issueType?: string;
    category?: string;
    severity?: string;
    ward?: string;
    location?: {
        latitude?: number;
        longitude?: number;
    };
}
export interface RoutingDecision {
    responsibleAuthority: string;
    escalationLevel: number;
    reasons: string[];
}
export declare class RoutingService {
    routeComplaint(context: RoutingContext): RoutingDecision;
}
declare const _default: RoutingService;
export default _default;
//# sourceMappingURL=routingService.d.ts.map