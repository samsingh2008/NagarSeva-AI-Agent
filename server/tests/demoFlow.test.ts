import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeComplaint } from '../src/services/aiAnalysisService.js';

test('falls back to a deterministic analysis when no AI key is configured', () => {
  const result = analyzeComplaint({ description: 'Streetlight outage near the school', latitude: 12.9716, longitude: 77.5946 });
  assert.equal(result.inferredIssueType, 'Streetlight');
  assert.equal(result.severity, 'High');
  assert.equal(result.responsibleAuthority.includes('Lighting'), true);
});

test('handles general complaints without crashing', () => {
  const result = analyzeComplaint({ description: 'General issue', latitude: 12.97, longitude: 77.59 });
  assert.equal(result.inferredIssueType, 'General');
  assert.equal(result.severity, 'Medium');
});
