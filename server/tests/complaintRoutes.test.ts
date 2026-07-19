import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import complaintRoutes from '../src/routes/complaints.js';

test('dashboard route resolves before complaint id route', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/complaints', complaintRoutes);

  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));

  const address = server.address();
  if (typeof address !== 'object' || address === null) {
    throw new Error('Unable to determine server port');
  }

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/complaints/dashboard`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(typeof body.data?.totalComplaints, 'number');
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
