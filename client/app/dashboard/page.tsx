import { Suspense } from 'react';

async function fetchDashboardData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/complaints/dashboard`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data || null;
}

async function DashboardContent() {
  const metrics = await fetchDashboardData();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ward Responsiveness Dashboard</h1>
          <p className="mt-2 text-slate-600">Monitor complaint volume, resolution performance, and ward-level activity.</p>
        </div>

        {!metrics ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            No dashboard data is available yet.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total complaints', value: metrics.totalComplaints },
                { label: 'Resolved', value: metrics.resolvedComplaints },
                { label: 'Pending', value: metrics.pendingComplaints },
                { label: 'Escalated', value: metrics.escalatedComplaints },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Performance</h2>
                <dl className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between"><dt>Resolution rate</dt><dd>{metrics.resolutionRate}%</dd></div>
                  <div className="flex justify-between"><dt>Average resolution time</dt><dd>{metrics.averageResolutionTimeHours} hrs</dd></div>
                  <div className="flex justify-between"><dt>Average response time</dt><dd>{metrics.averageResponseTimeHours} hrs</dd></div>
                </dl>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Complaints by category</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {metrics.complaintsByCategory.map((item: any) => (
                    <li key={item.category} className="flex justify-between"><span>{item.category}</span><span>{item.count}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Complaints by ward</h2>
              <ul className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                {metrics.complaintsByWard.map((item: any) => (
                  <li key={item.ward} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"><span>{item.ward}</span><span>{item.count}</span></li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading dashboard data...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
