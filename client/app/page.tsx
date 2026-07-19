import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-gray-900">NagarSeva</h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-600">
          Report civic issues, track them, and view safety hotspots from a single dashboard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/complaint" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700">
            Report a Complaint
          </Link>
          <Link href="/tracking" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            View Tracking
          </Link>
          <Link href="/heatmap" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            Safety Heatmap
          </Link>
        </div>
      </div>
    </main>
  );
}
