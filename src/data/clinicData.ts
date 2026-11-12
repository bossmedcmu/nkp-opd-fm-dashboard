export interface ClinicUnit {
  code: string;
  name: string;
  category: 'core' | 'geriatric' | 'specialty' | 'telemed';
  categoryLabel: string;
  role: string;
}

export interface YearlyVisitRecord {
  year: string;
  patients: number;
  visits: number;
}

export interface MonthlyVisitRecord {
  month: string;
  monthLabel: string;
  visits: number;
  workingDays: number;
  avgPerDay: number;
}

export interface YearlyNoShowRecord {
  year: string;
  appointments: number;
  noShows: number;
  rate: number;
}

export interface MonthlyNoShowRecord {
  month: string;
  monthLabel: string;
  appointments: number;
  noShows: number;
  rate: number;
}

export interface InsuranceRecord {
  year: string;
  total: number;
  uc: number;
  other: number;
}

export interface Room14081DispositionRecord {
  closeType: string;
  y2566: number;
  y2567: number;
  y2568: number;
  y2569: number;
}

export interface FluVaccineRecord {
  year: string;
  general: number;
  cgd: number; // กรมบัญชีกลาง
  sss: number; // ประกันสังคม
}

export interface TelemedMonthlyRecord {
  clinicCode: string;
  name: string;
  total: number;
  monthly: number[]; // 2025-10 to 2026-09
}

export interface DmHtMonthlyRecord {
  month: string;
  monthLabel: string;
  dm: number;
  dmHt: number;
  ht: number;
}

export interface DmScreeningRecord {
  year: string;
  group: 'Yearly Check Up' | 'คัดกรองจอประสาทตา' | 'ตรวจฟัน' | 'ตรวจเท้า';
  target: number;
  result: number;
  rate: number;
}

export const MONTHS_FY2569 = [
  { key: '2025-10', label: 'ต.ค. 68' },
  { key: '2025-11', label: 'พ.ย. 68' },
  { key: '2025-12', label: 'ธ.ค. 68' },
  { key: '2026-01', label: 'ม.ค. 69' },
  { key: '2026-02', label: 'ก.พ. 69' },
  { key: '2026-03', label: 'มี.ค. 69' },
  { key: '2026-04', label: 'เม.ย. 69' },
  { key: '2026-05', label: 'พ.ค. 69' },
  { key: '2026-06', label: 'มิ.ย. 69' },
  { key: '2026-07', label: 'ก.ค. 69' },
  { key: '2026-08', label: 'ส.ค. 69' },
  { key: '2026-09', label: 'ก.ย. 69' },
] as const;

export const DATA_METADATA = {
  fiscalYear: '2569',
  headerCutoffLabel: '28 ก.พ. 2569 (ตารางรายเดือนครอบคลุม ต.ค. 2568 – ก.ย. 2569)',
  hospital: 'โรงพยาบาลนครพิงค์',
  department: 'คลินิกเวชศาสตร์ครอบครัวและชุมชน (OPD FM)',
  totalClinics: 11,
  includedDatasets: 14,
};

