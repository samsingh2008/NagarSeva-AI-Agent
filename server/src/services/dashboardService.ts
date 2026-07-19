export interface ComplaintDashboardSummary {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  escalatedComplaints: number;
  resolutionRate: number;
  averageResolutionTimeHours: number;
  complaintsByCategory: Array<{ category: string; count: number }>;
  complaintsByWard: Array<{ ward: string; count: number }>;
  averageResponseTimeHours: number;
}

export const buildDashboardSummary = (complaints: Array<Record<string, unknown>>): ComplaintDashboardSummary => {
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((complaint) => (complaint.status as string) === 'Resolved').length;
  const pendingComplaints = complaints.filter((complaint) => ['Pending', 'Assigned', 'In Progress', 'Escalated'].includes((complaint.status as string) || 'Pending')).length;
  const escalatedComplaints = complaints.filter((complaint) => (complaint.status as string) === 'Escalated').length;
  const completionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;

  const resolutionTimes = complaints
    .filter((complaint) => complaint.status === 'Resolved' && complaint.resolvedAt)
    .map((complaint) => {
      const createdAt = complaint.createdAt ? new Date(complaint.createdAt as string).getTime() : Date.now();
      const resolvedAt = new Date(complaint.resolvedAt as string).getTime();
      return (resolvedAt - createdAt) / (1000 * 60 * 60);
    });

  const responseTimes = complaints
    .filter((complaint) => complaint.createdAt)
    .map((complaint) => {
      const createdAt = new Date(complaint.createdAt as string).getTime();
      const now = Date.now();
      return (now - createdAt) / (1000 * 60 * 60);
    });

  const complaintsByCategory = Array.from(
    complaints.reduce((acc, complaint) => {
      const category = (complaint.issueType as string) || 'General';
      acc.set(category, (acc.get(category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);

  const complaintsByWard = Array.from(
    complaints.reduce((acc, complaint) => {
      const ward = (complaint.ward as string) || 'Unassigned';
      acc.set(ward, (acc.get(ward) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([ward, count]) => ({ ward, count })).sort((a, b) => b.count - a.count);

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
