import { apiUrl } from '@/lib/api';
import { Suspense } from 'react';

async function fetchTrackingData() {
  const response = await fetch(apiUrl('/complaints'), {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return payload.data || [];
}

async function TrackingContent() {
  const complaints = await fetchTrackingData();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Complaint Tracking</h1>
          <p className="mt-2 text-slate-600">Monitor complaint status, responsible authority, and escalation progress.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {complaints.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-slate-600 md:col-span-2 xl:col-span-3">
              No complaints have been submitted yet. Submit one from the complaint form to see tracking details.
            </div>
          ) : (
            complaints.map((complaint: any) => (
              <article key={complaint._id || complaint.complaintId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{complaint.complaintId || 'Complaint'}</h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                    {complaint.status || 'Pending'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{complaint.description || 'No description provided.'}</p>
                <dl className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <dt className="font-medium">Severity</dt>
                    <dd>{complaint.severity || 'Medium'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Authority</dt>
                    <dd>{complaint.responsibleAuthority || 'Pending routing'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Escalation</dt>
                    <dd>{complaint.escalationLevel || 0}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading tracking data...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
