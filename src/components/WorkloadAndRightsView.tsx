import { useMemo, useState } from 'react';
import { CalendarDays, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import { INSURANCE_RIGHTS, MONTHLY_VISITS_2569, YEARLY_VISITS } from '../data/clinicData';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

export function WorkloadAndRightsView() {
  const [selectedInsYear, setSelectedInsYear] = useState<'2566' | '2567' | '2568' | '2569'>('2569');

  const yearlyChartData = useMemo(
    () =>
      YEARLY_VISITS.map((item, idx) => {
        const prev = idx > 0 ? YEARLY_VISITS[idx - 1] : null;
        const yoyVisit = prev ? ((item.visits - prev.visits) / prev.visits) * 100 : 0;
        const ratio = Number((item.visits / item.patients).toFixed(2));
        return {
          ...item,
          yearLabel: `ปี ${item.year}`,
          ratio,
          yoyVisit: Number(yoyVisit.toFixed(1)),
        };
      }),
    [],
  );

  const insuranceChartData = useMemo(
    () =>
      INSURANCE_RIGHTS.map((r) => ({
        yearLabel: `ปี ${r.year}`,
        year: r.year,
        uc: r.uc,
        other: r.other,
        total: r.total,
        ucPct: Number(((r.uc / r.total) * 100).toFixed(2)),
        otherPct: Number(((r.other / r.total) * 100).toFixed(2)),
      })),
    [],
  );

  const selectedIns = useMemo(
    () => INSURANCE_RIGHTS.find((r) => r.year === selectedInsYear) ?? INSURANCE_RIGHTS[3],
    [selectedInsYear],
  );

  const pieData = useMemo(
    () => [
      { name: 'สิทธิหลักประกันสุขภาพ (UC)', value: selectedIns.uc, color: '#059669' },
      { name: 'สิทธิอื่นๆ (ข้าราชการ/ประกันสังคม/จ่ายเอง)', value: selectedIns.other, color: '#0284c7' },
    ],
    [selectedIns],
  );

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="อัตราเติบโตจำนวนครั้ง (4 ปี)"
          value={`+${EXECUTIVE_METRICS.visitGrowth4Y.toFixed(1)}%`}
          subtitle="จาก 11,350 ครั้ง (2566) เป็น 15,452 ครั้ง (2569)"
          trendLabel={`+${formatNum(15452 - 11350)} ครั้ง`}
          trendTone="positive"
          icon={<TrendingUp className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="อัตราเติบโตผู้ป่วยรายคน (4 ปี)"
          value={`+${EXECUTIVE_METRICS.patientGrowth4Y.toFixed(1)}%`}
          subtitle="จาก 3,720 คน (2566) เป็น 4,687 คน (2569)"
          trendLabel={`+${formatNum(4687 - 3720)} คน`}
          trendTone="positive"
          icon={<Users className="h-5 w-5" />}
          accent="teal"
        />
        <KpiCard
          title="วันทำการ &amp; ความหนาแน่นรวม"
          value={`${EXECUTIVE_METRICS.totalWorkingDays2569} วัน`}
          subtitle={`เฉลี่ย ${EXECUTIVE_METRICS.overallAvgPerDay.toFixed(2)} ครั้ง/วันทำการ (ต่ำสุด พ.ย. 48.57 — สูงสุด มิ.ย. 72.91)`}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="amber"
        />
        <KpiCard
          title="การขยายตัวของสิทธิอื่นๆ (Non-UC)"
          value={`+${EXECUTIVE_METRICS.otherGrowth4Y.toFixed(1)}%`}
          subtitle="เติบโตเร็วกว่าสิทธิ UC (+27.2%) ดันสัดส่วนสิทธิอื่นแตะ 26.99%"
          trendLabel="2,478 → 4,170 ครั้ง"
          trendTone="positive"
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="sky"
        />
      </div>

      {/* Dataset 1: 4-Year Trend */}
      <SectionCard
        title="แนวโน้มผู้มารับบริการ 4 ปีงบประมาณ (คน vs ครั้ง และความถี่การมาซ้ำ)"
        description="ชุดข้อมูลที่ 1: จำนวนผู้รับบริการรายคนเทียบกับจำนวนครั้งรวมและค่าเฉลี่ยครั้งต่อคนต่อปี"
        badge="ชุดข้อมูลที่ 1"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[320px] lg:col-span-8">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="yearLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[2.5, 3.6]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  yAxisId="left"
                  dataKey="patients"
                  name="จำนวนผู้ป่วย (คน)"
                  fill="#0ea5e9"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                  unit=" คน"
                />
                <Bar
                  yAxisId="left"
                  dataKey="visits"
                  name="จำนวนรับบริการ (ครั้ง)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                  unit=" ครั้ง"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ratio"
                  name="เฉลี่ยครั้ง/คน/ปี"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#f59e0b' }}
                  unit=" ครั้ง/คน"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:col-span-4">
            <InsightCallout title="ข้อค้นพบเชิงบริหาร (ชุดข้อมูลที่ 1)" tone="emerald">
              ปีงบประมาณ 2569 มีอัตราการเติบโตของ <strong>จำนวนครั้ง (+12.9% YoY)</strong> สูงกว่าอัตราการเติบโตของ{' '}
              <strong>จำนวนคน (+5.0% YoY)</strong> ส่งผลให้ความถี่ในการมารับบริการพุ่งขึ้นจาก{' '}
              <strong>3.07</strong> เป็น <strong>3.30 ครั้ง/คน/ปี</strong> สะท้อนการติดตามโรคเรื้อรังและหัตถการต่อเนื่องที่ถี่ขึ้น
            </InsightCallout>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-3 py-2 font-semibold">ปีงบฯ</th>
                    <th className="px-3 py-2 text-right font-semibold">คน</th>
                    <th className="px-3 py-2 text-right font-semibold">ครั้ง</th>
                    <th className="px-3 py-2 text-right font-semibold">ครั้ง/คน</th>
                    <th className="px-3 py-2 text-right font-semibold">โต YoY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {yearlyChartData.map((r) => (
                    <tr key={r.year}>
                      <td className="px-3 py-2 font-semibold">{r.year}</td>
                      <td className="px-3 py-2 text-right">{formatNum(r.patients)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatNum(r.visits)}
                      </td>
                      <td className="px-3 py-2 text-right">{r.ratio.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">
                        {r.yoyVisit > 0 ? `+${r.yoyVisit}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 2: Monthly Workload FY 2569 */}
      <SectionCard
        title="ปริมาณผู้รับบริการรายเดือนและภาระงานเฉลี่ยต่อวันทำการ (ปีงบประมาณ 2569)"
        description="ชุดข้อมูลที่ 2: วิเคราะห์ความผันผวนรายเดือน (ต.ค. 2568 – ก.ย. 2569) เทียบกับจำนวนวันทำการ"
        badge="ชุดข้อมูลที่ 2"
      >
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MONTHLY_VISITS_2569} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[35, 85]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="visits"
                name="จำนวนผู้รับบริการ (ครั้ง)"
                radius={[6, 6, 0, 0]}
                barSize={30}
                unit=" ครั้ง"
              >
                {MONTHLY_VISITS_2569.map((entry) => (
                  <Cell
                    key={entry.month}
                    fill={
                      entry.avgPerDay >= 70
                        ? '#e11d48'
                        : entry.avgPerDay >= 62
                          ? '#10b981'
                          : '#38bdf8'
                    }
                  />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgPerDay"
                name="เฉลี่ยผู้ป่วย (คน/วัน)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f59e0b' }}
                unit=" คน/วัน"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Full 12-month data table */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <tr>
                <th className="px-3.5 py-2.5 font-semibold">เดือน</th>
                <th className="px-3.5 py-2.5 font-semibold">รหัสเดือน</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">จำนวนรับบริการ (ครั้ง)</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">วันทำการ (วัน)</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">เฉลี่ย (คน/วัน)</th>
                <th className="px-3.5 py-2.5 font-semibold">ระดับความหนาแน่น</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MONTHLY_VISITS_2569.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2 font-semibold text-slate-900 dark:text-white">
                    {m.monthLabel}
                  </td>
                  <td className="px-3.5 py-2 text-slate-500">{m.month}</td>
                  <td className="px-3.5 py-2 text-right font-semibold">{formatNum(m.visits)}</td>
                  <td className="px-3.5 py-2 text-right">{m.workingDays}</td>
                  <td className="px-3.5 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {m.avgPerDay.toFixed(2)}
                  </td>
                  <td className="px-3.5 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        m.avgPerDay >= 70
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                          : m.avgPerDay >= 60
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                      }`}
                    >
                      {m.avgPerDay >= 70
                        ? 'หนาแน่นสูงมาก (≥70/วัน)'
                        : m.avgPerDay >= 60
                          ? 'ปานกลาง–สูง (60–69/วัน)'
                          : 'ปกติ (<60/วัน)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Dataset 5: Insurance Rights */}
      <SectionCard
        title="โครงสร้างผู้รับบริการจำแนกตามสิทธิการรักษาพยาบาล (UC vs สิทธิอื่นๆ)"
        description="ชุดข้อมูลที่ 5: เปรียบเทียบแนวโน้มสัดส่วนสิทธิหลักประกันสุขภาพแห่งชาติ (UC) และสิทธิอื่นๆ 4 ปี"
        badge="ชุดข้อมูลที่ 5"
        action={
          <div className="flex items-center gap-1.5">
            {(['2566', '2567', '2568', '2569'] as const).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedInsYear(yr)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedInsYear === yr
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                ปี {yr}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[300px] lg:col-span-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insuranceChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="yearLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="uc"
                  stackId="ins"
                  name="สิทธิ UC (บัตรทอง)"
                  fill="#059669"
                  barSize={48}
                  unit=" ครั้ง"
                />
                <Bar
                  dataKey="other"
                  stackId="ins"
                  name="สิทธิอื่นๆ (Other)"
                  fill="#0284c7"
                  radius={[6, 6, 0, 0]}
                  barSize={48}
                  unit=" ครั้ง"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 lg:col-span-5">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2 rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-800">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>สัดส่วนสิทธิ ปีงบฯ {selectedIns.year}</span>
                <span>รวม {formatNum(selectedIns.total)} ครั้ง</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>สิทธิหลักประกันสุขภาพ (UC)</span>
                <span className="font-semibold">
                  {formatNum(selectedIns.uc)} ({formatPct((selectedIns.uc / selectedIns.total) * 100)})
                </span>
              </div>
              <div className="flex justify-between text-sky-700 dark:text-sky-400">
                <span>สิทธิอื่นๆ (Other)</span>
                <span className="font-semibold">
                  {formatNum(selectedIns.other)} ({formatPct((selectedIns.other / selectedIns.total) * 100)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