// รหัสคลินิกงานเวชปฏิบัติครอบครัวและชุมชน 11 รหัส
export const CLINIC_CODES: ClinicUnit[] = [
  {
    code: '1408',
    name: 'คลินิกเวชศาสตร์ครอบครัว',
    category: 'core',
    categoryLabel: 'บริการเวชศาสตร์ครอบครัวหลัก',
    role: 'คลินิกตรวจรักษาโรคทั่วไป โรคเรื้อรัง และดูแลผู้ป่วยแบบองค์รวม',
  },
  {
    code: '14081',
    name: 'คลินิกเวชศาสตร์ครอบครัว — ห้องหัตถการ',
    category: 'core',
    categoryLabel: 'บริการเวชศาสตร์ครอบครัวหลัก',
    role: 'ฉีดยา ทำแผล หัตถการฉุกเฉินเบื้องต้น และคัดกรองส่งเสริมป้องกัน (SpecialPP)',
  },
  {
    code: '14082',
    name: 'คลินิกเวชศาสตร์ครอบครัว — รับยาไม่พบแพทย์',
    category: 'core',
    categoryLabel: 'บริการเวชศาสตร์ครอบครัวหลัก',
    role: 'บริการรับยาต่อเนื่อง ญาติรับแทน และจัดส่งยาทางไปรษณีย์/EMS เพื่อลดความแออัด',
  },
  {
    code: '1407',
    name: 'คลินิกผู้สูงอายุ',
    category: 'geriatric',
    categoryLabel: 'เครือข่ายคลินิกผู้สูงอายุ',
    role: 'ประเมินผู้สูงอายุแบบองค์รวม (CGA) คัดกรองสมรรถนะ ซึมเศร้า และภาวะพึ่งพิง',
  },
  {
    code: '0813',
    name: 'คลินิกสูงอายุ — กระดูก',
    category: 'geriatric',
    categoryLabel: 'เครือข่ายคลินิกผู้สูงอายุ',
    role: 'ดูแลโรคกระดูกพรุน ข้อเข่าเสื่อม และป้องกันการพลัดตกหกล้มในผู้สูงอายุ',
  },
  {
    code: '1420',
    name: 'คลินิกสูงอายุ — Telemed',
    category: 'geriatric',
    categoryLabel: 'เครือข่ายคลินิกผู้สูงอายุ',
    role: 'ติดตามอาการผู้สูงอายุผ่านระบบการแพทย์ทางไกล ลดภาระการเดินทาง',
  },
  {
    code: '14083',
    name: 'Remission Clinic เวชศาสตร์ครอบครัว',
    category: 'specialty',
    categoryLabel: 'คลินิกเฉพาะทางและประคับประคอง',
    role: 'คลินิกโรคเบาหวานระยะสงบ ปรับเปลี่ยนพฤติกรรมเชิงเข้มข้นและลดการใช้ยา',
  },
  {
    code: '2003',
    name: 'คลินิก Palliative เวชศาสตร์ครอบครัว',
    category: 'specialty',
    categoryLabel: 'คลินิกเฉพาะทางและประคับประคอง',
    role: 'การบริบาลผู้ป่วยระยะประคับประคองและผู้ป่วยโรคมะเร็งต่อเนื่อง',
  },
  {
    code: '1419',
    name: 'Telemed เรือนจำหญิง เวชศาสตร์ครอบครัว',
    category: 'telemed',
    categoryLabel: 'การแพทย์ทางไกลเชิงรุก',
    role: 'บริการตรวจรักษาทางไกลสำหรับผู้ต้องขังหญิง เชื่อมโยงสิทธิการรักษาอย่างเท่าเทียม',
  },
  {
    code: '14191',
    name: 'Telemed สถานพินิจ เวชศาสตร์ครอบครัว',
    category: 'telemed',
    categoryLabel: 'การแพทย์ทางไกลเชิงรุก',
    role: 'บริการตรวจรักษาและให้คำปรึกษาทางไกลสำหรับเด็กและเยาวชนในสถานพินิจ',
  },
  {
    code: '14192',
    name: 'Telemed NCD FM เวชศาสตร์ครอบครัว',
    category: 'telemed',
    categoryLabel: 'การแพทย์ทางไกลเชิงรุก',
    role: 'การแพทย์ทางไกลสำหรับผู้ป่วยโรคไม่ติดต่อเรื้อรัง (เตรียมเชื่อมโยงแยกยอดในตาราง Telemed)',
  },
];

// ชุดที่ 1: จำนวนผู้รับบริการรายปีงบประมาณ 2566-2569
export const YEARLY_VISITS: YearlyVisitRecord[] = [
  { year: '2566', patients: 3720, visits: 11350 },
  { year: '2567', patients: 4098, visits: 12564 },
  { year: '2568', patients: 4463, visits: 13681 },
  { year: '2569', patients: 4687, visits: 15452 },
];

