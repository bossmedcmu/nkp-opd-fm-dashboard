import {
  DM_HT_MONTHLY_2569,
  DM_SCREENING_RECORDS,
  FLU_VACCINE_YEARLY,
  INSURANCE_RIGHTS,
  MONTHLY_NOSHOW_2569,
  MONTHLY_VISITS_2569,
  ROOM_14081_DISPOSITION,
  TELEMED_2569,
  YEARLY_NOSHOW,
  YEARLY_VISITS,
} from './clinicData';
import { DISPOSITION_MONTHLY_2569, PROCEDURES_14081_2569 } from './dispositionAndProceduresData';
import { ICD10_14081_2569, ICD10_MAIN_2569 } from './icd10Data';

export const EXECUTIVE_METRICS = (() => {
  const v2566 = YEARLY_VISITS[0];
  const v2568 = YEARLY_VISITS[2];
  const v2569 = YEARLY_VISITS[3];

  const visitGrowth4Y = ((v2569.visits - v2566.visits) / v2566.visits) * 100;
  const visitGrowthYoY = ((v2569.visits - v2568.visits) / v2568.visits) * 100;
  const patientGrowth4Y = ((v2569.patients - v2566.patients) / v2566.patients) * 100;

  const totalWorkingDays2569 = MONTHLY_VISITS_2569.reduce((s, r) => s + r.workingDays, 0);
  const totalMonthlyVisits2569 = MONTHLY_VISITS_2569.reduce((s, r) => s + r.visits, 0);
  const overallAvgPerDay = totalMonthlyVisits2569 / totalWorkingDays2569;

  const peakMonthVisit = MONTHLY_VISITS_2569.reduce((max, r) =>
    r.visits > max.visits ? r : max,
  );
  const lowMonthVisit = MONTHLY_VISITS_2569.reduce((min, r) =>
    r.visits < min.visits ? r : min,
  );

  const ns2568 = YEARLY_NOSHOW[2];
  const ns2569 = YEARLY_NOSHOW[3];
  const noShowDiffYoY = ns2569.rate - ns2568.rate;
  const peakNoShowMonth = MONTHLY_NOSHOW_2569.reduce((max, r) =>
    r.rate > max.rate ? r : max,
  );
  const bestNoShowMonth = MONTHLY_NOSHOW_2569.reduce((min, r) =>
    r.rate < min.rate ? r : min,
  );

  const ins2566 = INSURANCE_RIGHTS[0];
  const ins2569 = INSURANCE_RIGHTS[3];
  const ucShare2569 = (ins2569.uc / ins2569.total) * 100;
  const otherShare2569 = (ins2569.other / ins2569.total) * 100;
  const otherGrowth4Y = ((ins2569.other - ins2566.other) / ins2566.other) * 100;

  const totalIcdMainVisits = ICD10_MAIN_2569.reduce((s, r) => s + r.count, 0);
  const totalDispositionVisits = DISPOSITION_MONTHLY_2569.reduce((s, r) => s + r.total, 0);
  const noCloseVisitMain =
    DISPOSITION_MONTHLY_2569.find((r) => r.closeType === 'ไม่มี CloseVisit Type')?.total ?? 0;

  const emsTotal = DISPOSITION_MONTHLY_2569.filter((r) => r.closeType.includes('EMS')).reduce(
    (s, r) => s + r.total,
    0,
  );
  const teleDispositionTotal = DISPOSITION_MONTHLY_2569.filter((r) =>
    r.closeType.includes('Tele'),
  ).reduce((s, r) => s + r.total, 0);
  const proxyMailDrugTotal = DISPOSITION_MONTHLY_2569.filter(
    (r) => r.closeType.includes('ญาติรับยาแทน') || r.closeType.includes('ไปรษณีย์'),
  ).reduce((s, r) => s + r.total, 0);

  const totalTelemedClinic = TELEMED_2569.reduce((s, r) => s + r.total, 0);
  const prisonTelemed = TELEMED_2569.find((r) => r.clinicCode === '1419')?.total ?? 0;

  const totalDmOnly = DM_HT_MONTHLY_2569.reduce((s, r) => s + r.dm, 0);
  const totalDmHt = DM_HT_MONTHLY_2569.reduce((s, r) => s + r.dmHt, 0);
  const totalHtOnly = DM_HT_MONTHLY_2569.reduce((s, r) => s + r.ht, 0);
  const dmWithHtPct = (totalDmHt / (totalDmOnly + totalDmHt)) * 100;

  const total14081Visits2569 = ROOM_14081_DISPOSITION.reduce((s, r) => s + r.y2569, 0);
  const noClose14081_2569 =
    ROOM_14081_DISPOSITION.find((r) => r.closeType === 'ไม่มี CloseVisit Type')?.y2569 ?? 0;
  const total14081Procedures = PROCEDURES_14081_2569.reduce((s, r) => s + r.total, 0);
  const total14081EmergencyDx = ICD10_14081_2569.reduce((s, r) => s + r.total, 0);

  const flu2569 = FLU_VACCINE_YEARLY[3];
  const totalFlu2569 = flu2569.general + flu2569.cgd + flu2569.sss;

  const foot2569 = DM_SCREENING_RECORDS.find(
    (r) => r.year === '2569' && r.group === 'ตรวจเท้า',
  )!;
  const retina2569 = DM_SCREENING_RECORDS.find(
    (r) => r.year === '2569' && r.group === 'คัดกรองจอประสาทตา',
  )!;
  const dental2569 = DM_SCREENING_RECORDS.find(
    (r) => r.year === '2569' && r.group === 'ตรวจฟัน',
  )!;
  const yearlyCheck2569 = DM_SCREENING_RECORDS.find(
    (r) => r.year === '2569' && r.group === 'Yearly Check Up',
  )!;

  return {
    v2566,
    v2568,
    v2569,
    visitGrowth4Y,
    visitGrowthYoY,
    patientGrowth4Y,
    totalWorkingDays2569,
    overallAvgPerDay,
    peakMonthVisit,
    lowMonthVisit,
    ns2568,
    ns2569,
    noShowDiffYoY,
    peakNoShowMonth,
    bestNoShowMonth,
    ucShare2569,
    otherShare2569,
    otherGrowth4Y,
    totalIcdMainVisits,
    totalDispositionVisits,
    noCloseVisitMain,
    emsTotal,
    teleDispositionTotal,
    proxyMailDrugTotal,
    decongestionTotal: emsTotal + teleDispositionTotal + proxyMailDrugTotal,
    totalTelemedClinic,
    prisonTelemed,
    totalDmOnly,
    totalDmHt,
    totalHtOnly,
    dmWithHtPct,
    total14081Visits2569,
    noClose14081_2569,
    total14081Procedures,
    total14081EmergencyDx,
    totalFlu2569,
    foot2569,
    retina2569,
    dental2569,
    yearlyCheck2569,
  };
})();
