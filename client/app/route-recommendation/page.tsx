"use client";

import { useState } from 'react';

export default function RouteRecommendationPage() {
  const [origin, setOrigin] = useState('12.9716,77.5946');
  const [destination, setDestination] = useState('12.9800,77.6050');
  const [time, setTime] = useState('20:00');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const [originLat, originLng] = origin.split(',').map((value) => Number(value.trim()));
      const [destinationLat, destinationLng] = destination.split(',').map((value) => Number(value.trim()));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/complaints/route-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { latitude: originLat, longitude: originLng },
          destination: { latitude: destinationLat, longitude: destinationLng },
          time,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to generate route recommendation');
      }

      setResult(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Safer Route Recommendation</h1>
          <p className="mt-2 text-slate-600">Use the latest safety heatmap signals to compare a primary route with a safer alternative.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Origin (lat,lng)
              <input value={origin} onChange={(event) => setOrigin(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Destination (lat,lng)
              <input value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Time
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:bg-slate-400">
            {loading ? 'Analyzing...' : 'Get Recommendation'}
          </button>
        </form>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

        {result ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recommendation</h2>
              <p className="mt-2 text-slate-700">{result.routeRecommendation}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Risk explanation</h2>
              <p className="mt-2 text-slate-700">{result.riskExplanation}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Risky areas detected</h2>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {result.riskyAreasDetected.length === 0 ? <li>No nearby risky areas detected.</li> : result.riskyAreasDetected.map((item: any) => <li key={item.label} className="rounded-lg bg-slate-50 px-3 py-2">{item.label} — risk {item.risk}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Safer alternative</h2>
              <p className="mt-2 text-slate-700">{result.saferAlternativeExplanation}</p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
