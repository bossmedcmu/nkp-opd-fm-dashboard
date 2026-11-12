import { useMemo } from 'react';
import { Eye, Footprints, HeartPulse, ShieldPlus, Syringe } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import {
  DM_HT_MONTHLY_2569,
  DM_SCREENING_RECORDS,
  FLU_VACCINE_YEARLY,
} from '../data/clinicData';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

export function NcdAndPreventionView() {
  const dmHtChartData = useMemo(
    () =>
      DM_HT_MONTHLY_2569.map((r) => ({
        ...r,
        total: r.dm + r.dmHt + r.ht,
      })),
    [],
  );

  const screeningGrouped = useMemo(() => {
    const groups = ['Yearly Check Up', 'คัดกรองจอประสาทตา', 'ตรวจฟัน', 'ตรวจเท้า'] as const;
    return groups.map((g) => {
      const y67 = DM_SCREENING_RECORDS.find((r) => r.group === g && r.year === '2567');
      const y68 = DM_SCREENING_RECORDS.find((r) => r.group === g && r.year === '2568');
      const y69 = DM_SCREENING_RECORDS.find((r) => r.group === g && r.year === '2569');
      return {
        group: g,
        r2567: y67?.rate ?? 0,
        r2568: y68?.rate ?? 0,
        r2569: y69?.rate ?? 0,
        res2569: y69?.result ?? 0,
        tar2569: y69?.target ?? 0,
      };
    });
  }, []);

  const fluChartData = useMemo(
    () =>
      FLU_VACCINE_YEARLY.map((r) => ({
        yearLabel: `ปี ${r.year}`,
        ...r,
        total: r.general + r.cgd + r.sss,
      })),
    [],
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="ผู้รับบริการคลินิก DM / HT รวม (ปี 69)"
          value={`${formatNum(
            EXECUTIVE_METRICS.totalDmOnly +
              EXECUTIVE_METRICS.totalDmHt +
              EXECUTIVE_METRICS.totalHtOnly,
          )} ครั้ง`}
          subtitle={`HT อย่างเดียว ${formatNum(EXECUTIVE_METRICS.totalHtOnly)} • DM+HT ${formatNum(
            EXECUTIVE_METRICS.totalDmHt,
          )} • DM อย่างเดียว ${formatNum(EXECUTIVE_METRICS.totalDmOnly)}`}
          trendLabel={`DM มี HT ร่วม ${EXECUTIVE_METRICS.dmWithHtPct.toFixed(1)}%`}
          trendTone="neutral"
          icon={<HeartPulse className="h-5 w-5" />}
          accent="rose"
        />
        <KpiCard
          title="อัตราตรวจเท้าเบาหวาน (ปี 2569)"
          value={formatPct(EXECUTIVE_METRICS.foot2569.rate)}
          subtitle={`${formatNum(EXECUTIVE_METRICS.foot2569.result)} จากเป้าหมาย ${formatNum(
            EXECUTIVE_METRICS.foot2569.target,
          )} ราย`}
          trendLabel="เพิ่มจาก 22.33% (ปี 67)"
          trendTone="positive"
          icon={<Footprints className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="คัดกรองจอประสาทตาเบาหวาน (ปี 2569)"
          value={formatPct(EXECUTIVE_METRICS.retina2569.rate)}
          subtitle={`${formatNum(EXECUTIVE_METRICS.retina2569.result)} จาก ${formatNum(
            EXECUTIVE_METRICS.retina2569.target,
          )} ราย • ตรวจฟัน ${formatPct(EXECUTIVE_METRICS.dental2569.rate)}`}
          trendLabel="เร่งปิด Gap เป้าหมาย"
          trendTone="warning"
          icon={<Eye className="h-5 w-5" />}
          accent="amber"
        />
        <KpiCard
          title="ฉีดวัคซีนไข้หวัดใหญ่ ปี 2569"
          value={`${formatNum(EXECUTIVE_METRICS.totalFlu2569)} ราย`}
          subtitle="สิทธิทั่วไป 598 ราย • ประกันสังคม 4 ราย (เทียบกับ 554 รายในปี 2568)"
          trendLabel="+8.7% YoY"
          trendTone="positive"
          icon={<Syringe className="h-5 w-5" />}
          accent="sky"
        />
      </div>

      {/* Dataset 17: DM / DM_HT / HT Monthly */}
      <SectionCard
        title="ปริมาณผู้รับบริการโรคเบาหวานและความดันโลหิตสูง จำแนกรายเดือน (ปีงบประมาณ 2569)"
        description="ชุดข้อมูลที่ 17: เปรียบเทียบผู้ป่วย HT อย่างเดียว, ผู้ป่วยโรคร่วม DM+HT และ DM อย่างเดียว"
        badge="ชุดข้อมูลที่ 17"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[320px] lg:col-span-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dmHtChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="ht" stackId="ncd" name="ความดันโลหิตสูง (HT)" fill="#0284c7" />
                <Bar dataKey="dmHt" stackId="ncd" name="เบาหวาน + ความดัน (DM_HT)" fill="#10b981" />
                <Bar
                  dataKey="dm"
                  stackId="ncd"
                  name="เบาหวานอย่างเดียว (DM)"
                  fill="#f59e0b"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:col-span-4">
            <InsightCallout title="ภาระงานโรคร่วม DM + HT (Multi-morbidity)" tone="emerald">
              ตลอดปีงบประมาณ 2569 มีการดูแลกลุ่มความดันโลหิตสูงรวมทั้งสิ้น{' '}
              <strong>{formatNum(EXECUTIVE_METRICS.totalHtOnly + EXECUTIVE_METRICS.totalDmHt)} ครั้ง</strong>{' '}
              และในกลุ่มผู้ป่วยเบาหวาน ({formatNum(EXECUTIVE_METRICS.totalDmOnly + EXECUTIVE_METRICS.totalDmHt)} ครั้ง)
              พบภาวะความดันโลหิตสูงร่วมด้วยสูงถึง <strong>{EXECUTIVE_METRICS.dmWithHtPct.toFixed(1)}%</strong>{' '}
              (เดือน มิ.ย. 69 สูงสุดรวม 1,079 ครั้ง)
            </InsightCallout>

            <div className="max-h-[200px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 font-semibold">เดือน</th>
                    <th className="px-2.5 py-2 text-right font-semibold">DM</th>
                    <th className="px-2.5 py-2 text-right font-semibold">DM_HT</th>
                    <th className="px-2.5 py-2 text-right font-semibold">HT</th>
                    <th className="px-2.5 py-2 text-right font-semibold">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dmHtChartData.map((r) => (
                    <tr key={r.month}>
                      <td className="px-3 py-1.5 font-medium">{r.monthLabel}</td>
                      <td className="px-2.5 py-1.5 text-right">{formatNum(r.dm)}</td>
                      <td className="px-2.5 py-1.5 text-right text-emerald-700 dark:text-emerald-400">
                        {formatNum(r.dmHt)}
                      </td>
                      <td className="px-2.5 py-1.5 text-right text-sky-700 dark:text-sky-400">
                        {formatNum(r.ht)}
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-bold">{formatNum(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 18 & 15 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Dataset 18: DM Screening */}
        <SectionCard
          title="ความครอบคลุมการตรวจคัดกรองภาวะแทรกซ้อนผู้ป่วยเบาหวาน 3 ปีงบฯ (2567–2569)"
          description="ชุดข้อมูลที่ 18: Yearly Check Up, คัดกรองจอประสาทตา, ตรวจฟัน และตรวจเท้า เทียบกลุ่มเป้าหมาย"
          badge="ชุดข้อมูลที่ 18"
          className="xl:col-span-7"
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screeningGrouped} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="r2567" name="ปี 2567 (เป้า 860)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="r2568" name="ปี 2568 (เป้า 932)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="r2569" name="ปี 2569 (เป้า 945)" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[540px] text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70">
                <tr>
                  <th className="px-3 py-2 font-semibold">กิจกรรมการคัดกรอง</th>
                  <th className="px-3 py-2 text-right font-semibold">ปี 2567</th>
                  <th className="px-3 py-2 text-right font-semibold">ปี 2568</th>
                  <th className="px-3 py-2 text-right font-semibold">ปี 2569 (ผลงาน/เป้า)</th>
                  <th className="px-3 py-2 text-right font-semibold">ร้อยละปี 69</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {screeningGrouped.map((row) => (
                  <tr key={row.group}>
                    <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">
                      {row.group}
                    </td>
                    <td className="px-3 py-2 text-right">{formatPct(row.r2567)}</td>
                    <td className="px-3 py-2 text-right">{formatPct(row.r2568)}</td>
                    <td className="px-3 py-2 text-right">
                      {formatNum(row.res2569)} / {formatNum(row.tar2569)}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {formatPct(row.r2569)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Dataset 15: Flu Vaccine */}
        <SectionCard
          title="บริการฉีดวัคซีนไข้หวัดใหญ่ตามฤดูกาล 4 ปี (รหัส 14081)"
          description="ชุดข้อมูลที่ 15: จำแนกตามกลุ่มสิทธิหลักประกันสุขภาพ กรมบัญชีกลาง และประกันสังคม"
          badge="ชุดข้อมูลที่ 15"
          className="xl:col-span-5"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fluChartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="yearLabel" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ราย" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="ยอดฉีดวัคซีนรวม"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="sss"
                  name="ประกันสังคม"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70">
                <tr>
                  <th className="px-3 py-2 font-semibold">ปีงบฯ</th>
                  <th className="px-2.5 py-2 text-right font-semibold">ทั่วไป/UC</th>
                  <th className="px-2.5 py-2 text-right font-semibold">กรมบัญชีกลาง</th>
                  <th className="px-2.5 py-2 text-right font-semibold">ประกันสังคม</th>
                  <th className="px-2.5 py-2 text-right font-semibold">รวม (ราย)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fluChartData.map((r) => (
                  <tr key={r.year}>
                    <td className="px-3 py-2 font-semibold">{r.year}</td>
                    <td className="px-2.5 py-2 text-right">{formatNum(r.general)}</td>
                    <td className="px-2.5 py-2 text-right">{formatNum(r.cgd)}</td>
                    <td className="px-2.5 py-2 text-right">{formatNum(r.sss)}</td>
                    <td className="px-2.5 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {formatNum(r.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50/70 p-3 text-xs text-sky-900 dark:bg-sky-950/30 dark:text-sky-200">
            <ShieldPlus className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
            <span>
              หมายเหตุ: ปี 2567 มียอดฉีดสูงถึง 834 ราย และรักษาระดับต่อเนื่องที่ 554–602 รายในปี 2568–2569
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
