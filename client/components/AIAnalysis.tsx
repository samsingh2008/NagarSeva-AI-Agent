import { ComplaintRecord, getComplaintAIAnalysis } from '@/lib/complaints';

interface AIAnalysisProps {
  complaint?: ComplaintRecord | null;
  className?: string;
}

const hasText = (value?: string | null) => Boolean(value?.trim());

const formatValue = (value?: string | null) => value?.trim() || 'Pending';

const formatConfidence = (confidence?: number | null) => {
  if (typeof confidence !== 'number' || !Number.isFinite(confidence)) {
    return 'Pending';
  }

  const percentage = confidence <= 1 ? confidence * 100 : confidence;
  return `${Math.round(Math.max(0, Math.min(100, percentage)))}%`;
};

const getSeverityBadgeClass = (severity?: string | null) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export default function AIAnalysis({ complaint, className = '' }: AIAnalysisProps) {
  const analysis = getComplaintAIAnalysis(complaint);
  const suggestedActions = Array.isArray(analysis?.suggestedActions)
    ? analysis.suggestedActions.filter((action) => hasText(action))
    : [];
  const hasAnalysis = Boolean(
    hasText(analysis?.category) ||
      hasText(analysis?.severity) ||
      hasText(analysis?.department) ||
      hasText(analysis?.summary) ||
      typeof analysis?.confidence === 'number' ||
      suggestedActions.length > 0
  );

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI Analysis</h2>
          <p className="text-sm text-slate-500">Generated from the submitted complaint details.</p>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityBadgeClass(analysis?.severity)}`}>
          {formatValue(analysis?.severity)}
        </span>
      </div>

      {!hasAnalysis ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          AI analysis pending
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-medium text-slate-500">Category</dt>
              <dd className="mt-1 font-semibold text-slate-900">{formatValue(analysis?.category)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-medium text-slate-500">Department</dt>
              <dd className="mt-1 font-semibold text-slate-900">{formatValue(analysis?.department)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-medium text-slate-500">Confidence</dt>
              <dd className="mt-1 font-semibold text-slate-900">{formatConfidence(analysis?.confidence)}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="font-medium text-slate-500">Severity</dt>
              <dd className="mt-1">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getSeverityBadgeClass(analysis?.severity)}`}>
                  {formatValue(analysis?.severity)}
                </span>
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
            <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {formatValue(analysis?.summary)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Suggested Actions</h3>
            {suggestedActions.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 rounded-lg bg-slate-50 p-4 pl-8 text-sm text-slate-700">
                {suggestedActions.map((action, index) => (
                  <li key={`${action}-${index}`}>{action}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">AI analysis pending</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
