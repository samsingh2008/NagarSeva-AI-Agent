export interface ComplaintAnalysisPayload {
  description?: string;
  latitude?: number;
  longitude?: number;
  issueType?: string;
  severity?: string;
}

export interface ComplaintAnalysisResult {
  inferredIssueType: string;
  severity: string;
  responsibleAuthority: string;
  summary: string;
}

const issuePatterns: Array<{ keyword: string; issueType: string; severity: string; authority: string }> = [
  { keyword: 'streetlight', issueType: 'Streetlight', severity: 'High', authority: 'Public Lighting Department' },
  { keyword: 'drain', issueType: 'Blocked Drain', severity: 'High', authority: 'Drainage Department' },
  { keyword: 'dump', issueType: 'Illegal Dumping', severity: 'Medium', authority: 'Sanitation Department' },
  { keyword: 'road', issueType: 'Road Damage', severity: 'High', authority: 'Public Works Department' },
  { keyword: 'encroach', issueType: 'Encroachment', severity: 'High', authority: 'Municipal Enforcement' },
  { keyword: 'water', issueType: 'Water Supply', severity: 'Medium', authority: 'Water Department' },
];

export const analyzeComplaint = (payload: ComplaintAnalysisPayload): ComplaintAnalysisResult => {
  const description = (payload.description || '').toLowerCase();
  const matched = issuePatterns.find((item) => description.includes(item.keyword));

  const inferredIssueType = matched?.issueType || payload.issueType || 'General';
  const severity = matched?.severity || payload.severity || 'Medium';
  const responsibleAuthority = matched?.authority || 'Municipal Corporation';
  const summary = description
    ? `AI review detected a ${inferredIssueType.toLowerCase()} concern with ${severity.toLowerCase()} priority.`
    : 'AI review completed with a general civic issue classification.';

  return {
    inferredIssueType,
    severity,
    responsibleAuthority,
    summary,
  };
};
