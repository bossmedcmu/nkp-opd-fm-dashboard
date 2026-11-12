import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  CalendarX2,
  HeartPulse,
  LayoutDashboard,
  Moon,
  Printer,
  Stethoscope,
  Sun,
  Syringe,
} from 'lucide-react';
import { AppointmentAnalyticsView } from './components/AppointmentAnalyticsView';
import { ExecutivePrintReport } from './components/ExecutivePrintReport';
import { type DashboardTab, ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { MorbidityAndDispositionView } from './components/MorbidityAndDispositionView';
import { NcdAndPreventionView } from './components/NcdAndPreventionView';
import { ProcedureAndTelemedView } from './components/ProcedureAndTelemedView';
import { WorkloadAndRightsView } from './components/WorkloadAndRightsView';
import { DATA_METADATA } from './data/clinicData';

const NAV_ITEMS: { id: DashboardTab; label: string; shortLabel: string; icon: typeof LayoutDashboard }[] = [
  { id: 'executive', label: 'บทสรุปผู้บริหาร & 11 คลินิก', shortLabel: 'สรุปผู้บริหาร', icon: LayoutDashboard },
  { id: 'workload', label: 'ปริมาณงาน & สิทธิการรักษา', shortLabel: 'ปริมาณงาน/สิทธิ', icon: BarChart3 },
  { id: 'appointments', label: 'การนัดหมาย & ขาดนัด', shortLabel: 'นัดหมาย/ขาดนัด', icon: CalendarX2 },
  { id: 'morbidity', label: '672 โรค & 66 การจำหน่าย', shortLabel: 'โรค & จำหน่าย', icon: Stethoscope },
  { id: 'ncd', label: 'DM/HT คัดกรอง & วัคซีน', shortLabel: 'NCD & คัดกรอง', icon: HeartPulse },
  { id: 'procedures', label: 'หัตถการ 14081 & Telemed', shortLabel: 'หัตถการ/Tele', icon: Syringe },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('executive');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (tab: DashboardTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="app-shell-no-print min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                    {DATA_METADATA.department}
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {DATA_METADATA.hospital} • ปีงบฯ {DATA_METADATA.fiscalYear} ({DATA_METADATA.totalClinics} รหัสคลินิก /{' '}
                    {DATA_METADATA.includedDatasets} ชุดข้อมูล)
                  </p>
                </div>
              </div>

              {/* Mobile quick actions */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  title="พิมพ์รายงานผู้บริหาร A4"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDark((d) => !d)}
                  title="สลับโหมดสี"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Navigation Pills + Desktop Actions */}
            <div className="flex items-center justify-between gap-3">
              <nav
                aria-label="มิติการวิเคราะห์ข้อมูล"
                className="flex flex-1 items-center gap-1 overflow-x-auto pb-1 lg:flex-initial lg:pb-0"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="xl:hidden">{item.shortLabel}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800 lg:flex">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                >
                  <Printer className="h-3.5 w-3.5" />
                  พิมพ์สรุป A4
                </button>
                <button
                  type="button"
                  onClick={() => setIsDark((d) => !d)}
                  aria-label="สลับโหมดสี"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
          {activeTab === 'executive' && <ExecutiveSummaryView onNavigate={handleNavigate} />}
          {activeTab === 'workload' && <WorkloadAndRightsView />}
          {activeTab === 'appointments' && <AppointmentAnalyticsView />}
          {activeTab === 'morbidity' && <MorbidityAndDispositionView />}
          {activeTab === 'ncd' && <NcdAndPreventionView />}
          {activeTab === 'procedures' && <ProcedureAndTelemedView />}
        </main>

        {/* Clean Medical Footer (Information Hiding Compliant) */}
        <footer className="mt-8 border-t border-slate-200 bg-white/70 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
            ระบบสารสนเทศเพื่อการบริหารจัดการและยกระดับคุณภาพบริการ • {DATA_METADATA.department}{' '}
            {DATA_METADATA.hospital}
          </div>
        </footer>
      </div>

      {/* Isolated A4 Print Report Portal */}
      <ExecutivePrintReport />
    </>
  );
}
