import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export function formatNum(n: number): string {
  return n.toLocaleString('th-TH');
}

export function formatPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trendLabel?: string;
  trendTone?: 'positive' | 'negative' | 'warning' | 'neutral';
  icon: ReactNode;
  accent?: 'emerald' | 'teal' | 'amber' | 'rose' | 'sky' | 'indigo';
}

const ACCENT_MAP = {
  emerald:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/60',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-800/60',
  amber:
    'bg-amber-50 text-amber-700 ring-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800/60',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/60',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800/60',
  indigo:
    'bg-indigo-50 text-indigo-700 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800/60',
};

const TREND_MAP = {
  positive:
    'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  negative: 'bg-rose-100/80 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  warning: 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function KpiCard({
  title,
  value,
  subtitle,
  trendLabel,
  trendTone = 'neutral',
  icon,
  accent = 'emerald',
}: KpiCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${ACCENT_MAP[accent]}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>
        {trendLabel && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TREND_MAP[trendTone]}`}
          >
            {trendTone === 'positive' && <ArrowUpRight className="h-3 w-3" />}
            {trendTone === 'negative' && <ArrowDownRight className="h-3 w-3" />}
            {trendTone === 'warning' && <Minus className="h-3 w-3" />}
            {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  badge,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/80 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              {title}
            </h2>
            {badge && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/60">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function InsightCallout({
  title,
  tone = 'emerald',
  children,
}: {
  title: string;
  tone?: 'emerald' | 'amber' | 'rose' | 'sky';
  children: ReactNode;
}) {
  const styles = {
    emerald:
      'border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100',
    amber:
      'border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100',
    rose: 'border-rose-200 bg-rose-50/70 text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100',
    sky: 'border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100',
  };

  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed ${styles[tone]}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1.5 text-xs leading-relaxed opacity-90 sm:text-sm">{children}</div>
    </div>
  );
}