// ชุดที่ 2: จำนวนผู้รับบริการจำแนกรายเดือน ปีงบประมาณ 2569
export const MONTHLY_VISITS_2569: MonthlyVisitRecord[] = [
  { month: '2025-10', monthLabel: 'ต.ค. 68', visits: 1377, workingDays: 23, avgPerDay: 59.87 },
  { month: '2025-11', monthLabel: 'พ.ย. 68', visits: 1020, workingDays: 21, avgPerDay: 48.57 },
  { month: '2025-12', monthLabel: 'ธ.ค. 68', visits: 1376, workingDays: 22, avgPerDay: 62.55 },
  { month: '2026-01', monthLabel: 'ม.ค. 69', visits: 1311, workingDays: 21, avgPerDay: 62.43 },
  { month: '2026-02', monthLabel: 'ก.พ. 69', visits: 1111, workingDays: 20, avgPerDay: 55.55 },
  { month: '2026-03', monthLabel: 'มี.ค. 69', visits: 1306, workingDays: 21, avgPerDay: 62.19 },
  { month: '2026-04', monthLabel: 'เม.ย. 69', visits: 1187, workingDays: 18, avgPerDay: 65.94 },
  { month: '2026-05', monthLabel: 'พ.ค. 69', visits: 1358, workingDays: 19, avgPerDay: 71.47 },
  { month: '2026-06', monthLabel: 'มิ.ย. 69', visits: 1604, workingDays: 22, avgPerDay: 72.91 },
  { month: '2026-07', monthLabel: 'ก.ค. 69', visits: 1135, workingDays: 20, avgPerDay: 56.75 },
  { month: '2026-08', monthLabel: 'ส.ค. 69', visits: 1140, workingDays: 21, avgPerDay: 54.29 },
  { month: '2026-09', monthLabel: 'ก.ย. 69', visits: 1527, workingDays: 22, avgPerDay: 69.41 },
];

// ชุดที่ 3: จำนวนและร้อยละของผู้รับบริการที่ขาดนัด รายปีงบประมาณ 2566-2569
export const YEARLY_NOSHOW: YearlyNoShowRecord[] = [
  { year: '2566', appointments: 9245, noShows: 2159, rate: 23.35 },
  { year: '2567', appointments: 9774, noShows: 2236, rate: 22.88 },
  { year: '2568', appointments: 10968, noShows: 3079, rate: 28.07 },
  { year: '2569', appointments: 12802, noShows: 3324, rate: 25.96 },
];

// ชุดที่ 4: จำนวนและร้อยละของผู้รับบริการที่ขาดนัด จำแนกรายเดือน ปีงบประมาณ 2569
export const MONTHLY_NOSHOW_2569: MonthlyNoShowRecord[] = [
  { month: '2025-10', monthLabel: 'ต.ค. 68', appointments: 1071, noShows: 252, rate: 23.53 },
  { month: '2025-11', monthLabel: 'พ.ย. 68', appointments: 744, noShows: 181, rate: 24.33 },
  { month: '2025-12', monthLabel: 'ธ.ค. 68', appointments: 1093, noShows: 220, rate: 20.13 },
  { month: '2026-01', monthLabel: 'ม.ค. 69', appointments: 1078, noShows: 282, rate: 26.16 },
  { month: '2026-02', monthLabel: 'ก.พ. 69', appointments: 839, noShows: 201, rate: 23.96 },
  { month: '2026-03', monthLabel: 'มี.ค. 69', appointments: 1131, noShows: 311, rate: 27.50 },
  { month: '2026-04', monthLabel: 'เม.ย. 69', appointments: 980, noShows: 203, rate: 20.71 },
  { month: '2026-05', monthLabel: 'พ.ค. 69', appointments: 1202, noShows: 301, rate: 25.04 },
  { month: '2026-06', monthLabel: 'มิ.ย. 69', appointments: 1413, noShows: 399, rate: 28.24 },
  { month: '2026-07', monthLabel: 'ก.ค. 69', appointments: 1039, noShows: 395, rate: 38.02 },
  { month: '2026-08', monthLabel: 'ส.ค. 69', appointments: 870, noShows: 221, rate: 25.40 },
  { month: '2026-09', monthLabel: 'ก.ย. 69', appointments: 1250, noShows: 307, rate: 24.56 },
];

// ชุดที่ 5: จำนวนผู้รับบริการจำแนกตามสิทธิการรักษาพยาบาล รายปีงบประมาณ 2566-2569
export const INSURANCE_RIGHTS: InsuranceRecord[] = [
  { year: '2566', total: 11350, uc: 8872, other: 2478 },
  { year: '2567', total: 12564, uc: 9668, other: 2896 },
  { year: '2568', total: 13681, uc: 10371, other: 3310 },
  { year: '2569', total: 15452, uc: 11282, other: 4170 },
];

