import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarX2,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import {
  CLINIC_CODES,
  DATA_METADATA,
  INSURANCE_RIGHTS,
  MONTHLY_VISITS_2569,
  YEARLY_NOSHOW,
  YEARLY_VISITS,
} from '../data/clinicData';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

export type DashboardTab =
  | 'executive'
  | 'workload'
  | 'appointments'
  | 'morbidity'
  | 'ncd'
  | 'procedures';

interface ExecutiveSummaryViewProps {
  onNavigate: (tab: DashboardTab) => void;
}

const CLINIC_CATEGORY_FILTERS = [
  { id: 'all', label: 'ทั้งหมด (11 รหัส)' },
  { id: 'core', label: 'บริการหลัก (3)' },
  { id: 'geriatric', label: 'ผู้สูงอายุ (3)' },
  { id: 'specialty', label: 'เฉพาะทาง/ประคับประคอง (2)' },
  { id: 'telemed', label: 'การแพทย์ทางไกล (3)' },
] as const;

export function ExecutiveSummaryView({ onNavigate }: ExecutiveSummaryViewProps) {
  const [clinicFilter, setClinicFilter] = useState<'all' | 'core' | 'geriatric' | 'specialty' | 'telemed'>('all');

  const filteredClinics =
    clinicFilter === 'all'
      ? CLINIC_CODES
      : CLINIC_CODES.filter((c) => c.category === clinicFilter);

  const fourYearSummaryRows = YEARLY_VISITS.map((v, i) => {
    const ns = YEARLY_NOSHOW[i];
    const ins = INSURANCE_RIGHTS[i];
    const visitsPerPatient = v.visits / v.patients;
    const ucPct = (ins.uc / ins.total) * 100;
    return {
      year: v.year,
      patients: v.patients,
      visits: v.visits,
      visitsPerPatient,
      appointments: ns.appointments,
      noShows: ns.noShows,
      noShowRate: ns.rate,
      uc: ins.uc,
      other: ins.other,
      ucPct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-xl dark:border-emerald-800/50 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              บทสรุปผู้บริหาร &amp; การวิเคราะห์เชิงกลยุทธ์ • {DATA_METADATA.hospital}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              รายงานผลการดำเนินงาน {DATA_METADATA.department}
            </h1>
            <p className="text-sm leading-relaxed text-emerald-100/90 sm:text-base">
              สังเคราะห์ข้อมูลบริการผู้ป่วยนอกครบวงจรครอบคลุม <strong className="text-white">11 รหัสคลินิก</strong>{' '}
              และ <strong className="text-white">14 ชุดข้อมูลเชิงลึก</strong> ปีงบประมาณ 2566–2569{' '}
              แสดงการขยายตัวของบริการแบบก้าวกระโดด (+{EXECUTIVE_METRICS.visitGrowth4Y.toFixed(1)}% ใน 4 ปี)
              ควบคู่กับการปรับเปลี่ยนสู่ระบบส่งยาทางไกลและคลินิกเฉพาะทาง
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-emerald-100/85">
              <span className="rounded-lg bg-white/10 px-2.5 py-1">
                รอบรายงาน: ปีงบฯ {DATA_METADATA.fiscalYear} ({DATA_METADATA.headerCutoffLabel})
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1">
                ความหนาแน่นเฉลี่ย {EXECUTIVE_METRICS.overallAvgPerDay.toFixed(1)} ครั้ง/วันทำการ
              </span>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-3 sm:w-80">
            <button
              type="button"
              onClick={() => onNavigate('workload')}
              className="flex flex-col items-start justify-between rounded-2xl bg-white/10 p-3.5 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="text-[11px] text-emerald-200">ปริมาณงานปี 69</span>
              <span className="mt-1 text-xl font-bold">{formatNum(EXECUTIVE_METRICS.v2569.visits)}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-300">
                ดูแนวโน้ม 4 ปี <ArrowRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="flex flex-col items-start justify-between rounded-2xl bg-white/10 p-3.5 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="text-[11px] text-amber-200">อัตราขาดนัดปี 69</span>
              <span className="mt-1 text-xl font-bold">{formatPct(EXECUTIVE_METRICS.ns2569.rate)}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-300">
                เจาะลึกรายเดือน <ArrowRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('morbidity')}
              className="flex flex-col items-start justify-between rounded-2xl bg-white/10 p-3.5 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="text-[11px] text-sky-200">รหัสโรคทั้งหมด</span>
              <span className="mt-1 text-xl font-bold">672 โรค</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-300">
                ค้นหา ICD-10 <ArrowRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('procedures')}
              className="flex flex-col items-start justify-between rounded-2xl bg-white/10 p-3.5 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20"
            >
              <span className="text-[11px] text-teal-200">Telemedicine</span>
              <span className="mt-1 text-xl font-bold">{formatNum(EXECUTIVE_METRICS.totalTelemedClinic)} ครั้ง</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-teal-300">
                ห้องหัตถการ &amp; Tele <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Executive KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="ผู้มารับบริการรวม ปีงบฯ 2569"
          value={`${formatNum(EXECUTIVE_METRICS.v2569.visits)} ครั้ง`}
          subtitle={`ผู้ป่วย ${formatNum(EXECUTIVE_METRICS.v2569.patients)} คน (เฉลี่ย ${(
            EXECUTIVE_METRICS.v2569.visits / EXECUTIVE_METRICS.v2569.patients
          ).toFixed(2)} ครั้ง/คน/ปี)`}
          trendLabel={`+${EXECUTIVE_METRICS.visitGrowthYoY.toFixed(1)}% YoY`}
          trendTone="positive"
          icon={<Users className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="ภาระงานเฉลี่ยต่อวันทำการ (ปี 2569)"
          value={`${EXECUTIVE_METRICS.overallAvgPerDay.toFixed(1)} ครั้ง/วัน`}
          subtitle={`สูงสุด ${EXECUTIVE_METRICS.peakMonthVisit.monthLabel} (${EXECUTIVE_METRICS.peakMonthVisit.avgPerDay.toFixed(
            1,
          )} ครั้ง/วัน • ${formatNum(EXECUTIVE_METRICS.peakMonthVisit.visits)} ครั้ง)`}
          trendLabel="250 วันทำการ/ปี"
          trendTone="neutral"
          icon={<Activity className="h-5 w-5" />}
          accent="teal"
        />
        <KpiCard
          title="การบริหารนัดหมาย &amp; อัตราขาดนัด"
          value={formatPct(EXECUTIVE_METRICS.ns2569.rate)}
          subtitle={`ขาดนัด ${formatNum(EXECUTIVE_METRICS.ns2569.noShows)} จาก ${formatNum(
            EXECUTIVE_METRICS.ns2569.appointments,
          )} นัด (สูงสุด ก.ค. 69: ${formatPct(EXECUTIVE_METRICS.peakNoShowMonth.rate)})`}
          trendLabel={`${EXECUTIVE_METRICS.noShowDiffYoY.toFixed(2)} pp จากปี 68`}
          trendTone="positive"
          icon={<CalendarX2 className="h-5 w-5" />}
          accent="amber"
        />
        <KpiCard
          title="สัดส่วนสิทธิหลักประกันสุขภาพ (UC)"
          value={formatPct(EXECUTIVE_METRICS.ucShare2569)}
          subtitle={`UC ${formatNum(INSURANCE_RIGHTS[3].uc)} ครั้ง • สิทธิอื่นๆ ${formatNum(
            INSURANCE_RIGHTS[3].other,
          )} ครั้ง (โต +${EXECUTIVE_METRICS.otherGrowth4Y.toFixed(1)}% ใน 4 ปี)`}
          trendLabel={`สิทธิอื่น ${formatPct(EXECUTIVE_METRICS.otherShare2569)}`}
          trendTone="neutral"
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="sky"
        />
        <KpiCard
          title="บริการลดความแออัด &amp; Telemedicine"
          value={`${formatNum(EXECUTIVE_METRICS.decongestionTotal)} ครั้ง`}
          subtitle={`Telemed คลินิกเฉพาะทาง ${formatNum(
            EXECUTIVE_METRICS.totalTelemedClinic,
          )} ครั้ง • ส่งยา EMS/ไปรษณีย์/ญาติรับแทน ${formatNum(
            EXECUTIVE_METRICS.emsTotal + EXECUTIVE_METRICS.proxyMailDrugTotal,
          )} ครั้ง`}
          trendLabel="Smart OPD Flow"
          trendTone="positive"
          icon={<Video className="h-5 w-5" />}
          accent="indigo"
        />
        <KpiCard
          title="โรคเรื้อรัง DM/HT &amp; การคัดกรองเท้า"
          value={formatPct(EXECUTIVE_METRICS.foot2569.rate)}
          subtitle={`ตรวจเท้าเบาหวาน ${formatNum(EXECUTIVE_METRICS.foot2569.result)}/${formatNum(
            EXECUTIVE_METRICS.foot2569.target,
          )} ราย • จอประสาทตา ${formatPct(EXECUTIVE_METRICS.retina2569.rate)}`}
          trendLabel="ตรวจเท้าโตเกือบ 3 เท่าใน 2 ปี"
          trendTone="positive"
          icon={<HeartPulse className="h-5 w-5" />}
          accent="rose"
        />
      </div>

      {/* Executive Strategic Analysis + Monthly Pulse */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <SectionCard
          title="บทวิเคราะห์เชิงลึกและข้อเสนอแนะสำหรับผู้บริหาร"
          description="สรุปประเด็นสำคัญจากการเชื่อมโยงข้อมูลทั้ง 14 ชุดเพื่อประกอบการตัดสินใจระดับนโยบาย"
          badge="Executive Intelligence"
          className="xl:col-span-7"
        >
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <InsightCallout title="1. อุปสงค์บริการโตต่อเนื่อง (+36.1% ใน 4 ปี)" tone="emerald">
              จำนวนครั้งรับบริการเพิ่มจาก 11,350 ครั้ง (ปี 66) เป็น 15,452 ครั้ง (ปี 69)
              โดยความถี่การมาซ้ำเฉลี่ยต่อคนเพิ่มจาก 3.05 เป็น 3.30 ครั้ง/ปี และสิทธิอื่น (ข้าราชการ/ประกันสังคม/จ่ายเอง)
              โตถึง +68.3% สะท้อนความเชื่อมั่นและภาระงานที่เพิ่มขึ้นของคลินิกเวชศาสตร์ครอบครัว
            </InsightCallout>

            <InsightCallout title="2. วิกฤตขาดนัดกระจุกตัวเดือน ก.ค. (38.02%)" tone="rose">
              แม้ภาพรวมอัตราขาดนัดปี 69 (25.96%) จะลดลงจากปี 68 (28.07%) แต่อัตราขาดนัดพุ่งสูงผิดปกติในเดือน
              กรกฎาคม 2569 ถึง 38.02% (395 จาก 1,039 นัด) ผู้บริหารควรตรวจสอบสาเหตุวันหยุดยาว/ฤดูฝนและเพิ่มระบบเตือนนัดล่วงหน้า
            </InsightCallout>

            <InsightCallout title="3. โรคเรื้อรัง 3 กลุ่มหลักครองสัดส่วนกว่า 63%" tone="sky">
              จาก 672 รหัสโรค ({formatNum(EXECUTIVE_METRICS.totalIcdMainVisits)} รายการ) พบ I10 ความดันโลหิตสูง (4,993 ครั้ง),
              เบาหวาน E149+E119 (2,337 ครั้ง) และไขมันในเลือด E789+E785 (1,572 ครั้ง) คิดเป็น{' '}
              {EXECUTIVE_METRICS.top3NcdGroupPct.toFixed(1)}% โดยผู้ป่วยเบาหวานถึง {EXECUTIVE_METRICS.dmWithHtPct.toFixed(1)}%
              มีโรคความดันโลหิตสูงร่วมด้วย (DM_HT)
            </InsightCallout>

            <InsightCallout title="4. คุณภาพเวชระเบียน &amp; รหัสจำหน่ายไม่สมบูรณ์" tone="amber">
              พบการลงจำหน่าย "ไม่มี CloseVisit Type" ในคลินิกหลัก {formatNum(EXECUTIVE_METRICS.noCloseVisitMain)} ครั้ง
              และในห้องหัตถการ 14081 สูงถึง {formatNum(EXECUTIVE_METRICS.noClose14081_2569)} ครั้ง (
              {formatPct((EXECUTIVE_METRICS.noClose14081_2569 / EXECUTIVE_METRICS.total14081Visits2569) * 100, 1)} ของยอดปี 69)
              รวมถึงรหัสหัตถการที่ไม่มีคำอธิบายในระบบ 112 ครั้ง ควรจัดอบรมการปิดสิทธิ/ลงรหัสเพื่อลดการตกหล่นในการเบิกจ่าย
            </InsightCallout>
          </div>

          {/* Action Plan Table */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                <tr>
                  <th className="px-3.5 py-2.5 font-semibold">ประเด็นยุทธศาสตร์</th>
                  <th className="px-3.5 py-2.5 font-semibold">มาตรการที่แนะนำ</th>
                  <th className="px-3.5 py-2.5 font-semibold">ตัวชี้วัดเป้าหมาย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                    ลดความแออัดช่วง Peak (พ.ค.–มิ.ย., ก.ย.)
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                    ขยายบริการส่งยา Dowell EMS (เคยรองรับได้ถึง 155 ครั้ง/เดือนใน พ.ค.) และผูกยอด Telemed NCD (14192)
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">
                    สัดส่วนรับยาทางไกล &ge; 12%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                    ควบคุมอัตราการขาดนัด
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                    ใช้ระบบ SMS/Line แจ้งเตือนก่อนนัด 3 วัน โดยเฉพาะเดือน มิ.ย.–ก.ค. และเชื่อม อสม./ทีมเยี่ยมบ้าน
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-amber-700 dark:text-amber-400">
                    ลด No-Show เหลือ &lt; 20%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                    ปิดช่องว่างคัดกรองเบาหวาน
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                    เร่งรัดคัดกรองจอประสาทตา (49.8%) ตรวจฟัน (29.0%) และ Yearly Check Up (26.5%) แบบ One-Stop Service
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-sky-700 dark:text-sky-400">
                    คัดกรองตา/เท้า/แล็บ &ge; 80%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                    ธรรมาภิบาลข้อมูล (Data Quality)
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">
                    ตั้งค่าบังคับเลือก CloseVisit Type ก่อนปิด Visit ห้อง 1408/14081 และจับคู่ชื่อรหัส 1622896, HW0001
                  </td>
                  <td className="px-3.5 py-2.5 font-semibold text-rose-700 dark:text-rose-400">
                    Missing CloseVisit &lt; 1%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Monthly Pulse Mini Chart + 4Y Summary */}
        <SectionCard
          title="ชีพจรภาระงานรายเดือน ปีงบฯ 2569"
          description="เปรียบเทียบจำนวนครั้งรับบริการรายเดือนกับความหนาแน่นต่อวันทำการ"
          badge="ต.ค. 68 – ก.ย. 69"
          className="xl:col-span-5"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_VISITS_2569} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="execVisitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="จำนวนครั้งรับบริการ"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fill="url(#execVisitGrad)"
                  unit=" ครั้ง"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-950/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" /> เดือนที่หนาแน่นสูงสุด
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {EXECUTIVE_METRICS.peakMonthVisit.monthLabel}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {formatNum(EXECUTIVE_METRICS.peakMonthVisit.visits)} ครั้ง (เฉลี่ย{' '}
                {EXECUTIVE_METRICS.peakMonthVisit.avgPerDay.toFixed(1)}/วัน)
              </p>
            </div>
            <div className="rounded-xl bg-amber-50/70 p-3 dark:bg-amber-950/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" /> เดือนที่ขาดนัดสูงสุด
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {EXECUTIVE_METRICS.peakNoShowMonth.monthLabel}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {formatPct(EXECUTIVE_METRICS.peakNoShowMonth.rate)} ({formatNum(EXECUTIVE_METRICS.peakNoShowMonth.noShows)} ครั้ง)
              </p>
            </div>
          </div>

          {/* Mini highlight list */}
          <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ยอดหัตถการและคัดกรอง (ห้อง 14081)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatNum(EXECUTIVE_METRICS.total14081Procedures)} กิจกรรม
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                วัคซีนไข้หวัดใหญ่ปี 2569 (14081)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatNum(EXECUTIVE_METRICS.totalFlu2569)} ราย
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ความครอบคลุม Telemed เรือนจำหญิง (1419)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatNum(EXECUTIVE_METRICS.prisonTelemed)} ครั้ง (95.9%)
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* 4-Year Executive Comparison Table */}
      <SectionCard
        title="ตารางเปรียบเทียบตัวชี้วัดหลักย้อนหลัง 4 ปีงบประมาณ (2566–2569)"
        description="รวมข้อมูลปริมาณผู้รับบริการ อัตราการมาซ้ำ สถิติการนัดหมาย และสัดส่วนสิทธิการรักษา"
        badge="ชุดข้อมูลที่ 1, 3, 5"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <th className="px-4 py-3 font-semibold">ปีงบประมาณ</th>
                <th className="px-4 py-3 text-right font-semibold">ผู้ป่วย (คน)</th>
                <th className="px-4 py-3 text-right font-semibold">รับบริการ (ครั้ง)</th>
                <th className="px-4 py-3 text-right font-semibold">ครั้ง/คน/ปี</th>
                <th className="px-4 py-3 text-right font-semibold">จำนวนนัด (ครั้ง)</th>
                <th className="px-4 py-3 text-right font-semibold">ขาดนัด (ครั้ง)</th>
                <th className="px-4 py-3 text-right font-semibold">ร้อยละขาดนัด</th>
                <th className="px-4 py-3 text-right font-semibold">สิทธิ UC</th>
                <th className="px-4 py-3 text-right font-semibold">สิทธิอื่นๆ</th>
                <th className="px-4 py-3 text-right font-semibold">สัดส่วน UC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fourYearSummaryRows.map((row) => (
                <tr
                  key={row.year}
                  className={`transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 ${
                    row.year === '2569' ? 'bg-emerald-50/30 font-medium dark:bg-emerald-950/15' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    ปี {row.year}
                    {row.year === '2569' && (
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                        ล่าสุด
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatNum(row.patients)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatNum(row.visits)}
                  </td>
                  <td className="px-4 py-3 text-right">{row.visitsPerPatient.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{formatNum(row.appointments)}</td>
                  <td className="px-4 py-3 text-right text-amber-700 dark:text-amber-400">
                    {formatNum(row.noShows)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.noShowRate >= 27
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}
                    >
                      {formatPct(row.noShowRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{formatNum(row.uc)}</td>
                  <td className="px-4 py-3 text-right">{formatNum(row.other)}</td>
                  <td className="px-4 py-3 text-right">{formatPct(row.ucPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 11 Clinic Codes Network */}
      <SectionCard
        title="โครงสร้างเครือข่ายรหัสคลินิกงานเวชปฏิบัติครอบครัวและชุมชน (11 รหัส)"
        description="ขอบเขตหน่วยบริการที่เชื่อมโยงข้อมูลภายใต้กลุ่มงานเวชกรรมสังคมและเวชศาสตร์ครอบครัว"
        badge="11 รหัสคลินิก"
        action={
          <div className="flex flex-wrap gap-1.5">
            {CLINIC_CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setClinicFilter(f.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  clinicFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {filteredClinics.map((clinic) => {
            const badgeColor =
              clinic.category === 'core'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                : clinic.category === 'geriatric'
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                  : clinic.category === 'specialty'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300';

            return (
              <div
                key={clinic.code}
                className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition hover:border-emerald-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-emerald-700 dark:hover:bg-slate-800/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-emerald-600">
                      <Building2 className="h-3.5 w-3.5" />
                      รหัส {clinic.code}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}>
                      {clinic.categoryLabel}
                    </span>
                  </div>
                  <h3 className="mt-2.5 flex items-start gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{clinic.name}</span>
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {clinic.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
