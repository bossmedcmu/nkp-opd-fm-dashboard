interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  unit?: string;
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  valueSuffix?: string;
}

export function CustomChartTooltip({
  active,
  payload,
  label,
  valueSuffix = '',
}: CustomChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
      {label && (
        <p className="mb-1.5 border-b border-slate-100 pb-1 font-bold text-slate-900 dark:border-slate-800 dark:text-slate-100">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={`${entry.name ?? idx}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color || '#10b981' }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString('th-TH', { maximumFractionDigits: 2 })
                : entry.value}
              {entry.unit ?? valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