// ชุดที่ 12: จำนวนผู้รับบริการห้องหัตถการ (14081) จำแนกตามการจำหน่าย 4 ปี (ครบ 26 รายการ)
export const ROOM_14081_DISPOSITION: Room14081DispositionRecord[] = [
  { closeType: 'Consult ENT(เบอร์ 23)', y2566: 0, y2567: 0, y2568: 1, y2569: 0 },
  { closeType: 'Consult MED (เบอร์4)', y2566: 0, y2567: 0, y2568: 2, y2569: 3 },
  { closeType: 'Consult แพทย์ต่างแผนก', y2566: 0, y2567: 0, y2568: 0, y2569: 1 },
  { closeType: 'Refer - เกินศักยภาพด้านการแพทย์เฉพาะทาง', y2566: 0, y2567: 0, y2568: 1, y2569: 0 },
  { closeType: 'ฉีดยาเสร็จแล้วกลับบ้าน', y2566: 24, y2567: 412, y2568: 324, y2569: 392 },
  { closeType: 'ตรวจต่อ คลินิก OPD ศัลยกรรม', y2566: 0, y2567: 1, y2568: 0, y2569: 0 },
  { closeType: 'ตรวจต่อ คลินิก ORTHO (เบอร์ 112)', y2566: 0, y2567: 0, y2568: 1, y2569: 0 },
  { closeType: 'ตรวจเสร็จกลับบ้าน', y2566: 24, y2567: 144, y2568: 115, y2569: 66 },
  { closeType: 'ตรวจเสร็จรับยาและให้คำแนะนำก่อนกลับบ้าน', y2566: 0, y2567: 2, y2568: 0, y2569: 0 },
  { closeType: 'ตรวจเสร็จและรับยากลับบ้าน', y2566: 2, y2567: 34, y2568: 100, y2569: 64 },
  { closeType: 'ตัดไหมเสร็จ - กลับบ้าน', y2566: 0, y2567: 1, y2568: 2, y2569: 5 },
  { closeType: 'ทำแผลเสร็จ - กลับบ้าน', y2566: 24, y2567: 99, y2568: 121, y2569: 163 },
  { closeType: 'ทำหัตถการเสร็จ - กลับบ้าน', y2566: 0, y2567: 52, y2568: 59, y2569: 32 },
  { closeType: 'พบพยาบาล - ให้คำแนะนำแล้วกลับบ้าน', y2566: 14, y2567: 11, y2568: 0, y2569: 0 },
  { closeType: 'ไม่มี CloseVisit Type', y2566: 8, y2567: 155, y2568: 157, y2569: 227 },
  { closeType: 'ยังไม่สิ้นสุดการรักษา', y2566: 0, y2567: 1, y2568: 2, y2569: 4 },
  { closeType: 'รอผล LAB', y2566: 0, y2567: 1, y2568: 0, y2569: 0 },
  { closeType: 'ส่งต่อ ER-MED', y2566: 0, y2567: 4, y2568: 11, y2569: 7 },
  { closeType: 'ส่งต่อ ER-Observe', y2566: 0, y2567: 0, y2568: 0, y2569: 1 },
  { closeType: 'ส่งต่อ ER-Observe 2', y2566: 0, y2567: 0, y2568: 1, y2569: 0 },
  { closeType: 'ส่งต่อ ER-SURG', y2566: 0, y2567: 0, y2568: 0, y2569: 1 },
  { closeType: 'ส่งต่อ Lab', y2566: 0, y2567: 1, y2568: 1, y2569: 0 },
  { closeType: 'ส่งต่อ คลินิกเวชศาสตร์ครอบครัว', y2566: 0, y2567: 24, y2568: 13, y2569: 19 },
  { closeType: 'ส่งต่อคลินิกผู้สูงอายุ', y2566: 0, y2567: 2, y2568: 0, y2569: 0 },
  { closeType: 'ส่งต่ออายุรกรรมมะเร็ง', y2566: 0, y2567: 0, y2568: 0, y2569: 1 },
  { closeType: 'ส่งทำ EKG (เบอร์ 25)', y2566: 1, y2567: 0, y2568: 0, y2569: 0 },
];

// ชุดที่ 15: วัคซีนไข้หวัดใหญ่ตามฤดูกาล (รหัสคลินิก 14081)
export const FLU_VACCINE_YEARLY: FluVaccineRecord[] = [
  { year: '2566', general: 48, cgd: 0, sss: 2 },
  { year: '2567', general: 832, cgd: 2, sss: 0 },
  { year: '2568', general: 530, cgd: 2, sss: 22 },
  { year: '2569', general: 598, cgd: 0, sss: 4 },
];

