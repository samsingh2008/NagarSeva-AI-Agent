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

const severityWeights: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const escalationThresholds: Record<string, number> = {
  Critical: 24,
  High: 48,
  Medium: 72,
  Low: 168,
};

export const evaluateEscalation = (complaint: ComplaintLike) => {
  const status = complaint.status || 'Pending';
  if (['Resolved', 'Rejected'].includes(status)) {
    return {
      shouldEscalate: false,
      updatedComplaint: { ...complaint, status },
    };
  }

  const currentLevel = complaint.escalationLevel || 0;
  if (status === 'Escalated' || currentLevel >= 1) {
    return {
      shouldEscalate: false,
      updatedComplaint: { ...complaint, status, escalationLevel: currentLevel },
    };
  }

  const severity = (complaint.severity || 'Medium').toString();
  const createdAt = complaint.createdAt ? new Date(complaint.createdAt) : new Date();
  const ageHours = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
  const threshold = escalationThresholds[severity] ?? escalationThresholds.Medium;
  const shouldEscalate = ageHours >= threshold;

  const updatedComplaint = {
    ...complaint,
    status: shouldEscalate ? 'Escalated' : status,
    escalationLevel: shouldEscalate ? currentLevel + 1 : currentLevel,
  };

  return { shouldEscalate, updatedComplaint };
};

export const buildSafetyHeatmap = (complaints: ComplaintLike[]) => {
  if (!complaints.length) {
    return [];
  }

  const grouped = new Map<string, ComplaintLike[]>();
  complaints.forEach((complaint) => {
    if (typeof complaint.latitude !== 'number' || typeof complaint.longitude !== 'number') {
      return;
    }

    const key = `${complaint.latitude.toFixed(3)}:${complaint.longitude.toFixed(3)}`;
    const existing = grouped.get(key) || [];
    existing.push(complaint);
    grouped.set(key, existing);
  });

  return Array.from(grouped.entries()).map(([key, items]) => {
    const lat = Number(key.split(':')[0]);
    const lng = Number(key.split(':')[1]);
    const sorted = [...items].sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
    const highestSeverity = sorted.reduce((current, item) => {
      const weight = severityWeights[(item.severity || 'Medium').toString()] ?? severityWeights.Medium;
      return weight > (severityWeights[current] ?? severityWeights.Medium) ? (item.severity || 'Medium').toString() : current;
    }, 'Low');

    const reportCount = items.length;
    const hoursSinceLast = Math.max(0, (Date.now() - new Date(sorted[0].createdAt || Date.now()).getTime()) / (1000 * 60 * 60));
    const recencyFactor = Math.max(0.1, 1 - hoursSinceLast / 168);
    const severityFactor = severityWeights[highestSeverity] ?? severityWeights.Medium;
    const riskScore = Math.min(100, Math.round((severityFactor * 18 + reportCount * 10 + recencyFactor * 12) * 2));

    return {
      latitude: lat,
      longitude: lng,
      riskScore,
      issueType: sorted[0].issueType || 'General',
      severity: highestSeverity,
      reportCount,
      lastReportedAt: sorted[0].createdAt || new Date(),
      timeContext: hoursSinceLast < 24 ? 'recent' : hoursSinceLast < 72 ? 'today' : 'ongoing',
    };
  });
};
