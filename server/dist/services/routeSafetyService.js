const severityWeight = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
};
export const recommendSaferRoute = (input, heatmapPoints = []) => {
    if (!Number.isFinite(input.origin?.latitude) || !Number.isFinite(input.origin?.longitude) || !Number.isFinite(input.destination?.latitude) || !Number.isFinite(input.destination?.longitude)) {
        return {
            routeRecommendation: 'Route recommendation unavailable due to invalid coordinates.',
            riskExplanation: 'Unable to evaluate risk without valid origin and destination coordinates.',
            riskyAreasDetected: [],
            saferAlternativeExplanation: 'Please provide valid location coordinates.',
        };
    }
    const hour = Number(input.time?.split(':')[0] ?? '12');
    const isEvening = hour >= 18 || hour <= 6;
    const riskyAreasDetected = (heatmapPoints || [])
        .filter((point) => typeof point.latitude === 'number' && typeof point.longitude === 'number')
        .map((point) => {
        const distanceKm = Math.hypot(point.latitude - input.origin.latitude, point.longitude - input.origin.longitude) * 111;
        const severity = severityWeight[(point.severity || 'Medium').toString()] ?? 2;
        const adjustedRisk = Math.min(100, Math.round((point.riskScore || 30) * (isEvening ? 1.15 : 1) + Math.max(0, 20 - distanceKm) + severity * 4));
        return {
            label: `${point.issueType || 'Unsafe area'} (${(point.severity || 'Medium').toString()})`,
            risk: adjustedRisk,
        };
    })
        .sort((a, b) => b.risk - a.risk)
        .slice(0, 3);
    const totalRisk = riskyAreasDetected.reduce((sum, item) => sum + item.risk, 0);
    const routeRecommendation = `Primary route from ${input.origin.latitude.toFixed(3)},${input.origin.longitude.toFixed(3)} to ${input.destination.latitude.toFixed(3)},${input.destination.longitude.toFixed(3)}.`;
    const riskExplanation = totalRisk > 60
        ? 'This route passes near elevated-risk areas and is less suitable during the selected time window.'
        : 'No strong safety penalty was detected along the primary route.';
    const saferAlternativeExplanation = riskyAreasDetected.length > 0
        ? `A safer alternative is to avoid the cluster around ${riskyAreasDetected[0].label.toLowerCase()} and choose a parallel corridor where possible.`
        : 'No alternative route adjustment is needed based on current safety data.';
    return {
        routeRecommendation,
        riskExplanation,
        riskyAreasDetected,
        saferAlternativeExplanation,
    };
};
//# sourceMappingURL=routeSafetyService.js.map