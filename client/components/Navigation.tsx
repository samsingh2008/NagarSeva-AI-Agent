import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          NagarSeva
        </Link>
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <Link href="/complaint" className="hover:text-blue-600">Report</Link>
          <Link href="/tracking" className="hover:text-blue-600">Tracking</Link>
          <Link href="/heatmap" className="hover:text-blue-600">Heatmap</Link>
          <Link href="/route-recommendation" className="hover:text-blue-600">Routes</Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
