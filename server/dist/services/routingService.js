const authorityRoutingMap = {
    streetlight: 'Public Lighting/Electrical Department',
    'illegal dumping': 'Sanitation Department',
    'blocked drain': 'Drainage/Public Works Department',
    'road damage': 'Public Works Department',
    encroachment: 'Municipal Enforcement',
    'unsafe location': 'Community Safety/Police Liaison',
};
const severityWeightMap = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
};
export class RoutingService {
    routeComplaint(context) {
        const issueType = (context.issueType || '').toLowerCase().trim();
        const category = (context.category || '').toLowerCase().trim();
        const severity = (context.severity || 'medium').toLowerCase().trim();
        const ward = context.ward?.trim();
        const combinedKey = [issueType, category].find(Boolean) || '';
        const authority = authorityRoutingMap[combinedKey] || authorityRoutingMap[issueType] || 'Municipal Corporation';
        const severityWeight = severityWeightMap[severity] ?? 1;
        let escalationLevel = 0;
        const reasons = [];
        if (authority !== 'Municipal Corporation') {
            reasons.push(`Matched ${combinedKey || issueType || 'issue'} to ${authority}`);
        }
        if (severityWeight >= 2) {
            escalationLevel = 1;
            reasons.push('High severity increased escalation level');
        }
        if (ward) {
            reasons.push(`Ward context: ${ward}`);
        }
        if (context.location?.latitude !== undefined && context.location?.longitude !== undefined) {
            reasons.push('Location coordinates provided');
        }
        if (severityWeight >= 3) {
            escalationLevel = 2;
            reasons.push('Critical severity requires priority escalation');
        }
        return {
            responsibleAuthority: authority,
            escalationLevel,
            reasons,
        };
    }
}
export default new RoutingService();
//# sourceMappingURL=routingService.js.map