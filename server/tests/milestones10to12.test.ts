import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendSaferRoute } from '../src/services/routeSafetyService.js';
import { buildDashboardSummary } from '../src/services/dashboardService.js';

test('returns a safe fallback when no unsafe areas are present', () => {
  const result = recommendSaferRoute(
    {
      origin: { latitude: 12.97, longitude: 77.59 },
      destination: { latitude: 12.98, longitude: 77.60 },
      time: '14:00',
    },
    []
  );

  assert.equal(result.riskyAreasDetected.length, 0);
  assert.equal(result.routeRecommendation.includes('Primary route'), true);
});

test('detects nearby unsafe areas along a route', () => {
  const result = recommendSaferRoute(
    {
      origin: { latitude: 12.97, longitude: 77.59 },
      destination: { latitude: 12.98, longitude: 77.60 },
      time: '20:00',
    },
    [{ latitude: 12.971, longitude: 77.591, riskScore: 90, severity: 'High', issueType: 'Streetlight' }]
  );

  assert.equal(result.riskyAreasDetected.length, 1);
  assert.equal(result.riskyAreasDetected[0].risk > 0, true);
});

test('handles invalid coordinates gracefully', () => {
  const result = recommendSaferRoute(
    {
      origin: { latitude: NaN, longitude: 77.59 },
      destination: { latitude: 12.98, longitude: 77.60 },
      time: '14:00',
    },
    []
  );

  assert.equal(result.routeRecommendation.includes('unavailable'), true);
});

test('builds dashboard metrics for empty data', () => {
  const result = buildDashboardSummary([] as Array<Record<string, unknown>>);
  assert.equal(result.totalComplaints, 0);
  assert.equal(result.resolutionRate, 0);
});

test('builds dashboard metrics for sample complaints', () => {
  const result = buildDashboardSummary([
    { status: 'Resolved', issueType: 'Road Damage', ward: 'Ward 1', createdAt: '2024-01-01T00:00:00Z', resolvedAt: '2024-01-02T00:00:00Z' },
    { status: 'Escalated', issueType: 'Streetlight', ward: 'Ward 2', createdAt: '2024-01-01T00:00:00Z' },
    { status: 'Pending', issueType: 'Road Damage', ward: 'Ward 1', createdAt: '2024-01-01T00:00:00Z' },
  ] as Array<Record<string, unknown>>);

  assert.equal(result.totalComplaints, 3);
  assert.equal(result.resolvedComplaints, 1);
  assert.equal(result.escalatedComplaints, 1);
  assert.equal(result.complaintsByCategory.length, 2);
});
