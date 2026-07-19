import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEscalation, buildSafetyHeatmap } from '../src/services/analyticsService.js';

test('does not escalate a complaint below threshold', () => {
  const complaint = {
    _id: 'c1',
    complaintId: 'CMP-1',
    status: 'Pending',
    severity: 'Low',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
  };

  const result = evaluateEscalation(complaint as any);
  assert.equal(result.shouldEscalate, false);
  assert.equal(result.updatedComplaint.status, 'Pending');
});

test('escalates a complaint beyond threshold', () => {
  const complaint = {
    _id: 'c2',
    complaintId: 'CMP-2',
    status: 'Pending',
    severity: 'High',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
  };

  const result = evaluateEscalation(complaint as any);
  assert.equal(result.shouldEscalate, true);
  assert.equal(result.updatedComplaint.status, 'Escalated');
  assert.equal(result.updatedComplaint.escalationLevel, 1);
});

test('does not escalate resolved complaints', () => {
  const complaint = {
    _id: 'c3',
    complaintId: 'CMP-3',
    status: 'Resolved',
    severity: 'Critical',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
  };

  const result = evaluateEscalation(complaint as any);
  assert.equal(result.shouldEscalate, false);
  assert.equal(result.updatedComplaint.status, 'Resolved');
});

test('does not escalate repeatedly once already escalated', () => {
  const complaint = {
    _id: 'c4',
    complaintId: 'CMP-4',
    status: 'Escalated',
    severity: 'High',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    escalationLevel: 1,
  };

  const result = evaluateEscalation(complaint as any);
  assert.equal(result.shouldEscalate, false);
  assert.equal(result.updatedComplaint.escalationLevel, 1);
});

test('builds a heatmap from empty complaint data', () => {
  const result = buildSafetyHeatmap([] as any[]);
  assert.deepEqual(result, []);
});

test('builds heatmap points for unsafe complaints', () => {
  const complaints = [
    {
      _id: '1',
      issueType: 'Streetlight',
      severity: 'High',
      latitude: 12.9716,
      longitude: 77.5946,
      createdAt: new Date(),
    },
    {
      _id: '2',
      issueType: 'Road Damage',
      severity: 'Critical',
      latitude: 12.9716,
      longitude: 77.5946,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  const result = buildSafetyHeatmap(complaints as any[]);
  assert.equal(result.length, 1);
  assert.equal(result[0].reportCount, 2);
  assert.equal(result[0].riskScore > 0, true);
  assert.equal(result[0].severity, 'Critical');
});
