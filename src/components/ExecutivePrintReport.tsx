import { createPortal } from 'react-dom';
import { EXECUTIVE_METRICS } from '../data/analyticsSummary';
import {
  CLINIC_CODES,
  DATA_METADATA,
  DM_SCREENING_RECORDS,
  FLU_VACCINE_YEARLY,
  INSURANCE_RIGHTS,
  MONTHLY_NOSHOW_2569,
  MONTHLY_VISITS_2569,
  TELEMED_2569,
  YEARLY_NOSHOW,
  YEARLY_VISITS,
} from '../data/clinicData';
import { ICD10_MAIN_2569 } from '../data/icd10Data';
import { formatNum, formatPct } from './DashboardPrimitives';

export function ExecutivePrintReport() {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="print-portal-root text-slate-900">
      {/* Page 1: Executive Summary & 4-Year Benchmark */}
      <div className="space-y-4">
        <div className="border-b-2 border-emerald-700 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700">
                {DATA_METADATA.hospital} • รายงานสรุปผลการดำเนินงานสำหรับผู้บริหาร
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">
                {DATA_METADATA.department} (11 รหัสคลินิก)
              </h1>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>ปีงบประมาณ {DATA_METADATA.fiscalYear}</p>
              <p>รอบข้อมูล: {DATA_METADATA.headerCutoffLabel}</p>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="print-avoid-break grid grid-cols-4 gap-2.5">
          <div className="rounded-lg border border-slate-300 p-2.5">
            <p className="text-[10px] text-slate-500">ผู้รับบริการปี 2569</p>
            <p className="text-base font-bold text-emerald-700">
              {formatNum(EXECUTIVE_METRICS.v2569.visits)} ครั้ง
            </p>
            <p className="text-[10px] text-slate-600">
              {formatNum(EXECUTIVE_METRICS.v2569.patients)} คน (+{EXECUTIVE_METRICS.visitGrowth4Y.toFixed(1)}% ใน 4 ปี)
            </p>
          </div>
          <div className="rounded-lg border border-slate-300 p-2.5">
            <p className="text-[10px] text-slate-500">เฉลี่ยต่อวันทำการ</p>
            <p className="text-base font-bold text-slate-900">
              {EXECUTIVE_METRICS.overallAvgPerDay.toFixed(1)} ครั้ง/วัน
            </p>
            <p className="text-[10px] text-slate-600">
              สูงสุด {EXECUTIVE_METRICS.peakMonthVisit.monthLabel} ({EXECUTIVE_METRICS.peakMonthVisit.avgPerDay.toFixed(1)}/วัน)
            </p>
          </div>
          <div className="rounded-lg border border-slate-300 p-2.5">
            <p className="text-[10px] text-slate-500">อัตราการขาดนัดปี 2569</p>
            <p className="text-base font-bold text-amber-700">
              {formatPct(EXECUTIVE_METRICS.ns2569.rate)}
            </p>
            <p className="text-[10px] text-slate-600">
              {formatNum(EXECUTIVE_METRICS.ns2569.noShows)} / {formatNum(EXECUTIVE_METRICS.ns2569.appointments)} นัด
            </p>
          </div>
          <div className="rounded-lg border border-slate-300 p-2.5">
            <p className="text-[10px] text-slate-500">ลดความแออัด &amp; Telemed</p>
            <p className="text-base font-bold text-sky-700">
              {formatNum(EXECUTIVE_METRICS.decongestionTotal)} ครั้ง
            </p>
            <p className="text-[10px] text-slate-600">
              Telemed คลินิกเฉพาะ {formatNum(EXECUTIVE_METRICS.totalTelemedClinic)} ครั้ง
            </p>
          </div>
        </div>

        {/* 4-Year Table */}
        <div className="print-avoid-break">
          <h2 className="mb-1.5 text-sm font-bold text-slate-900">
            1. สรุปตัวชี้วัดหลัก 4 ปีงบประมาณ (2566–2569)
          </h2>
          <table className="print-table border border-slate-300 text-[10px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-2 py-1.5 text-left">ปีงบประมาณ</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">ผู้ป่วย (คน)</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">รับบริการ (ครั้ง)</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">จำนวนนัด</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">ขาดนัด</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">ร้อยละขาดนัด</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">สิทธิ UC</th>
                <th className="border border-slate-300 px-2 py-1.5 text-right">สิทธิอื่นๆ</th>
              </tr>
            </thead>
            <tbody>
              {YEARLY_VISITS.map((v, i) => {
                const ns = YEARLY_NOSHOW[i];
                const ins = INSURANCE_RIGHTS[i];
                return (
                  <tr key={v.year}>
                    <td className="border border-slate-300 px-2 py-1 font-semibold">ปี {v.year}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(v.patients)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right font-semibold">{formatNum(v.visits)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ns.appointments)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ns.noShows)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatPct(ns.rate)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ins.uc)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ins.other)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Executive Analysis */}
        <div className="print-avoid-break rounded-lg border border-slate-300 bg-slate-50 p-3 text-[11px] leading-relaxed">
          <h2 className="mb-1 text-sm font-bold text-emerald-800">
            2. บทวิเคราะห์และข้อเสนอแนะเชิงกลยุทธ์สำหรับผู้บริหาร
          </h2>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong>การเติบโตของภาระงาน:</strong> ปริมาณผู้รับบริการเติบโต +36.1% ใน 4 ปี (11,350 เป็น 15,452 ครั้ง)
              และสิทธิอื่นๆ เติบโต +68.3% ควรขยายการส่งยาทางไปรษณีย์/EMS และ Telemedicine ในช่วงเดือน พ.ค.–มิ.ย. และ ก.ย.
            </li>
            <li>
              <strong>จุดวิกฤตการขาดนัด:</strong> เดือน ก.ค. 2569 ขาดนัดสูงถึง 38.02% (395/1,039 นัด)
              ควรเพิ่มระบบแจ้งเตือนนัดล่วงหน้าและติดตามผู้ป่วยโรคเรื้อรังเชิงรุก
            </li>
            <li>
              <strong>คุณภาพการคัดกรองเบาหวาน:</strong> การตรวจเท้าก้าวกระโดดเป็น 63.60% (601/945 ราย)
              แต่ควรเร่งรัดคัดกรองจอประสาทตา (49.84%) ตรวจฟัน (28.99%) และ Yearly Check Up (26.46%)
            </li>
            <li>
              <strong>ธรรมาภิบาลข้อมูล:</strong> พบการปิด Visit โดยไม่ระบุ CloseVisit Type ในคลินิกหลัก 504 ครั้ง
              และห้องหัตถการ 14081 อีก 227 ครั้ง รวมถึงยังไม่มีการแยกยอด Telemed NCD FM (14192) ในตาราง Telemed
            </li>
          </ul>
        </div>

        {/* 11 Clinics */}
        <div className="print-avoid-break">
          <h2 className="mb-1.5 text-sm font-bold text-slate-900">
            3. ขอบเขตเครือข่ายบริการทั้ง 11 รหัสคลินิก
          </h2>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {CLINIC_CODES.map((c) => (
              <div key={c.code} className="rounded border border-slate-300 px-2 py-1">
                <strong>{c.code}:</strong> {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 2: Monthly Workload, Top 10 ICD-10, Screening & Telemed */}
      <div className="print-page-break space-y-4">
        <div className="print-avoid-break">
          <h2 className="mb-1.5 text-sm font-bold text-slate-900">
            4. สถิติผู้รับบริการและการขาดนัดรายเดือน ปีงบประมาณ 2569
          </h2>
          <table className="print-table border border-slate-300 text-[10px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-left">เดือน</th>
                <th className="border border-slate-300 px-2 py-1 text-right">รับบริการ (ครั้ง)</th>
                <th className="border border-slate-300 px-2 py-1 text-right">วันทำการ</th>
                <th className="border border-slate-300 px-2 py-1 text-right">เฉลี่ย/วัน</th>
                <th className="border border-slate-300 px-2 py-1 text-right">จำนวนนัด</th>
                <th className="border border-slate-300 px-2 py-1 text-right">ขาดนัด</th>
                <th className="border border-slate-300 px-2 py-1 text-right">ร้อยละขาดนัด</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_VISITS_2569.map((m, idx) => {
                const ns = MONTHLY_NOSHOW_2569[idx];
                return (
                  <tr key={m.month}>
                    <td className="border border-slate-300 px-2 py-1 font-medium">{m.monthLabel}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(m.visits)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{m.workingDays}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{m.avgPerDay.toFixed(2)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ns.appointments)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(ns.noShows)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right font-semibold">{formatPct(ns.rate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="print-avoid-break">
          <h2 className="mb-1.5 text-sm font-bold text-slate-900">
            5. 10 อันดับโรคแรกที่มารับบริการมากที่สุด (จากทั้งหมด 672 รหัส ICD-10)
          </h2>
          <table className="print-table border border-slate-300 text-[10px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="w-12 border border-slate-300 px-2 py-1 text-center">ลำดับ</th>
                <th className="w-20 border border-slate-300 px-2 py-1 text-left">รหัสโรค</th>
                <th className="border border-slate-300 px-2 py-1 text-left">ชื่อการวินิจฉัย</th>
                <th className="w-24 border border-slate-300 px-2 py-1 text-right">จำนวน (ครั้ง)</th>
              </tr>
            </thead>
            <tbody>
              {ICD10_MAIN_2569.slice(0, 10).map((d) => (
                <tr key={d.rank}>
                  <td className="border border-slate-300 px-2 py-1 text-center">{d.rank}</td>
                  <td className="border border-slate-300 px-2 py-1 font-mono font-bold">{d.code}</td>
                  <td className="border border-slate-300 px-2 py-1">{d.name}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right font-semibold">{formatNum(d.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="print-avoid-break grid grid-cols-2 gap-3">
          <div>
            <h2 className="mb-1.5 text-xs font-bold text-slate-900">
              6. คัดกรองภาวะแทรกซ้อนเบาหวาน ปี 2569 (เป้า 945 ราย)
            </h2>
            <table className="print-table border border-slate-300 text-[10px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-left">รายการ</th>
                  <th className="border border-slate-300 px-2 py-1 text-right">ผลงาน</th>
                  <th className="border border-slate-300 px-2 py-1 text-right">ร้อยละ</th>
                </tr>
              </thead>
              <tbody>
                {DM_SCREENING_RECORDS.filter((r) => r.year === '2569').map((r) => (
                  <tr key={r.group}>
                    <td className="border border-slate-300 px-2 py-1">{r.group}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right">{formatNum(r.result)}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right font-semibold">{formatPct(r.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="mb-1.5 text-xs font-bold text-slate-900">
              7. บริการ Telemedicine ปี 2569 &amp; วัคซีนไข้หวัดใหญ่
            </h2>
            <table className="print-table border border-slate-300 text-[10px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-left">หน่วยบริการ</th>
                  <th className="border border-slate-300 px-2 py-1 text-right">ยอดปี 2569</th>
                </tr>
              </thead>
              <tbody>
                {TELEMED_2569.map((t) => (
                  <tr key={t.clinicCode}>
                    <td className="border border-slate-300 px-2 py-1">
                      {t.clinicCode} {t.name}
                    </td>
                    <td className="border border-slate-300 px-2 py-1 text-right font-semibold">
                      {formatNum(t.total)} ครั้ง
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-slate-300 px-2 py-1">วัคซีนไข้หวัดใหญ่ (14081)</td>
                  <td className="border border-slate-300 px-2 py-1 text-right font-semibold">
                    {formatNum(
                      FLU_VACCINE_YEARLY[3].general +
                        FLU_VACCINE_YEARLY[3].cgd +
                        FLU_VACCINE_YEARLY[3].sss,
                    )}{' '}
                    ราย
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
