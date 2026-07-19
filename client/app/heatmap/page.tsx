import { apiUrl } from '@/lib/api';
import { Suspense } from 'react';

async function fetchHeatmapData() {
  const response = await fetch(apiUrl('/safety/heatmap'), {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return payload.data || [];
}

async function HeatmapContent() {
  const points = await fetchHeatmapData();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Safety Heatmap</h1>
          <p className="mt-2 text-slate-600">View clustered unsafe locations derived from complaint data.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {points.length === 0 ? (
            <p className="text-slate-600">No complaint data is available yet, so there are no heatmap points to display.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {points.map((point: any, index: number) => (
                <div key={`${point.latitude}-${point.longitude}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">{point.issueType || 'General'}</h2>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Risk {point.riskScore}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <dt className="font-medium">Severity</dt>
                      <dd>{point.severity || 'Medium'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Reports</dt>
                      <dd>{point.reportCount || 1}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Location</dt>
                      <dd>{point.latitude.toFixed(3)}, {point.longitude.toFixed(3)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function HeatmapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading heatmap data...</div>}>
      <HeatmapContent />
    </Suspense>
  );
}
