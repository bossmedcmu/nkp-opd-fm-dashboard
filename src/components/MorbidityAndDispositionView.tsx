import { useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  GitBranch,
  Search,
  Stethoscope,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import { MONTHS_FY2569 } from '../data/clinicData';
import { DISPOSITION_MONTHLY_2569 } from '../data/dispositionAndProceduresData';
import { ICD10_MAIN_2569 } from '../data/icd10Data';
import { CustomChartTooltip } from './CustomChartTooltip';
import { formatNum, formatPct, InsightCallout, KpiCard, SectionCard } from './DashboardPrimitives';

const PAGE_SIZE = 20;

export function MorbidityAndDispositionView() {
  const [icdQuery, setIcdQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [icdPage, setIcdPage] = useState(1);

  const [dispQuery, setDispQuery] = useState('');
  const [selectedDispGroup, setSelectedDispGroup] = useState<string>('ALL');

  const chapters = useMemo(() => {
    const map = new Map<string, { chapter: string; visits: number; codes: number }>();
    for (const row of ICD10_MAIN_2569) {
      const existing = map.get(row.chapter) ?? { chapter: row.chapter, visits: 0, codes: 0 };
      existing.visits += row.count;
      existing.codes += 1;
      map.set(row.chapter, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, []);

  const top15Icd = useMemo(
    () =>
      ICD10_MAIN_2569.slice(0, 15).map((r) => ({
        label: `${r.code} (${r.name.slice(0, 22)}${r.name.length > 22 ? '…' : ''})`,
        code: r.code,
        name: r.name,
        count: r.count,
      })),
    [],
  );

  const filteredIcd = useMemo(() => {
    const q = icdQuery.trim().toLowerCase();
    return ICD10_MAIN_2569.filter((r) => {
      if (selectedChapter !== 'ALL' && r.chapter !== selectedChapter) return false;
      if (!q) return true;
      return (
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        String(r.rank).includes(q)
      );
    });
  }, [icdQuery, selectedChapter]);

  const totalPages = Math.max(1, Math.ceil(filteredIcd.length / PAGE_SIZE));
  const safePage = Math.min(icdPage, totalPages);
  const pagedIcd = useMemo(
    () => filteredIcd.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredIcd, safePage],
  );

  const dispGroups = useMemo(() => {
    const map = new Map<string, { group: string; total: number; items: number }>();
    for (const row of DISPOSITION_MONTHLY_2569) {
      const existing = map.get(row.group) ?? { group: row.group, total: 0, items: 0 };
      existing.total += row.total;
      existing.items += 1;
      map.set(row.group, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, []);

  const innovationMonthlyChart = useMemo(() => {
    return MONTHS_FY2569.map((m, idx) => {
      const tele = DISPOSITION_MONTHLY_2569.filter((r) => r.closeType.includes('Tele')).reduce(
        (s, r) => s + r.monthly[idx],
        0,
      );
      const ems = DISPOSITION_MONTHLY_2569.filter((r) => r.closeType.includes('EMS')).reduce(
        (s, r) => s + r.monthly[idx],
        0,
      );
      const proxy = DISPOSITION_MONTHLY_2569.filter(
        (r) => r.closeType.includes('ญาติรับยาแทน') || r.closeType.includes('ไปรษณีย์'),
      ).reduce((s, r) => s + r.monthly[idx], 0);
      return {
        monthLabel: m.label,
        tele,
        ems,
        proxy,
      };
    });
  }, []);

  const filteredDisp = useMemo(() => {
    const q = dispQuery.trim().toLowerCase();
    return DISPOSITION_MONTHLY_2569.filter((r) => {
      if (selectedDispGroup !== 'ALL' && r.group !== selectedDispGroup) return false;
      if (!q) return true;
      return r.closeType.toLowerCase().includes(q) || r.group.toLowerCase().includes(q);
    });
  }, [dispQuery, selectedDispGroup]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="ความหลากหลายรหัสโรค (ICD-10)"
          value={`${formatNum(ICD10_MAIN_2569.length)} โรค`}
          subtitle={`ครอบคลุม ${formatNum(EXECUTIVE_METRICS.totalIcdMainVisits)} รายการวินิจฉัยในปีงบฯ 2569`}
          trendLabel={`10 อันดับแรก = ${formatPct(EXECUTIVE_METRICS.top10IcdPct, 1)}`}
          trendTone="neutral"
          icon={<Stethoscope className="h-5 w-5" />}
          accent="emerald"
        />
        <KpiCard
          title="อันดับ 1: ความดันโลหิตสูง (I10)"
          value={`${formatNum(4993)} ครั้ง`}
          subtitle={`คิดเป็น ${formatPct((4993 / EXECUTIVE_METRICS.totalIcdMainVisits) * 100)} ของรหัสโรคทั้งหมด`}
          trendLabel="เบาหวานรวม 2,337 ครั้ง"
          trendTone="neutral"
          icon={<Activity className="h-5 w-5" />}
          accent="rose"
        />
        <KpiCard
          title="รูปแบบการจำหน่ายผู้ป่วยทั้งหมด"
          value={`${DISPOSITION_MONTHLY_2569.length} รูปแบบ`}
          subtitle={`รวม ${formatNum(EXECUTIVE_METRICS.totalDispositionVisits)} รายการ (รับยากลับบ้านปกติ ${formatPct(EXECUTIVE_METRICS.normalDrugReturnPct, 1)})`}
          trendLabel="Consult/ส่งต่อ ER ครบ"
          trendTone="positive"
          icon={<GitBranch className="h-5 w-5" />}
          accent="sky"
        />
        <KpiCard
          title="ไม่ระบุ CloseVisit Type"
          value={`${formatNum(EXECUTIVE_METRICS.noCloseVisitMain)} ครั้ง`}
          subtitle={`คิดเป็น ${formatPct(
            (EXECUTIVE_METRICS.noCloseVisitMain / EXECUTIVE_METRICS.totalDispositionVisits) * 100,
          )} ของการปิดสิทธิทั้งหมด (อันดับ 2 รองจากรับยาปกติ)`}
          trendLabel="จุดปรับปรุงคุณภาพข้อมูล"
          trendTone="warning"
          icon={<FileCheck2 className="h-5 w-5" />}
          accent="amber"
        />
      </div>

      {/* Dataset 6: Top 15 & Chapter Grouping */}
      <SectionCard
        title="ระบาดวิทยา 15 โรคแรกที่มารับบริการมากที่สุด และโครงสร้างตามหมวด ICD-10"
        description="ชุดข้อมูลที่ 6: วิเคราะห์ภาระโรคหลักที่เข้ามารับบริการในคลินิกเวชศาสตร์ครอบครัว ปีงบประมาณ 2569"
        badge="ชุดข้อมูลที่ 6 (672 โรค)"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="h-[420px] xl:col-span-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={top15Icd}
                margin={{ top: 5, right: 24, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={185}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                <Bar dataKey="count" name="จำนวนครั้ง" radius={[0, 6, 6, 0]} barSize={18}>
                  {top15Icd.map((entry, idx) => (
                    <Cell
                      key={entry.code}
                      fill={idx === 0 ? '#e11d48' : idx < 5 ? '#059669' : '#0284c7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-between gap-4 xl:col-span-5">
            <InsightCallout title="วิเคราะห์สัดส่วนกลุ่มโรคสำคัญ" tone="emerald">
              กลุ่มโรค NCD (ความดันโลหิตสูง, เบาหวาน, ไขมันในเลือดสูง) รวมกันมีสัดส่วนสูงถึง{' '}
              <strong>{formatPct(EXECUTIVE_METRICS.top3NcdGroupPct, 1)}</strong> ของปริมาณการวินิจฉัยทั้งหมด ขณะเดียวกันพบกลุ่มโรคผู้สูงอายุชัดเจน เช่น{' '}
              <strong>R54 ชราภาพ (150 ครั้ง)</strong>, <strong>F067 สมองเสื่อมระยะต้น (144 ครั้ง)</strong>,{' '}
              และกลุ่มปวดกล้ามเนื้อ/ข้อเข่าเสื่อม/กระดูกพรุน
            </InsightCallout>

            <div className="max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 font-semibold">หมวดโรค (ICD-10 Chapter)</th>
                    <th className="px-3 py-2 text-right font-semibold">จำนวนรหัส</th>
                    <th className="px-3 py-2 text-right font-semibold">จำนวนครั้ง</th>
                    <th className="px-3 py-2 text-right font-semibold">สัดส่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {chapters.map((ch) => (
                    <tr
                      key={ch.chapter}
                      onClick={() => {
                        setSelectedChapter(ch.chapter);
                        setIcdPage(1);
                      }}
                      className="cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
                    >
                      <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                        {ch.chapter}
                      </td>
                      <td className="px-3 py-2 text-right">{ch.codes}</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatNum(ch.visits)}</td>
                      <td className="px-3 py-2 text-right text-emerald-700 dark:text-emerald-400">
                        {formatPct((ch.visits / EXECUTIVE_METRICS.totalIcdMainVisits) * 100, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Full 672 ICD-10 Explorer */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ฐานข้อมูลค้นหารหัสโรค ICD-10 ครบทั้ง 672 รายการ (ไม่ตกหล่น)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                พบ {formatNum(filteredIcd.length)} รายการจากทั้งหมด {ICD10_MAIN_2569.length} รหัสโรค
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={icdQuery}
                  onChange={(e) => {
                    setIcdQuery(e.target.value);
                    setIcdPage(1);
                  }}
                  placeholder="ค้นหารหัส ICD-10 หรือชื่อโรค..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 sm:w-64"
                />
              </div>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setIcdPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="ALL">ทุกหมวดโรค (672 รหัส)</option>
                {chapters.map((c) => (
                  <option key={c.chapter} value={c.chapter}>
                    {c.chapter} ({c.codes})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                <tr>
                  <th className="w-16 px-3 py-2.5 text-center font-semibold">ลำดับ</th>
                  <th className="w-24 px-3 py-2.5 font-semibold">ICD-10</th>
                  <th className="px-3 py-2.5 font-semibold">ชื่อโรค / การวินิจฉัย</th>
                  <th className="px-3 py-2.5 font-semibold">หมวดโรค</th>
                  <th className="w-24 px-3 py-2.5 text-right font-semibold">จำนวน (ครั้ง)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pagedIcd.map((row) => (
                  <tr key={`${row.rank}-${row.code}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-2 text-center text-slate-500">{row.rank}</td>
                    <td className="px-3 py-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {row.code}
                    </td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{row.chapter}</td>
                    <td className="px-3 py-2 text-right font-bold">{formatNum(row.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              หน้า {safePage} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setIcdPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> ก่อนหน้า
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setIcdPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
              >
                ถัดไป <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Dataset 7: Disposition Analytics */}
      <SectionCard
        title="การจำหน่ายผู้ป่วยออกจากห้องตรวจครบทั้ง 66 รูปแบบ และนวัตกรรมลดความแออัดรายเดือน"
        description="ชุดข้อมูลที่ 7: วิเคราะห์รูปแบบการปิด Visit รายเดือน (Telemedicine, ส่งยา EMS, ญาติรับยาแทน, Consult และส่งต่อ)"
        badge="ชุดข้อมูลที่ 7 (66 รูปแบบ)"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[300px] lg:col-span-7">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={innovationMonthlyChart}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.35} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" ครั้ง" />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="tele"
                  stackId="inn"
                  name="Telemedicine (ไม่มียา + รับยาเอง)"
                  fill="#0284c7"
                />
                <Bar
                  dataKey="ems"
                  stackId="inn"
                  name="Dowell EMS ส่งยา (ครั้งหน้า + ครั้งนี้)"
                  fill="#10b981"
                />
                <Bar
                  dataKey="proxy"
                  stackId="inn"
                  name="ญาติรับยาแทน / ไปรษณีย์"
                  fill="#f59e0b"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 lg:col-span-5">
            <InsightCallout title="กลยุทธ์ลดความแออัด (Decongestion Flow)" tone="sky">
              เดือน <strong>พฤษภาคม 2569</strong> มีการส่งยาผ่าน <strong>Dowell EMS</strong> พุ่งสูงสุดถึง{' '}
              <strong>159 ครั้ง</strong> (ส่งครั้งหน้า 155 + ครั้งนี้ 4) ขณะที่เดือน{' '}
              <strong>กันยายน 2569</strong> บริการ <strong>Telemedicine</strong> สูงถึง{' '}
              <strong>123 ครั้ง</strong> (ไม่มียา 76 + รับยาเอง 47) ช่วยแบ่งเบาผู้ป่วยหน้าห้องตรวจได้อย่างมีนัยสำคัญ
            </InsightCallout>

            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <p className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
                สรุปตามกลุ่มการจำหน่าย (คลิกเพื่อกรองตารางด้านล่าง)
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDispGroup('ALL')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    selectedDispGroup === 'ALL'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  ทั้งหมด (66)
                </button>
                {dispGroups.map((g) => (
                  <button
                    key={g.group}
                    type="button"
                    onClick={() => setSelectedDispGroup(g.group)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      selectedDispGroup === g.group
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {g.group} ({formatNum(g.total)})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full 66 Disposition Table */}
        <div className="mt-5">
          <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              ตารางรายละเอียดการจำหน่ายรายเดือน ครบทั้ง {DISPOSITION_MONTHLY_2569.length} รูปแบบ (กำลังแสดง{' '}
              {filteredDisp.length} รายการ)
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={dispQuery}
                onChange={(e) => setDispQuery(e.target.value)}
                placeholder="ค้นหารูปแบบการจำหน่าย / Consult / ER..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 sm:w-72"
              />
            </div>
          </div>

          <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[980px] text-left text-[11px]">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">ประเภทการจำหน่าย (CloseVisit)</th>
                  <th className="px-2.5 py-2.5 text-right font-bold">รวม</th>
                  {MONTHS_FY2569.map((m) => (
                    <th key={m.key} className="px-2 py-2.5 text-right font-semibold">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDisp.map((r) => (
                  <tr key={r.closeType} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                      {r.closeType}
                    </td>
                    <td className="px-2.5 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {formatNum(r.total)}
                    </td>
                    {r.monthly.map((val, idx) => (
                      <td
                        key={`${r.closeType}-${idx}`}
                        className={`px-2 py-2 text-right ${
                          val === 0 ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {val === 0 ? '–' : formatNum(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
