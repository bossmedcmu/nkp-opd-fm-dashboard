import { useMemo, useState } from 'react';
import { Activity, ClipboardList, Search, Syringe, Video } from 'lucide-react';
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
import { MONTHS_FY2569, ROOM_14081_DISPOSITION, TELEMED_2569 } from '../data/clinicData';
import { PROCEDURES_14081_2569 } from '../data/dispositionAndProceduresData';
import { ICD10_14081_2569 } from '../data/icd10Data';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

export function ProcedureAndTelemedView() {
  const [procQuery, setProcQuery] = useState('');
  const [procCat, setProcCat] = useState('ALL');
  const [dxQuery, setDxQuery] = useState('');

  const telemedChartData = useMemo(
    () =>
      MONTHS_FY2569.map((m, idx) => ({
        monthLabel: m.label,
        prison: TELEMED_2569[0].monthly[idx],
        juvenile: TELEMED_2569[1].monthly[idx],
        elderly: TELEMED_2569[2].monthly[idx],
        total:
          TELEMED_2569[0].monthly[idx] +
          TELEMED_2569[1].monthly[idx] +
          TELEMED_2569[2].monthly[idx],
      })),
    [],
  );

  const procCategories = useMemo(() => {
    const map = new Map<string, { category: string; total: number; codes: number }>();
    for (const r of PROCEDURES_14081_2569) {
      const ex = map.get(r.category) ?? { category: r.category, total: 0, codes: 0 };
      ex.total += r.total;
      ex.codes += 1;
      map.set(r.category, ex);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, []);

  const filteredProcs = useMemo(() => {
    const q = procQuery.trim().toLowerCase();
    return PROCEDURES_14081_2569.filter((r) => {
      if (procCat !== 'ALL' && r.category !== procCat) return false;
      if (!q) return true;
      return r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [procQuery, procCat]);

  const filtered14081Dx = useMemo(() => {
    const q = dxQuery.trim().toLowerCase();
    if (!q) return ICD10_14081_2569;
    return ICD10_14081_2569.filter(
      (r) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
    );
  }, [dxQuery]);

  const top14081DispositionCompare = useMemo(() => {
    return ROOM_14081_DISPOSITION.map((r) => ({
      ...r,
      total4Y: r.y2566 + r.y2567 + r.y2568 + r.y2569,
    })).sort((a, b) => b.y2569 - a.y2569);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="การจำหน่ายห้องหัตถการ 14081 (ปี 69)"
          value={`${formatNum(EXECUTIVE_METRICS.total14081Visits2569)} ครั้ง`}
          subtitle={`ฉีดยาเสร็จ 392 ครั้ง • ทำแผลเสร็จ 163 ครั้ง • ไม่มี CloseVisit ${EXECUTIVE_METRICS.noClose14081_2569} ครั้ง`}
          trendLabel="26 รูปแบบการจำหน่าย"
          trendTone="neutral"
          icon={<Syringe className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="โรคฉุกเฉิน/อุบัติเหตุห้องหัตถการ (14081)"
          value={`${ICD10_14081_2569.length} รหัสโรค`}
          subtitle={`รวม ${formatNum(EXECUTIVE_METRICS.total14081EmergencyDx)} รายการวินิจฉัย (อันดับ 1: I10 23 ครั้ง, CA 16 ครั้ง)`}
          icon={<Activity className="h-5 w-5" />}
          accent="rose"
        />
        <KpiCard
          title="ยอดรวมหัตถการ &amp; SpecialPP (14081)"
          value={`${formatNum(EXECUTIVE_METRICS.total14081Procedures)} กิจกรรม`}
          subtitle={`ครอบคลุม ${PROCEDURES_14081_2569.length} รหัสหัตถการและคัดกรองผู้สูงอายุ`}
          trendLabel="Peak พ.ค. 69 (1,341 รายการ)"
          trendTone="positive"
          icon={<ClipboardList className="h-5 w-5" />}
          accent="amber"
        />
        <KpiCard
          title="บริการ Telemedicine รวม ปี 2569"
          value={`${formatNum(EXECUTIVE_METRICS.totalTelemedClinic)} ครั้ง`}
          subtitle={`เรือนจำหญิง (1419): 657 • คลินิกผู้สูงอายุ (1420): 22 • สถานพินิจ (14191): 6`}
          trendLabel="95.9% ในเรือนจำหญิง"
          trendTone="positive"
          icon={<Video className="h-5 w-5" />}
          accent="indigo"
        />
      </div>

      {/* Dataset 16: Telemedicine */}
      <SectionCard
        title="ผลการดำเนินงาน Telemedicine ปีงบประมาณ 2569 (รหัสคลินิก 1419, 14191, 1420)"
        description="ชุดข้อมูลที่ 16: แนวโน้มรายเดือนการตรวจรักษาทางไกลแยกตามกลุ่มเป้าหมาย พร้อมข้อสังเกตรหัส 14192"
        badge="ชุดข้อมูลที่ 16"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[290px] lg:col-span-7">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemedChartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="prison"
                  name="1419 เรือนจำหญิง"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="elderly"
                  name="1420 คลินิกผู้สูงอายุ"
                  stroke="#0284c7"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="juvenile"
                  name="14191 สถานพินิจ"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 lg:col-span-5">
            <InsightCallout title="ขยายการเข้าถึงบริการเชิงรุก &amp; ความเชื่อมโยงรหัส 14192" tone="sky">
              รหัส <strong>1419 Telemed เรือนจำหญิง</strong> คิดเป็น <strong>95.9%</strong> ของงาน Telemed
              เฉพาะทางทั้งหมด โดยพุ่งสูงสุดในเดือน ก.ย. 2569 ถึง <strong>123 ครั้ง</strong> (และ มิ.ย. 84 ครั้ง)
              ทั้งนี้ในชุดข้อมูลที่ 16 ยังไม่ปรากฏยอดของรหัส <strong>14192 (Telemed NCD FM)</strong>{' '}
              ผู้บริหารควรตรวจสอบการเปิดใช้/จับคู่รหัสห้องตรวจในระบบ HIS เพื่อให้รายงานครบทั้ง 11 รหัส
            </InsightCallout>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-3 py-2 font-semibold">รหัส</th>
                    <th className="px-3 py-2 font-semibold">คลินิก Telemedicine</th>
                    <th className="px-3 py-2 text-right font-semibold">รวม (ครั้ง)</th>
                    <th className="px-3 py-2 text-right font-semibold">สัดส่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TELEMED_2569.map((r) => (
                    <tr key={r.clinicCode}>
                      <td className="px-3 py-2 font-mono font-bold">{r.clinicCode}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                        {formatNum(r.total)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatPct((r.total / EXECUTIVE_METRICS.totalTelemedClinic) * 100, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 12: Room 14081 Disposition 4 years */}
      <SectionCard
        title="การจำหน่ายออกจากห้องหัตถการ (14081) เปรียบเทียบ 4 ปีงบประมาณ (ครบ 26 รูปแบบ)"
        description="ชุดข้อมูลที่ 12: พัฒนาการงานฉีดยา ทำแผล หัตถการ และการส่งต่อห้องฉุกเฉิน ปี 2566–2569"
        badge="ชุดข้อมูลที่ 12 (26 รูปแบบ)"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[300px] lg:col-span-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top14081DispositionCompare.slice(0, 7)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="closeType"
                  width={150}
                  tick={{ fontSize: 10, fill: '#475569' }}
                />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="y2567" name="2567" fill="#94a3b8" />
                <Bar dataKey="y2568" name="2568" fill="#0284c7" />
                <Bar dataKey="y2569" name="2569" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="max-h-[320px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 lg:col-span-7">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-3 py-2 font-semibold">ประเภทการจำหน่าย (14081)</th>
                  <th className="px-2.5 py-2 text-right font-semibold">2566</th>
                  <th className="px-2.5 py-2 text-right font-semibold">2567</th>
                  <th className="px-2.5 py-2 text-right font-semibold">2568</th>
                  <th className="px-2.5 py-2 text-right font-semibold">2569</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {top14081DispositionCompare.map((r) => (
                  <tr
                    key={r.closeType}
                    className={
                      r.closeType.includes('ไม่มี CloseVisit')
                        ? 'bg-amber-50/60 dark:bg-amber-950/20'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                    }
                  >
                    <td className="px-3 py-1.5 font-medium">{r.closeType}</td>
                    <td className="px-2.5 py-1.5 text-right">{r.y2566 || '–'}</td>
                    <td className="px-2.5 py-1.5 text-right">{r.y2567 || '–'}</td>
                    <td className="px-2.5 py-1.5 text-right">{r.y2568 || '–'}</td>
                    <td className="px-2.5 py-1.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {r.y2569 || '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 14: Room 14081 Procedures & SpecialPP (93 items) */}
      <SectionCard
        title="ยอดรวมหัตถการและการคัดกรองส่งเสริมป้องกัน SpecialPP ห้องหัตถการ 14081 (ครบ 93 รายการ)"
        description="ชุดข้อมูลที่ 14: จำแนกรายหมวดหมู่และรายเดือน (ต.ค. 68 – ก.ย. 69)"
        badge="ชุดข้อมูลที่ 14 (93 รหัส)"
      >
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {procCategories.map((c) => (
            <button
              key={c.category}
              type="button"
              onClick={() => setProcCat(procCat === c.category ? 'ALL' : c.category)}
              className={`rounded-xl border p-3 text-left transition ${
                procCat === c.category
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40'
                  : 'border-slate-200 bg-slate-50/60 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{c.category}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatNum(c.total)} ครั้ง
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {c.codes} รหัส ({formatPct((c.total / EXECUTIVE_METRICS.total14081Procedures) * 100, 1)})
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span>กำลังแสดง {filteredProcs.length} จาก {PROCEDURES_14081_2569.length} รหัส</span>
            {procCat !== 'ALL' && (
              <button
                type="button"
                onClick={() => setProcCat('ALL')}
                className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-medium dark:bg-slate-700"
              >
                ล้างตัวกรองหมวด
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={procQuery}
              onChange={(e) => setProcQuery(e.target.value)}
              placeholder="ค้นหารหัสหรือชื่อหัตถการ / SpecialPP..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 sm:w-72"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1040px] text-left text-[11px]">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-3 py-2.5 font-semibold">รหัส</th>
                <th className="px-3 py-2.5 font-semibold">ชื่อรายการหัตถการ / คัดกรอง</th>
                <th className="px-2.5 py-2.5 text-right font-bold">รวม</th>
                {MONTHS_FY2569.map((m) => (
                  <th key={m.key} className="px-2 py-2.5 text-right font-semibold">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProcs.map((r) => (
                <tr key={r.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-1.5 font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {r.code}
                  </td>
                  <td className="px-3 py-1.5 text-slate-900 dark:text-slate-100">{r.name}</td>
                  <td className="px-2.5 py-1.5 text-right font-bold">{formatNum(r.total)}</td>
                  {r.monthly.map((v, idx) => (
                    <td
                      key={`${r.code}-${idx}`}
                      className={`px-2 py-1.5 text-right ${
                        v === 0 ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v === 0 ? '–' : formatNum(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Dataset 13: Room 14081 Emergency / Urgent ICD-10 (71 codes) */}
      <SectionCard
        title="รายโรคผู้รับบริการห้องหัตถการ (14081) ประเภทฉุกเฉินและอุบัติเหตุ (ครบ 71 รหัสโรค)"
        description="ชุดข้อมูลที่ 13: ติดตามความชุกรายโรคในห้องหัตถการรายเดือน ปีงบประมาณ 2569"
        badge="ชุดข้อมูลที่ 13 (71 โรค)"
        action={
          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={dxQuery}
              onChange={(e) => setDxQuery(e.target.value)}
              placeholder="ค้นหารหัสโรค 14081..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 sm:w-56"
            />
          </div>
        }
      >
        <div className="max-h-[380px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[1000px] text-left text-[11px]">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-2.5 py-2.5 text-center font-semibold">#</th>
                <th className="px-2.5 py-2.5 font-semibold">ICD-10</th>
                <th className="px-3 py-2.5 font-semibold">ชื่อโรค</th>
                <th className="px-2.5 py-2.5 text-right font-bold">รวม</th>
                {MONTHS_FY2569.map((m) => (
                  <th key={m.key} className="px-2 py-2.5 text-right font-semibold">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered14081Dx.map((r) => (
                <tr key={`${r.no}-${r.code}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-2.5 py-1.5 text-center text-slate-500">{r.no}</td>
                  <td className="px-2.5 py-1.5 font-mono font-bold text-rose-600 dark:text-rose-400">
                    {r.code}
                  </td>
                  <td className="px-3 py-1.5 text-slate-900 dark:text-slate-100">{r.name}</td>
                  <td className="px-2.5 py-1.5 text-right font-bold">{formatNum(r.total)}</td>
                  {r.monthly.map((v, idx) => (
                    <td
                      key={`${r.no}-${idx}`}
                      className={`px-2 py-1.5 text-right ${
                        v === 0 ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v === 0 ? '–' : formatNum(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
