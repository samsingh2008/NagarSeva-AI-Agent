export const buildDashboardSummary = (complaints) => {
    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'Resolved').length;
    const pendingComplaints = complaints.filter((complaint) => ['Pending', 'Assigned', 'In Progress', 'Escalated'].includes(complaint.status || 'Pending')).length;
    const escalatedComplaints = complaints.filter((complaint) => complaint.status === 'Escalated').length;
    const completionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;
    const resolutionTimes = complaints
        .filter((complaint) => complaint.status === 'Resolved' && complaint.resolvedAt)
        .map((complaint) => {
        const createdAt = complaint.createdAt ? new Date(complaint.createdAt).getTime() : Date.now();
        const resolvedAt = new Date(complaint.resolvedAt).getTime();
        return (resolvedAt - createdAt) / (1000 * 60 * 60);
    });
    const responseTimes = complaints
        .filter((complaint) => complaint.createdAt)
        .map((complaint) => {
        const createdAt = new Date(complaint.createdAt).getTime();
        const now = Date.now();
        return (now - createdAt) / (1000 * 60 * 60);
    });
    const complaintsByCategory = Array.from(complaints.reduce((acc, complaint) => {
        const category = complaint.issueType || 'General';
        acc.set(category, (acc.get(category) || 0) + 1);
        return acc;
    }, new Map())).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
    const complaintsByWard = Array.from(complaints.reduce((acc, complaint) => {
        const ward = complaint.ward || 'Unassigned';
        acc.set(ward, (acc.get(ward) || 0) + 1);
        return acc;
    }, new Map())).map(([ward, count]) => ({ ward, count })).sort((a, b) => b.count - a.count);
    return {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        escalatedComplaints,
        resolutionRate: Number(completionRate.toFixed(2)),
        averageResolutionTimeHours: resolutionTimes.length > 0 ? Number((resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length).toFixed(2)) : 0,
        complaintsByCategory,
        complaintsByWard,
        averageResponseTimeHours: responseTimes.length > 0 ? Number((responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(2)) : 0,
    };
};
//# sourceMappingURL=dashboardService.js.map