// ชุดที่ 16: Telemedicine ปีงบประมาณ 2569 (รหัสคลินิก 1419, 14191, 1420)
export const TELEMED_2569: TelemedMonthlyRecord[] = [
  {
    clinicCode: '1419',
    name: 'Tele Med เรือนจำหญิง',
    total: 657,
    monthly: [51, 45, 70, 49, 46, 24, 51, 52, 84, 33, 29, 123],
  },
  {
    clinicCode: '14191',
    name: 'Tele Med สถานพินิจ',
    total: 6,
    monthly: [0, 1, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0],
  },
  {
    clinicCode: '1420',
    name: 'Tele Med คลินิกผู้สูงอายุ',
    total: 22,
    monthly: [1, 0, 0, 7, 4, 2, 2, 3, 2, 0, 0, 1],
  },
];

// ชุดที่ 17: ผู้รับบริการ DM / DM_HT / HT รายเดือน ปีงบประมาณ 2569
export const DM_HT_MONTHLY_2569: DmHtMonthlyRecord[] = [
  { month: '2025-10', monthLabel: 'ต.ค. 68', dm: 58, dmHt: 262, ht: 521 },
  { month: '2025-11', monthLabel: 'พ.ย. 68', dm: 39, dmHt: 185, ht: 328 },
  { month: '2025-12', monthLabel: 'ธ.ค. 68', dm: 64, dmHt: 219, ht: 535 },
  { month: '2026-01', monthLabel: 'ม.ค. 69', dm: 61, dmHt: 249, ht: 517 },
  { month: '2026-02', monthLabel: 'ก.พ. 69', dm: 52, dmHt: 170, ht: 367 },
  { month: '2026-03', monthLabel: 'มี.ค. 69', dm: 57, dmHt: 221, ht: 481 },
  { month: '2026-04', monthLabel: 'เม.ย. 69', dm: 49, dmHt: 226, ht: 496 },
  { month: '2026-05', monthLabel: 'พ.ค. 69', dm: 48, dmHt: 272, ht: 536 },
  { month: '2026-06', monthLabel: 'มิ.ย. 69', dm: 84, dmHt: 313, ht: 682 },
  { month: '2026-07', monthLabel: 'ก.ค. 69', dm: 44, dmHt: 205, ht: 405 },
  { month: '2026-08', monthLabel: 'ส.ค. 69', dm: 47, dmHt: 200, ht: 415 },
  { month: '2026-09', monthLabel: 'ก.ย. 69', dm: 68, dmHt: 298, ht: 617 },
];

// ชุดที่ 18: การตรวจคัดกรองภาวะแทรกซ้อนผู้ป่วยเบาหวาน ปี 2567-2569
export const DM_SCREENING_RECORDS: DmScreeningRecord[] = [
  { year: '2567', group: 'Yearly Check Up', target: 860, result: 642, rate: 74.65 },
  { year: '2568', group: 'Yearly Check Up', target: 932, result: 820, rate: 87.98 },
  { year: '2569', group: 'Yearly Check Up', target: 945, result: 250, rate: 26.46 },
  { year: '2567', group: 'คัดกรองจอประสาทตา', target: 860, result: 395, rate: 45.93 },
  { year: '2568', group: 'คัดกรองจอประสาทตา', target: 932, result: 481, rate: 51.61 },
  { year: '2569', group: 'คัดกรองจอประสาทตา', target: 945, result: 471, rate: 49.84 },
  { year: '2567', group: 'ตรวจฟัน', target: 860, result: 164, rate: 19.07 },
  { year: '2568', group: 'ตรวจฟัน', target: 932, result: 182, rate: 19.53 },
  { year: '2569', group: 'ตรวจฟัน', target: 945, result: 274, rate: 28.99 },
  { year: '2567', group: 'ตรวจเท้า', target: 860, result: 192, rate: 22.33 },
  { year: '2568', group: 'ตรวจเท้า', target: 932, result: 431, rate: 46.24 },
  { year: '2569', group: 'ตรวจเท้า', target: 945, result: 601, rate: 63.60 },
];
