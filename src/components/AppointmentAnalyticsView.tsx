import { useMemo, useState } from 'react';
import { AlertCircle, CalendarCheck2, CalendarX2, SlidersHorizontal } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import { MONTHLY_NOSHOW_2569, YEARLY_NOSHOW } from '../data/clinicData';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

export function AppointmentAnalyticsView() {
  const [targetRate, setTargetRate] = useState<number>(20);

  const yearlyChartData = useMemo(
    () =>
      YEARLY_NOSHOW.map((r) => ({
        yearLabel: `ปี ${r.year}`,
        year: r.year,
        attended: r.appointments - r.noShows,
        noShows: r.noShows,
        appointments: r.appointments,
        rate: Number(r.rate.toFixed(2)),
      })),
    [],
  );

  const monthlyChartData = useMemo(
    () =>
      MONTHLY_NOSHOW_2569.map((r) => ({
        ...r,
        attended: r.appointments - r.noShows,
      })),
    [],
  );

  const simulationResult = useMemo(() => {
    const current = EXECUTIVE_METRICS.ns2569;
    const projectedNoShow = Math.round((current.appointments * targetRate) / 100);
    const recoveredVisits = Math.max(0, current.noShows - projectedNoShow);
    return {
      currentNoShow: current.noShows,
      projectedNoShow,
      recoveredVisits,
    };
  }, [targetRate]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="จำนวนนัดหมายทั้งหมด ปี 2569"
          value={`${formatNum(EXECUTIVE_METRICS.ns2569.appointments)} ครั้ง`}
          subtitle="ขยายตัว +38.5% เทียบกับปี 2566 (9,245 นัด)"
          trendLabel="+16.7% YoY"
          trendTone="positive"
          icon={<CalendarCheck2 className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="จำนวนขาดนัดรวม ปี 2569"
          value={`${formatNum(EXECUTIVE_METRICS.ns2569.noShows)} ครั้ง`}
          subtitle={`คิดเป็นร้อยละ ${formatPct(EXECUTIVE_METRICS.ns2569.rate)} ของนัดหมายทั้งหมด`}
          trendLabel="ลดลง 2.11 pp จากปี 68"
          trendTone="positive"
          icon={<CalendarX2 className="h-5 w-5" />}
          accent="amber"
        />
        <KpiCard
          title="เดือนที่ขาดนัดสูงสุด (จุดวิกฤต)"
          value={formatPct(EXECUTIVE_METRICS.peakNoShowMonth.rate)}
          subtitle={`${EXECUTIVE_METRICS.peakNoShowMonth.monthLabel}: ขาดนัด ${formatNum(
            EXECUTIVE_METRICS.peakNoShowMonth.noShows,
          )} จาก ${formatNum(EXECUTIVE_METRICS.peakNoShowMonth.appointments)} นัด`}
          trendLabel="สูงกว่าค่าเฉลี่ย +12.1 pp"
          trendTone="negative"
          icon={<AlertCircle className="h-5 w-5" />}
          accent="rose"
        />
        <KpiCard
          title="เดือนที่คุมการมาตามนัดดีที่สุด"
          value={formatPct(EXECUTIVE_METRICS.bestNoShowMonth.rate)}
          subtitle={`${EXECUTIVE_METRICS.bestNoShowMonth.monthLabel}: มาตามนัดถึง ${(
            100 - EXECUTIVE_METRICS.bestNoShowMonth.rate
          ).toFixed(2)}%`}
          trendLabel="เม.ย. 69 รองลงมา (20.71%)"
          trendTone="positive"
          icon={<CalendarCheck2 className="h-5 w-5" />}
          accent="teal"
        />
      </div>

      {/* Dataset 3: Yearly No-Show */}
      <SectionCard
        title="แนวโน้มการมาตามนัดและอัตราการขาดนัด 4 ปีงบประมาณ (2566–2569)"
        description="ชุดข้อมูลที่ 3: เปรียบเทียบปริมาณนัดหมายรวม ผู้มาตามนัด ผู้ขาดนัด และเส้นร้อยละการขาดนัด"
        badge="ชุดข้อมูลที่ 3"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[310px] lg:col-span-7">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="yearLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" domain={[15, 35]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  yAxisId="left"
                  stackId="appt"
                  dataKey="attended"
                  name="มาตามนัด (ครั้ง)"
                  fill="#10b981"
                  barSize={44}
                  unit=" ครั้ง"
                />
                <Bar
                  yAxisId="left"
                  stackId="appt"
                  dataKey="noShows"
                  name="ขาดนัด (ครั้ง)"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  barSize={44}
                  unit=" ครั้ง"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rate"
                  name="ร้อยละการขาดนัด (%)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#f59e0b' }}
                  unit="%"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <InsightCallout title="การจำลองเป้าหมายลดอัตราขาดนัด (Executive Simulator)" tone="sky">
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    กำหนดเป้าหมายอัตราขาดนัดใหม่:
                  </span>
                  <span className="rounded-md bg-sky-600 px-2 py-0.5 text-white">{targetRate}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={25}
                  step={1}
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="rounded-lg bg-white/80 p-2.5 dark:bg-slate-900/60">
                    <span className="text-slate-500 dark:text-slate-400">จำนวนขาดนัดเป้าหมาย</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {formatNum(simulationResult.projectedNoShow)} ครั้ง
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-100/80 p-2.5 dark:bg-emerald-900/40">
                    <span className="text-emerald-800 dark:text-emerald-300">ดึงผู้ป่วยกลับมาดูแลได้</span>
                    <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                      +{formatNum(simulationResult.recoveredVisits)} ครั้ง/ปี
                    </p>
                  </div>
                </div>
              </div>
            </InsightCallout>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-3 py-2 font-semibold">ปีงบฯ</th>
                    <th className="px-3 py-2 text-right font-semibold">นัดทั้งหมด</th>
                    <th className="px-3 py-2 text-right font-semibold">ขาดนัด</th>
                    <th className="px-3 py-2 text-right font-semibold">ร้อยละ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {YEARLY_NOSHOW.map((r) => (
                    <tr key={r.year}>
                      <td className="px-3 py-2 font-semibold">{r.year}</td>
                      <td className="px-3 py-2 text-right">{formatNum(r.appointments)}</td>
                      <td className="px-3 py-2 text-right text-rose-600 dark:text-rose-400">
                        {formatNum(r.noShows)}
                      </td>
                      <td className="px-3 py-2 text-right font-bold">{formatPct(r.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 4: Monthly No-Show */}
      <SectionCard
        title="การขาดนัดจำแนกรายเดือน ปีงบประมาณ 2569 (ต.ค. 68 – ก.ย. 69)"
        description="ชุดข้อมูลที่ 4: ตรวจจับความผิดปกติรายเดือนเทียบเส้นเกณฑ์มาตรฐาน 25% และค่าเฉลี่ยทั้งปี"
        badge="ชุดข้อมูลที่ 4"
      >
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
              <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 45]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                yAxisId="right"
                y={25.96}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: 'เฉลี่ยทั้งปี 25.96%', position: 'insideTopRight', fill: '#d97706', fontSize: 11 }}
              />
              <Bar
                yAxisId="left"
                stackId="m"
                dataKey="attended"
                name="มาตามนัด (ครั้ง)"
                fill="#10b981"
                barSize={28}
                unit=" ครั้ง"
              />
              <Bar
                yAxisId="left"
                stackId="m"
                dataKey="noShows"
                name="ขาดนัด (ครั้ง)"
                radius={[5, 5, 0, 0]}
                barSize={28}
                unit=" ครั้ง"
              >
                {monthlyChartData.map((entry) => (
                  <Cell key={entry.month} fill={entry.rate >= 30 ? '#e11d48' : '#fb7185'} />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rate"
                name="อัตราขาดนัด (%)"
                stroke="#be123c"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#be123c' }}
                unit="%"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>หมายเหตุความสอดคล้องของข้อมูล:</strong> ผลรวมรายเดือนในชุดข้อมูลที่ 4 เท่ากับนัด 12,710 ครั้ง / ขาดนัด 3,273 ครั้ง
          (25.75%) ขณะที่ตารางสรุปรายปีในชุดข้อมูลที่ 3 ระบุนัด 12,802 ครั้ง / ขาดนัด 3,324 ครั้ง (25.96%)
          ซึ่งอาจเกิดจากรอบการดึงข้อมูลรายการยกเลิก/เลื่อนนัดปลายงวดต่างกันเล็กน้อย (92 นัด)
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <tr>
                <th className="px-3.5 py-2.5 font-semibold">เดือน</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">จำนวนนัด (ครั้ง)</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">มาตามนัด (ครั้ง)</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">ขาดนัด (ครั้ง)</th>
                <th className="px-3.5 py-2.5 text-right font-semibold">ร้อยละขาดนัด</th>
                <th className="px-3.5 py-2.5 font-semibold">สถานะเฝ้าระวัง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthlyChartData.map((r) => (
                <tr key={r.month} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2 font-semibold text-slate-900 dark:text-white">
                    {r.monthLabel} <span className="font-normal text-slate-400">({r.month})</span>
                  </td>
                  <td className="px-3.5 py-2 text-right">{formatNum(r.appointments)}</td>
                  <td className="px-3.5 py-2 text-right text-emerald-700 dark:text-emerald-400">
                    {formatNum(r.attended)}
                  </td>
                  <td className="px-3.5 py-2 text-right font-semibold text-rose-600 dark:text-rose-400">
                    {formatNum(r.noShows)}
                  </td>
                  <td className="px-3.5 py-2 text-right font-bold">{formatPct(r.rate)}</td>
                  <td className="px-3.5 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        r.rate >= 30
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                          : r.rate >= 25
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`}
                    >
                      {r.rate >= 30 ? 'วิกฤต (≥30%)' : r.rate >= 25 ? 'เฝ้าระวัง (25–29.9%)' : 'เกณฑ์ดี (<25%)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
