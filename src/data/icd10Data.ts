import { parseCsvLine, toNumber } from './csvParser';

export interface Icd10MainRecord {
  rank: number;
  code: string;
  name: string;
  count: number;
  chapter: string;
}

export interface Icd10ProcedureRoomRecord {
  no: number;
  code: string;
  name: string;
  total: number;
  monthly: number[]; // 12 months: 2025-10 to 2026-09
  chapter: string;
}

export function classifyIcd10Chapter(code: string): string {
  const first = code.charAt(0).toUpperCase();
  if (first === 'I') return 'ระบบไหลเวียนโลหิต (I00–I99)';
  if (first === 'E') return 'ต่อมไร้ท่อ โภชนาการ เมตาบอลิซึม (E00–E90)';
  if (first === 'M') return 'ระบบกล้ามเนื้อ กระดูก และเนื้อเยื่อเกี่ยวพัน (M00–M99)';
  if (first === 'J') return 'ระบบทางเดินหายใจ (J00–J99)';
  if (first === 'R') return 'อาการและอาการแสดงทางคลินิก (R00–R99)';
  if (first === 'F') return 'ความผิดปกติทางจิตและพฤติกรรม (F00–F99)';
  if (first === 'G') return 'ระบบประสาท (G00–G99)';
  if (first === 'K') return 'ระบบทางเดินอาหาร (K00–K93)';
  if (first === 'N') return 'ระบบทางเดินปัสสาวะและอวัยวะสืบพันธุ์ (N00–N99)';
  if (first === 'L') return 'ผิวหนังและเนื้อเยื่อใต้ผิวหนัง (L00–L99)';
  if (first === 'C' || first === 'D') {
    if (first === 'C' || (first === 'D' && toNumber(code.slice(1, 3)) < 49)) {
      return 'เนื้องอกและมะเร็ง (C00–D48)';
    }
    return 'โรคเลือดและภูมิคุ้มกัน (D50–D89)';
  }
  if (first === 'H') return 'ตาและหู (H00–H95)';
  if (first === 'A' || first === 'B') return 'โรคติดเชื้อและปรสิต (A00–B99)';
  if (first === 'S' || first === 'T') return 'การบาดเจ็บ พิษ และผลกระทบภายนอก (S00–T98)';
  if (first === 'U') return 'รหัสพิเศษ / แพทย์แผนไทย / โควิด-19 (U00–U99)';
  if (first === 'O' || first === 'Q') return 'สูติกรรมและความผิดปกติแต่กำเนิด (O/Q)';
  return 'หมวดอื่นๆ';
}

// ชุดที่ 6: จำนวนผู้รับบริการเรียงตามโรคที่มารับบริการมากที่สุด ปีงบประมาณ 2569 (ครบทั้ง 672 รหัส)
const RAW_ICD10_MAIN_CSV = `
2569,I10,"Essential (primary) hypertension,HT",4993,1
2569,E149,Diabetes mellitus,1228,2
2569,E119,Non-insulin-dependent diabetes mell,1109,3
2569,E789,"Disorder of lipoprotein metabolism,",867,4
2569,E785,"Hyperlipidaemia, unspecified",705,5
2569,J459,"Asthma, unspecified",178,6
2569,J00,Acute nasopharyngitis,175,7
2569,R54,Senility,150,8
2569,F067,Mild cognitive disorder,144,9
2569,M6269,Muscle strain Site unspecified,130,10
2569,R101,"Pain localized to upper abdomen,Abdomen Pain Upper,Epigastric pain",118,11
2569,R42,"Dizziness and giddiness,Vertigo",98,12
2569,M545,Low back pain,86,13
2569,E059,"Thyrotoxicosis,Hyperthyroidism",78,14
2569,J304,"Allergic rhinitis, unspecified",77,15
2569,L309,"Dermatitis, unspecified",68,16
2569,E039,"Hypothyroidism, unspecified",64,17
2569,N40,"Hyperplasia of prostate,BPH",62,18
2569,M4796,Spondylosis unspecified Lumbar region,61,19
2569,N390,"Urinary tract infection,UTI",59,20
2569,M170,"Primary osteoarthritis of knee, bilateral",57,21
2569,J449,"Chronic obstructive pulmonary disease, unspecified",56,22
2569,G409,"Epilepsy, unspecified",54,23
2569,M8199,"Osteoporosis, unspecified Site unspecified",53,24
2569,I694,"Sequelae of stroke, not specified as haemorrhage or infarction",50,25
2569,M179,"Osteoarthritis of knee, unspecified",48,26
2569,R731,IFG,46,27
2569,A099,Gastroenteritis and colitis of unspecified origin,45,28
2569,M1099,"Gout, unspecified Site unspecified",38,29
2569,J101,"Influenza with other respiratory manifestations, influenza virus identified",38,30
2569,H041,Other disorders of lacrimal gland,38,31
2569,J069,"Acute upper respiratory infection,URI",38,32
2569,R05,Cough,36,33
2569,K30,Dyspepsia,36,34
2569,K219,Gastro-oesophageal reflux disease without oesophagitis,35,35
2569,H813,Other peripheral vertigo,35,36
2569,J029,"Pharyngitis, Acute pharyngitis, unspecified",33,37
2569,J039,"Acute tonsillitis, unspecified",31,38
2569,I489,"Atrial fibrillation and atrial flutter, unspecified",31,39
2569,L031,"Cellulitis of other parts of limb,axilla, shoulder,hip,ankle, arm, foot,except toe,hand,except finger,leg,knee",30,40
2569,C509,"Malignant neoplasm of breast,CA breast",29,41
2569,R104,"Abdominal pain,abd pain,abdominal colic,infantile colic,tenderness",29,42
2569,D649,"Anemia, unspecified",28,43
2569,R51,Headache,27,44
2569,F510,Nonorganic insomnia,26,45
2569,E46,Unspecified protein-energy malnutrition,25,46
2569,I48,Atrial fibrillation and flutter,23,47
2569,B354,Tinea corporis,22,48
2569,R002,Palpitations,22,49
2569,J40,"Bronchitis, not specified as acute or chronic",22,50
2569,R509,"Fever, Subacute fever, unspecified",22,51
2569,B181,"HBV ,Chronic viral hepatitis B",22,52
2569,M7919,Myalgia Site unspecified,22,53
2569,K590,Constipation,22,54
2569,M8100,Postmenopausal osteoporosis Multiple sites,21,55
2569,C187,"Malignant neoplasm of sigmoid colon,CA Sigmoid colon",21,56
2569,I64,"Stroke, not specified as haemorrhage or infarction,CVA",21,57
2569,R195,Other faecal abnormalities,20,58
2569,T784,"Allergy, unspecified",20,59
2569,J300,Vasomotor rhinitis,20,60
2569,I693,Sequelae of cerebral infarction,19,61
2569,B029,Zoster without complication,18,62
2569,M7911,Myalgia Shoulder region ,18,63
2569,G20,Parkinson's disease,18,64
2569,J189,"Pneumonia, unspecified",18,65
2569,U071,2019 nCoV virus disease,17,66
2569,C539,"Malignant neoplasm of cervix,CA Cervix",17,67
2569,K649,"Haemorrhoids,unspecified",17,68
2569,C541,Malignant meoplasm of endometrium,16,69
2569,F03,Unspecified dementia,16,70
2569,E790,Hyperuricaemia without signs of inflammatory arthritis and tophaceous disease,16,71
2569,M4799,Spondylosis unspecified Site unspecified,16,72
2569,G819,"Hemiplegia, hemiparesis ,unspecified",15,73
2569,M6261,Muscle strain Shoulder region,15,74
2569,J019,"Rhinosinusitis, Acute sinusitis, unspecified",15,75
2569,F322,Severe depressive episode without psychotic symptoms,15,76
2569,M940,Chondrocostal junction syndrome [Tietze],15,77
2569,M4319,Spondylolisthesis Site unspecified,15,78
2569,M4307,Spondylolysis Lumbosacral region ,14,79
2569,M1098,"Gout, unspecified Other ",14,80
2569,E441,Mild protein-energy malnutrition,14,81
2569,E876,Hypokalaemia,14,82
2569,F329,"Depressive episode, unspecified",14,83
2569,C349,"Malignant neoplasm of bronchus or lung,CA lung,CA Bronchus",14,84
2569,B351,Onychomycosis ( Tinea unguium ),14,85
2569,G560,"Carpal tunnel syndrome,CTS",14,86
2569,R601,Generalized oedema,14,87
2569,E051,"Thyrotoxicosis with toxic single thyroid nodule,Thyrotoxicosis,Uninidular goiter",14,88
2569,K921,"Melaena,LGIH,LGIB,Lower Gastro-intestinal Hemorrhage",14,89
2569,M6099,"Myositis, unspecified Site unspecified",14,90
2569,E890,Postprocedural hypothyroidism,13,91
2569,N300,Acute cystitis,13,92
2569,R074,"Chest pain, unspecified",13,93
2569,H811,Benign paroxysmal vertigo,13,94
2569,M653,Trigger finger,13,95
2569,B022,Zoster with other nervous system involvement,13,96
2569,H409,"Glaucoma, unspecified",13,97
2569,H109,"Conjunctivitis, unspecified",13,98
2569,M171,"Other primary osteoarthritis of knee,OA Knee 1 ข้าง",12,99
2569,R21,Rash and other nonspecific skin eruption,12,100
2569,M4729,Other spondylosis with radiculopathy Site unspecified,12,101
2569,S913,"Open wound of other parts of foot,Wound foot",12,102
2569,R53,Malaise and fatigue,11,103
2569,M0699,"Rheumatoid arthritis, unspecified Site unspecified",11,104
2569,J209,"Bronchitis, acute, unspecified",11,105
2569,H000,Hordeolum and other deep inflammation of eyelid,11,106
2569,M4792,Spondylosis unspecified Cervical region,11,107
2569,L039,Cellulitis;chronic,11,108
2569,M2556,"Pain in joint Lower leg,Knee pain",11,109
2569,M1009,"Idiopathic gouty,Gouty Arthritis",11,110
2569,C20,"Malignant meoplasm of rectum,CA Rectum,Rectum Carcinoma",11,111
2569,L239,Allergic contact dermatitis unspecified cause,10,112
2569,C61,"Malignant neoplasm of prostate,CA Prostate",10,113
2569,R300,Dysuria,10,114
2569,K041,Necrosis of pulp,10,115
2569,K053,Chronic periodontitis,10,116
2569,I802,"Phlebitis and thrombophlebitis of other deep vessels of lower extremities,DVT,deep vein thrombosis",10,117
2569,I251,Atherosclerotic heart disease,9,118
2569,F009,"Dementia in Alzheimer's disease, un",9,119
2569,F410,Panic disorder [episodic paroxysmal anxiety],9,120
2569,E050,"Thyrotoxicosis with diffuse goiter,Graves' disease,Toxic diffuse",9,121
2569,L030,"Cellulitis of finger and toe,thumb,subcuticular,periosteal,intrathecal",9,122
2569,M1008,Idiopathic gout Other ,9,123
2569,H609,"Otitis externa, unspecified",9,124
2569,F419,"Anxiety disorder, unspecified",9,125
2569,M750,Adhesive capsulitis of shoulder,9,126
2569,M771,Lateral epicondylitis,9,127
2569,M4786,"Other spondylosis Lumbar region,LS osteoarthitis",8,128
2569,A049,Bacterial enteritis NOS,8,129
2569,M4722,Other spondylosis with radiculopathy Cervical region,8,130
2569,D563,Thalassemia trait,8,131
2569,M4306,Spondylolysis  Lumbar region,8,132
2569,N183,"Chronic kidney disease, stage 3,CKD stage 3",8,133
2569,U78123,Insomnia,8,134
2569,H360,Diabetic retinopathy (E10-E14+ with,8,135
2569,M7929,"Neuralgia and neuritis, unspecified Site unspecified",8,136
2569,D560,Thalassemia Alpha,8,137
2569,L089,"Local infection of the skin and subcutaneous tissue, unspecified",8,138
2569,K051,Chronic gingivitis,8,139
2569,G309,"Alzheimer's disease, unspecified",8,140
2569,T141,"Open wound of unspecified body region,Open wound ไม่ระบุตำแหน่ง,Punture Wound",8,141
2569,R194,Change in bowel habit,8,142
2569,G470,Insomnia,8,143
2569,D684,Acquired coagulation factor deficie,7,144
2569,M6268,Muscle strain Other ,7,145
2569,L409,"Psoriasis, unspecified",7,146
2569,N189,"Chronic renal failure,CKD,CRF",7,147
2569,L509,"Urticaria, unspecified",7,148
2569,G439,"Migraine, unspecified",7,149
2569,M798,Other specified soft tissue disorders,7,150
2569,E784,Other hyperlipidaemia,7,151
2569,U78122,Numbness,7,152
2569,M1399,"Arthritis, unspecified Site unspecified",7,153
2569,E112,NIDDM with renal complications,7,154
2569,M4809,Spinal stenosis Site unspecified,7,155
2569,C549,CA corpus uteri,7,156
2569,A059,Food poisoning,7,157
2569,T140,"Superficial injury of unspecified body region,Hematoma (Traumatic),Hematoma",7,158
2569,A979,"Dengue, unspecified,Dengue fever [DF]",7,159
2569,H612,Impacted cerumen,6,160
2569,B24,HIV/AIDS unspecified,6,161
2569,R730,Abnormal glucose tolerance test,6,162
2569,F432,Adjustment disorders,6,163
2569,M810,Postmenopausal osteoporosis,6,164
2569,M751,Rotator cuff syndrome,6,165
2569,M9953,Intervertebral disc stenosis of neural canal Lumbar region,6,166
2569,I259,"Chronic ischaemic heart disease, un",6,167
2569,N63,"Unspecified lump in brest,Breast Mass,Lump breast,Nudule breast",6,168
2569,L500,Allergic urticaria,6,169
2569,M628,Other specified disorders of muscle,6,170
2569,U78250,Impediment disease,6,171
2569,L208,Other atopic dermatitis,6,172
2569,K923,"Lower gastrointestinal haemorrhage,unspecified (TM)",6,173
2569,L209,"Atopic dermatitis, unspecified",6,174
2569,N184,"Chronic kidney disease, stage 4,CKD stage 4",6,175
2569,M512,"Other specified intervertebral disc displacement,Disc herniation",6,176
2569,R600,Localized oedema,6,177
2569,R060,Dyspnoea,6,178
2569,R55,Syncope and collapse,6,179
2569,D509,"Iron deficiency anemia, unspecified",6,180
2569,U78120,Dizziness,6,181
2569,J020,Streptococcal pharyngitis,5,182
2569,R740,Elevation of levels of transaminase and lactic acid dehydrogenase [LDH],5,183
2569,M6260,Muscle strain Multiple sites,5,184
2569,J030,Streptococcal tonsillitis,5,185
2569,M255,Pain in joint,5,186
2569,C189,"Malignant meoplasm of colon,CA colon",5,187
2569,K031,Abrasion of teeth,5,188
2569,E118,"Non-insulin-dependent diabetes mellitus, with unspecified complications",5,189
2569,B353,Tinea pedis,5,190
2569,M6265,Muscle strain Pelvic region and thigh,5,191
2569,U78128,Tremor,5,192
2569,I500,"CHF, ADHF, Congestive heart failure",5,193
2569,M722,Plantar fascial fibromatosis,5,194
2569,R31,Unspecified hematuria,5,195
2569,K297,"Gastritis, unspecified",5,196
2569,H931,Tinnitus,5,197
2569,F200,Paranoid schizophrenia,5,198
2569,R100,Acute abdomen,5,199
2569,E660,Obesity due to excess calories,5,200
2569,G570,Lesion of sciatic nerve,5,201
2569,H438,Other disorders of vitreous body,5,202
2569,T782,Anaphylactic shock,5,203
2569,U78028,Constipation,5,204
2569,I481,Persistent atrial fibrillation,5,205
2569,K760,"Fatty (change of) liver, not elsewhere classified,Fatty Liver",5,206
2569,E144,Unspecified diabetes mellitus with neurological complication,5,207
2569,E875,Hyperkalaemia,5,208
2569,C56,CA ovary,5,209
2569,C220,"Malignant meoplasm of liver cell carcinoma,CA Liver,HCC,Hepatoma",5,210
2569,U78842,Allergic rhinitis,4,211
2569,L259,"Unspecified contact dermatitis, unspecified cause",4,212
2569,H102,Other acute conjunctivitis,4,213
2569,L040,"Acute lymphadenitis of face, head ,neck",4,214
2569,J111,"Influenza with other respiratory manifestations, virus not identified",4,215
2569,K648,Other specified haemorrhoids,4,216
2569,M4806,"Spinal stenosis Lumbar region,L stenosis",4,217
2569,M501,"Cervical disc disorder with radiculopathy,CSR",4,218
2569,L028,"Abscess other sites, perietal scalp, head, subgaleal, any part, except face",4,219
2569,L630,Alopecia (capitis) totalis,4,220
2569,H113,Conjunctival haemorrhage,4,221
2569,F320,Mild depressive episode,4,222
2569,I499,"Arrhythmia cardiac ,unspecified",4,223
2569,G442,Tension-type headache,4,224
2569,M1006,Idiopathic gout Lower leg,4,225
2569,M4316,Spondylolisthesis Lumbar region,4,226
2569,I839,Varicose veins of lower extremities without ulcer or inflammation,4,227
2569,H269,"Cataract, unspecified",4,228
2569,L210,Seborrhoea capitis,4,229
2569,G629,"Polyneuropathy, unspecified,Neuropathy",4,230
2569,I691,Sequelae of intracerebral haemorrhage,4,231
2569,H110,Pterygium,4,232
2569,E782,Mixed hyperlipidaemia,4,233
2569,M4787,Other spondylosis Lumbosacral region ,4,234
2569,J441,"COPD with AE, Chronic obstructive pulmonary disease with acute exacerbation, unspecified",4,235
2569,H259,"Senile cataract, unspecified",4,236
2569,B379,"Candidiasis, unspecified",4,237
2569,R529,"Pain, unspecified",4,238
2569,N179,"Acute renal failure,ARF,AKI,Acute kidney injury",4,239
2569,N185,"Chronic kidney disease, stage 5,CKD stage 5",4,240
2569,R634,"Abnormal weight loss,Weight loss",4,241
2569,D619,"Aplastic anemia, unspecified",4,242
2569,N328,Other specified disorders of bladder,4,243
2569,S434,Sprain and strain of shoulder joint,4,244
2569,S202,Contusion of thorax,4,245
2569,M791,Myalgia,4,246
2569,R223,"Localized swelling,mass and lump,upper limb",4,247
2569,S936,Sprain and strain of other and unspecified parts of foot,4,248
2569,B330,Epidemic myalgia,4,249
2569,B020,Zoster encephalitis (G05.1*),4,250
2569,M8188,Other osteoporosis Other,4,251
2569,S635,Sprain and strain of wrist,4,252
2569,M7971,Myofascial pain in limb Shoulder region,4,253
2569,N939,"AUB, Abnormal uterine and vaginal bleedi",4,254
2569,B182,"HCV ,Chronic viral hepatitis C",4,255
2569,E049,"Nontoxic goiter,Goiter",4,256
2569,J100,"Influenza with pneumonia, other influenza virus identified",3,257
2569,H111,Conjunctival degenerations and deposits,3,258
2569,J312,Chronic pharyngitis,3,259
2569,U78100,Palpitations,3,260
2569,C12,Malignant neoplasm of pyriform sinus,3,261
2569,L600,Ingrowing nail,3,262
2569,N812,Incomplete uterovaginal prolapse,3,263
2569,N131,"Hydronephrosis with ureteral stricture, not elsewhere classified",3,264
2569,L853,Xerosis cutis,3,265
2569,E289,"Ovarian dysfunction, unspecified",3,266
2569,E538,Deficiency of other specified B group vitamins,3,267
2569,F059,"Delirium, unspecified",3,268
2569,J303,Other allergic rhinitis,3,269
2569,C19,Malignant meoplasm of malignant neo,3,270
2569,R102,"Pelvic and perineal pain,Pelvic Pain",3,271
2569,H571,Ocular pain,3,272
2569,R040,Epistaxis,3,273
2569,B009,"Herpesviral infection,Herpes simplex",3,274
2569,H669,"Otitis media, unspecified",3,275
2569,K112,Sialoadenitis,3,276
2569,C221,"Malignant meoplasm of Intrahepatic,CA Intrahepatic,CA Cholangio",3,277
2569,N200,"Calculus of kidney,RC,Renal calculus",3,278
2569,R233,Spontaneous ecchymoses,3,279
2569,S934,Sprain and strain of ankle,3,280
2569,N644,Mastodynia,3,281
2569,A499,"Bacterial infection, unspecified",3,282
2569,C831,Small cleaved cell (diffuse),3,283
2569,L910,"Hypertrophic scar,Keloid",3,284
2569,N201,"Calculus of ureter,UC",3,285
2569,E145,Unspecified diabetes mellitus with peripheral circuratory complications,3,286
2569,C910,Acute lymphoblastic leukaemia,3,287
2569,R221,"Localized swelling, mass and lump, neck",3,288
2569,M2557,Pain in joint Ankle and foot,3,289
2569,M6264,Muscle strain Hand,3,290
2569,U78270,Wilting disease,3,291
2569,G253,Myoclonus,3,292
2569,M4719,Other spondylosis with myelopathy Site unspecified,3,293
2569,E041,"Nontoxic single thyroid nodule,Thyroid nodule,Thyroid cyst",3,294
2569,M6549,Radial styloid tenosynovitis [ de Quervain ] Site unspecified,3,295
2569,M1994,"Arthrosis, unspecified Hand",3,296
2569,I698,Sequelae of other and unspecified cerebrovascular diseases,3,297
2569,M6266,Muscle strain Lower leg,3,298
2569,M7667,Achilles tendinitis Ankle and foot,3,299
2569,M1007,Idiopathic gout Ankle and foot,3,300
2569,J108,"Influenza with other manifestations, influenza virus identified",3,301
2569,M758,Other shoulder lesions,3,302
2569,M4309,Spondylolysis Site unspecified,3,303
2569,M4716,Other spondylosis with myelopathy Lumbar region,3,304
2569,I959,"Hypotension, unspecified",3,305
2569,M5412,Radiculopathy Cervical region,3,306
2569,M8029,Osteoporosis of disuse with pathological fracture Site unspecified,3,307
2569,M1096,"Gout, unspecified Lower leg",3,308
2569,I493,Ventricular premature depolarizatio,3,309
2569,S099,Unspecified injury of head,3,310
2569,D568,Thalassemia other,3,311
2569,J028,Acute pharyngitis due to other specified organisms,3,312
2569,M4949,Neuropathic spondylopathy Site unspecified,3,313
2569,M7915,Myalgia Pelvic region and thigh,3,314
2569,M7799,"Enthesopathy, unspecified Site unspecified",3,315
2569,S636,Sprain and strain of finger(s),2,316
2569,R33,Retention of urine,2,317
2569,R11,"Vomiting ,Nausea",2,318
2569,R32,Unspecified urinary incontinence,2,319
2569,E069,"Thyroiditis, unspecified",2,320
2569,S5250,"Fracture of the lower end of radius,closed",2,321
2569,I509,"Heart failure, unspecified",2,322
2569,H578,Other specified disorders of eye and adnexa,2,323
2569,I743,Embolism and thrombosis of arteries of the lower extremities,2,324
2569,T793,"Post-traumatic wound infection,Infection wound (Post Traumatic)",2,325
2569,I639,"Cerebral infarction, unspecified",2,326
2569,M519,"Intervertebral disc disorder, unspecified",2,327
2569,H810,Meni่ere's disease,2,328
2569,B370,Candidal stomatitis,2,329
2569,K081,"Loss of teeth due to accident, extraction or local periodontal diseases",2,330
2569,R251,"Tremor, unspecified",2,331
2569,S223,Fracture of rib,2,332
2569,G250,Essential tremor,2,333
2569,S836,Sprain and strain of other and unspecified parts of knee,2,334
2569,I340,Mitral (valve) insufficiency,2,335
2569,J038,Acute tonsillitis due to other specified organisms,2,336
2569,G450,Vertebro-basilar artery syndrome,2,337
2569,R945,Abnormal results of liver function studies,2,338
2569,G231,Progressive supranuclear ophthalmoplegia [Steele-Richardson-Olszewski],2,339
2569,R91,Abnormal findings on diagnostic imaging of lung,2,340
2569,C108,Overlapping lesion of oropharynx,2,341
2569,C119,"Malignant meoplasm of nasopharynx,",2,342
2569,I868,Varicose veins of other specified sites,2,343
2569,J018,Other acute sinusitis,2,344
2569,R35,Polyuria,2,345
2569,S909,"Superficial injury of ankle and foot, unspecified",2,346
2569,R619,"Hyperhidrosis, unspecified",2,347
2569,J410,Simple chronic bronchitis,2,348
2569,B084,Enteroviral vesicular stomatitis with exanthem,2,349
2569,R609,"Oedema,Edema",2,350
2569,J450,Predominantly allergic asthma,2,351
2569,I951,Orthostatic hypotension,2,352
2569,I471,Supraventricular tachycardia,2,353
2569,G318,Other specified degenerative diseases of the nervous system,2,354
2569,K028,Other dental caries,2,355
2569,S824,Fracture of fibula alone,2,356
2569,B1819,Chronic hepatitis B unspecified delta agent status,2,357
2569,L899,"Pressure sore ,Bed sore",2,358
2569,M8195,"Osteoporosis, unspecified Pelvic region and thigh",2,359
2569,M1990,"Arthrosis, unspecified Multiple sites",2,360
2569,E143,Background diabetic retinopathy,2,361
2569,M1317,"Monoarthritis, not elsewhere classified Ankle and foot",2,362
2569,D50,Iron deficiency anaemia,2,363
2569,D45,Polycythaemia vera,2,364
2569,U78170,Strangury disease,2,365
2569,D569,Thalassemia unspecified,2,366
2569,M0684,Other specified Rheumatoid arthritis Hand,2,367
2569,H103,"Acute conjunctivitis, unspecified",2,368
2569,M8159,Idiopathic osteoporosis Site unspecified,2,369
2569,L739,"Follicular disorder, unspecified",2,370
2569,L639,"Alopecia areata, unspecified",2,371
2569,H118,Other specified disorders of conjunctiva,2,372
2569,N898,Other specified noninflammatory disorders of vagina,2,373
2569,L608,Other nail disorders,2,374
2569,K409,"Unilateral or unspecified inguinal hernia, without obstruction or gangrene",2,375
2569,M8105,Postmenopausal osteoporosis Pelvic region and thigh,2,376
2569,M674,Ganglion,2,377
2569,E058,Other thyrotoxicosis,2,378
2569,M511,"Lumbar and other intervertebral disc disorders with radiculopathy,HNP(G551*)",2,379
2569,M542,Cervicalgia,2,380
2569,M6263,Muscle strain Forearm,2,381
2569,U78403,Herpes zoster,2,382
2569,M6267,Muscle strain Ankle and foot,2,383
2569,E02,Subclinical iodine-deficiency hypothyroidism,2,384
2569,M1999,"Arthrosis, unspecified Site unspecified",2,385
2569,E078,"Other specified disorders of thyroid,Thyroid;Other disorders",2,386
2569,E559,"Vitamin D deficiency, unspecified",2,387
2569,M712,Synovial cyst of popliteal space [Baker],2,388
2569,D638,"Anaemia in other chronic diseases,Anemia in chronic diseases,Anemia in CKD",2,389
2569,M4302,Spondylolysis Cervical region,2,390
2569,E115,NIDDM with peripheral circulatory complications,2,391
2569,M4156,Other secondary scoliosis Lumbar region,2,392
2569,H101,Acute atopic conjunctivitis,2,393
2569,M7791,"Enthesopathy, unspecified Shoulder region",2,394
2569,M4726,Other spondylosis with radiculopathy Lumbar region,2,395
2569,K703,Cirrhosis due to alcoholic,2,396
2569,E612,Magnesium deficiency,2,397
2569,N768,Other specified inflammation of vagina and vulva,2,398
2569,K1219,"OOTHER FORMS OF STOMATITIS,UNSPECIFIED",2,399
2569,N841,Polyp of cervix uteri,2,400
2569,N920,Excessive and frequent menstruation with regular cycle,2,401
2569,C629,"Malignant meoplasm of testis, unspe",2,402
2569,L029,"Abscess unspecified, connective tissue, cantaneous, rupture, phagedenic, skin, subcutaneous, supurative",2,403
2569,K746,"orther and unspecified cirrhosis of liver,Cirrhosis",2,404
2569,N760,Acute vaginitis,2,405
2569,K701,Hepatitis due to alcolholic,2,406
2569,A829,"Rabies, unspecified",2,407
2569,R030,Elevated blood pressure reading without diagnosis of hypertension,2,408
2569,K640,First degree haemorrhoids,2,409
2569,K573,"Diverticular disease of large intestine without perforation or abscess,Diverticular disease of colon",2,410
2569,K529,Noninfective gastroenteritis and co,2,411
2569,K802,"Calculus of gallbladder without cholecystitis,GS,Gall stone",2,412
2569,U78080,Cough,2,413
2569,M8728,Osteonecrosis due to previous trauma Other,2,414
2569,C900,Multiple myeloma,2,415
2569,U78026,Diarrhea,2,416
2569,L404,Guttate psoriasis,2,417
2569,G718,Other primary disorders of muscles,2,418
2569,N10,"Pyelonephritis, acute",2,419
2569,E781,Pure hyperglyceridaemia,2,420
2569,A419,"Septicemia, unspecified",2,421
2569,H353,Degeneration of macula and posterior pole,2,422
2569,G530,Postzoster neuralgia (B02.2+),1,423
2569,G562,Lesion of ulnar nerve,1,424
2569,B269,Mumps without complication,1,425
2569,A150,"Tuberculosis of lung, confirmed by",1,426
2569,G473,Sleep apnea,1,427
2569,G575,Tarsal tunnel syndrome,1,428
2569,A759,"Typhus fever, unspecified",1,429
2569,G454,Transient global amnesia,1,430
2569,A090,Infections diarrhea,1,431
2569,G510,Bell's palsy,1,432
2569,A084,Viral gastroenteritis,1,433
2569,B169,"Acute hepatitis B without delta-agent and without hepatic coma,Hepatitis B;Acute",1,434
2569,G519,"Disorder of facial nerve, unspecifi",1,435
2569,A600,Herpesviral infection of genitalia,1,436
2569,B07,"Warts,Viral warts,Verruca simplex",1,437
2569,G822,"Paraplegia, unspecified",1,438
2569,D24,Benign neoplasm of breast,1,439
2569,F019,"Vascular dementia, unspecified",1,440
2569,C494,Connective and soft tissue of abdomen,1,441
2569,C570,Malignant meoplasm of fallopian tub,1,442
2569,C770,Secondary  malignant neoplasm of  l,1,443
2569,C788,Secondary malignant neoplasm of oth,1,444
2569,C793,Secondary malignant neoplasm of brain and cerebral meninges,1,445
2569,C833,"DLBCL, Large cell (diffuse)",1,446
2569,C911,Chronic lymphocytic leukaemia,1,447
2569,E780,Pure hypercholesterolaemia,1,448
2569,E669,"Obesity, unspecified",1,449
2569,C229,"Malignant meoplasm of liver, unspec",1,450
2569,D179,"Benign lipomatous neoplasm, unspecified,Lipoma",1,451
2569,C250,"Malignant neoplasm head of pancreas,CA pancreas",1,452
2569,E232,Diabetes insipidus,1,453
2569,D34,Benign neoplasm of thyroid gland,1,454
2569,D381,"Trachea, bronchus and lung",1,455
2569,D431,"Brain, infratentorial cerebellum",1,456
2569,E141,D.K.A.,1,457
2569,D591,AIHA,1,458
2569,E117,NIDDMwith multiple complications,1,459
2569,E113,"NIDDM with retinopathy,cataract",1,460
2569,D689,"Coagulation defect, unspecified",1,461
2569,H001,Chalazion,1,462
2569,D170,"Benign lipomatous neoplasm of skin and subcutaneous tissue of head, face and neck",1,463
2569,F518,Other nonorganic sleep disorders,1,464
2569,B359,"Dermatophytosis, unspecified",1,465
2569,B360,Pityriasis versicolor,1,466
2569,G400,"epileptic, Localization-related (focal)(partial) idiopathic epilepsy and epileptic syndrom",1,467
2569,B49,Unspecified mycosis,1,468
2569,B719,"Cestode infection, unspecified",1,469
2569,B86,Scabies,1,470
2569,C01,Malignant neoplasm of base of tongue,1,471
2569,C029,"Malignant meoplasm of tongue, unspe",1,472
2569,C031,Lower gum,1,473
2569,F951,Chronic motor or vocal tic disorder,1,474
2569,F028,Dementia in other specified diseases classified elsewhere,1,475
2569,C154,Middle third of oesophagus,1,476
2569,C259,"Malignant neoplasm of pancreas,CA Head of pancreas",1,477
2569,C159,"Malignant neoplasm of oesophagus,CA Esophagus",1,478
2569,F453,Somatoform autonomic dysfunction,1,479
2569,C169,"Malignant neoplasm of stomach,CA stomach",1,480
2569,C186,CA Descending colon,1,481
2569,F411,Generalized anxiety disorder,1,482
2569,F252,"Schizoaffective disorder, mixed type",1,483
2569,F251,"Schizoaffective disorder, depressive type",1,484
2569,F172,Nicotin addiction,1,485
2569,F102,"Alcohol dependence syndrome,Alcoholism",1,486
2569,F060,Organic hallucinosis,1,487
2569,B356,Tinea cruris,1,488
2569,F900,Disturbance of activity and attention,1,489
2569,R011,"Cardiac murmur, unspecified",1,490
2569,N649,"Disorder of breast,Galactocele,Subinvolution Breast",1,491
2569,N800,Adenomyosis,1,492
2569,N921,Excessive and frequent menstruation with irregular cycle,1,493
2569,N946,"Dysmenorrhoea, unspecified",1,494
2569,N952,Postmenopausal atrophic vaginitis,1,495
2569,O149,"Pre-eclampsia, unspecified",1,496
2569,O219,"Vomiting of pregnancy, unspecified",1,497
2569,O234,Unspecified infection of urinary tr,1,498
2569,K922,"Gastrointestinal haemorrhage, unspecified",1,499
2569,Q111,Other anophthalmos,1,500
2569,N310,"Uninhibited neuropathic bladder, not elsewhere classified",1,501
2569,R073,Other chest pain,1,502
2569,R13,Dysphagia,1,503
2569,R14,Flatulence and related conditions,1,504
2569,R200,Anaesthesia of skin,1,505
2569,R220,"Localized swelling, mass and lump, head",1,506
2569,R222,"Localized swelling,mass and lump,trunk",1,507
2569,R224,"Localized swelling,mass and lump,lower limb",1,508
2569,R252,Cramp and spasm,1,509
2569,R262,"Difficulty in walking, not elsewhere classified",1,510
2569,O863,Other genitourinary tract infection,1,511
2569,M8005,Postmenopausal osteoporosis with pathological fracture Pelvic region and thigh,1,512
2569,M7102,Abscess of bursa Upper arm,1,513
2569,M7287,Other fibroblastic disorders Ankle and foot,1,514
2569,M754,Impingement syndrome of shoulder,1,515
2569,M7702,Medial epicondylitis Upper arm,1,516
2569,M7796,"Enthesopathy, unspecified Lower leg",1,517
2569,M7916,Myalgia Lower leg,1,518
2569,M7927,"Neuralgia and neuritis, unspecified Ankle and foot",1,519
2569,M7964,Pain in limb Hand,1,520
2569,M7970,Myofascial pain in limb Multiple sites,1,521
2569,N47,"Redundant prepuce, phimosis and paraphimosis",1,522
2569,M799,"Soft tissue disorder, unspecified",1,523
2569,N319,Neuromuscular dysfunction of bladde,1,524
2569,M8108,Postmenopausal osteoporosis Other,1,525
2569,M8109,Postmenopausal osteoporosis Site unspecified,1,526
2569,M8189,Other osteoporosis Site unspecified,1,527
2569,M8198,"Osteoporosis, unspecified Other",1,528
2569,N059,Unspecified nephritic syndrome at unspecified,1,529
2569,N133,Other and unspecified hydronephrosi,1,530
2569,N182,"Chronic kidney disease, stage 2,CKD stage 2",1,531
2569,N281,"Cyst of kidney, acquired",1,532
2569,R470,Dysphasia and aphasia,1,533
2569,M7976,Myofascial pain in limb Lower leg,1,534
2569,T905,Sequelae of intracranial injury,1,535
2569,R270,"Ataxia, unspecified",1,536
2569,S832,"Tear of meniscus, current",1,537
2569,S837,Injury to multiple structures of kn,1,538
2569,S903,Contusion of other and unspecified parts of foot,1,539
2569,S910,Open wound of ankle,1,540
2569,S998,Other specified injuries of ankle and foot,1,541
2569,T151,Foreign body in conjunctival sac,1,542
2569,T200,Burn of unspecified degree of head and neck,1,543
2569,T242,"Burn of second degree of hip and lower limb , except ankle and foot",1,544
2569,S809,"Superficial injury of lower leg, unspecified",1,545
2569,T887,Unspecified adverse effect of drug or medicament,1,546
2569,S800,Contusion of knee,1,547
2569,U5726,ลมปลายปัตฆาตขา,1,548
2569,U610,อัมพฤกษ์ หรือลมอัมพฤกษ์,1,549
2569,U6530,คออักเสบ,1,550
2569,U6680,ท้องอืด,1,551
2569,U671,ปัสสาวะบ่อย,1,552
2569,U78090,Common cold,1,553
2569,U78112,Sequelae of wind stroke,1,554
2569,U78240,True headache,1,555
2569,U78493,Lumbago,1,556
2569,T783,Angioneurotic oedema,1,557
2569,S4220,"Fracture of upper end of humerus,closed",1,558
2569,M654,Radial styloid tenosynovitis [de Quervain],1,559
2569,R590,Localized enlarged lymph nodes,1,560
2569,R611,Generalized hyperhidrosis,1,561
2569,R630,"Anorexia,Loss of appetite",1,562
2569,R682,"Dry mouth, unspecified",1,563
2569,R8762,High-grade squamous intraepithelial lesion [HSIL],1,564
2569,S009,"Superficial injury of head, part unspecified",1,565
2569,S024,Fracture of malar and maxillary bones,1,566
2569,S059,"Injury of eye and orbit, part unspe",1,567
2569,S819,"Open wound of lower leg, part unspecified",1,568
2569,S208,Superficial injury of other and unspecified parts of thorax,1,569
2569,R451,Restlessness and agitation,1,570
2569,S534,Sprain and strain of elbow,1,571
2569,S600,"Contusion of finger(s) without damage to nail,Contusion finger",1,572
2569,S609,"Superficial injury of wrist and hand, unspecified",1,573
2569,S619,"Open wound of wrist and hand, part",1,574
2569,S6230,"Fracture of other metacarpal bone,closed",1,575
2569,S6280,"Fracture of other and unspecified parts of wrist and hand,closed",1,576
2569,S662,Injury of extensor muscle and tendon of thumb at wrist and hand level,1,577
2569,S699,Unspecified injury of wrist and hand,1,578
2569,S731,Sprain and strain of hip,1,579
2569,S16,Injury of muscle and tendon at neck,1,580
2569,K029,"Dental caries, unspecified",1,581
2569,K140,Glossitis,1,582
2569,J128,Pneumonia other viral,1,583
2569,J159,"Pneumonia due to bacterial, unspecified",1,584
2569,J205,Acute bronchitis due to respiratory syncytial virus (RSV),1,585
2569,J328,Other chronic sinusitis,1,586
2569,J452,Bronchial hyperresponsiveness (TM),1,587
2569,J458,Mixed asthma,1,588
2569,J849,"Interstitial pulmonary disease, unspecified",1,589
2569,J984,Other disorders of lung,1,590
2569,J014,Acute pansinusitis,1,591
2569,K025,Caries with pulp exposure,1,592
2569,I889,"Nonspecific lymphadenitis,Lymphadenitis",1,593
2569,K047,Periapical abscess without sinus,1,594
2569,K050,Acute gingivitis,1,595
2569,K0539,"CCHRONIC PERIODONTITIS, UNSPECIFIED",1,596
2569,K0880,TTOOTHACHE,1,597
2569,K099,"Cyst of oral region, unspecified",1,598
2569,K111,Hypertrophy of salivary gland,1,599
2569,K120,Recurrent oral aphthae,1,600
2569,K121,Other forms of stomatitis,1,601
2569,M678,Other specified disorders of synovium and tendon,1,602
2569,K011,Impacted teeth,1,603
2569,H911,Presbycusis,1,604
2569,H019,"Inflammation of eyelid, unspecified",1,605
2569,H028,Other specified disorders of eyelid,1,606
2569,H186,Keratoconus,1,607
2569,H358,Other specified retinal disorders,1,608
2569,H402,Primary angle-closure glaucoma,1,609
2569,H420,"Glaucoma in endocrine, nutritional and metabolic diseases classified elsewhere",1,610
2569,H433,Other vitreous opacities,1,611
2569,H46,Optic neuritis,1,612
2569,H605,"Acute otitis externa, noninfective",1,613
2569,J068,Other acute upper respiratory infections of multiple sites,1,614
2569,H904,"Sensorineural hearing loss, unilateral with unrestricted hearing on the",1,615
2569,K318,Other specified diseases of stomach and duodenum,1,616
2569,H940,oustic neuritis in infectious and parasitic diseases classified elsewhere,1,617
2569,I059,"Mitral valve disease, unspecified",1,618
2569,I252,"Old myocardial infarction,MI;old",1,619
2569,I351,Aortic (valve) insufficiency,1,620
2569,I451,Other and unspecified right bundle-branch block,1,621
2569,I517,Cardiomegaly,1,622
2569,I679,"Cerebrovascular disease, unspecifie",1,623
2569,I840,"Internal thrombosed hemorrhoids,Hemorrhoid;Internal thrombosed",1,624
2569,I849,"Unspecified hemorrhoids without complication,Hemorrhoid",1,625
2569,H729,"Perforation of tympanic membrane, u",1,626
2569,M4723,Other spondylosis with radiculopathy Cervicothoracic region,1,627
2569,K137,Other and unspecified lesions of oral mucosa,1,628
2569,M0686,Other specified Rheumatoid arthritis Lower leg,1,629
2569,M1394,"Arthritis, unspecified Hand",1,630
2569,M169,"Coxarthrosis,OA  Hip",1,631
2569,M2553,Pain in joint Forearm,1,632
2569,M2554,Pain in joint Hand,1,633
2569,M2559,Pain in joint Site unspecified,1,634
2569,M2583,Other specified joint disorders Forearm,1,635
2569,M4186,Degenerative scoliosis of lumbar spine,1,636
2569,L918,Other hypertrophic disorders of the skin,1,637
2569,M4720,Other spondylosis with radiculopathy Multiple sites in spine,1,638
2569,L908,Other atrophic disorders of skin,1,639
2569,M4802,Spinal stenosis Cervical region,1,640
2569,M4807,Spinal stenosis Lumbosacral region ,1,641
2569,M541,Radiculopathy,1,642
2569,M5417,Radiculopathy Lumbosacral region ,1,643
2569,M543,Sciatica,1,644
2569,M6281,Other specified disorders of muscle Shoulder region,1,645
2569,M6288,Other specified disorders of muscle Other ,1,646
2569,M6529,Calcific tendinitis Site unspecified,1,647
2569,H010,Blepharitis,1,648
2569,M4196,"Scoliosis, unspecified Lumbar region",1,649
2569,L232,Allergic contact dermatitis due to cosmetics,1,650
2569,K528,Other specified noninfective gastroenteritis and colitis,1,651
2569,K564,Other impaction of intestine,1,652
2569,K602,"Anal fissure, unspecified",1,653
2569,K828,"Other specified diseases of gallbladder,Cystic Mass",1,654
2569,K829,"Disease of gallbladder, unspecified",1,655
2569,K920,"Hematemesis,UGIH",1,656
2569,L020,"Abscess face, chin, Submental, temporal, temple region",1,657
2569,L022,"Abscess trunk, abdominal wall, inguinal, back, laumbar, mons pubis, chest wall, nevel, groin, iliac, pectoral, perineum,",1,658
2569,L024,"Abscess limb, antercubital space, thigh, thumb, toe, arm, femoral, finger, web space, wrist, foot , heel, Knee, leg, axi",1,659
2569,M0609,Seronegative Rheumatoid arthritis Site unspecified,1,660
2569,L139,"Bullous disorder, unspecified",1,661
2569,M6594,"Synovitis and tenosynovitis, unspecified Hand",1,662
2569,L241,Irritant contact dermatitis due to oils and greases,1,663
2569,L252,Unspecified contact dermatitis due to dyes,1,664
2569,L308,Other specified dermatitis,1,665
2569,L502,Urticaria due to cold and heat,1,666
2569,L508,Other urticaria,1,667
2569,L598,Other specified disorders of the skin and subcutaneous tissue related to,1,668
2569,L700,Acne vulgaris,1,669
2569,L730,Acne keloid,1,670
2569,L84,"Corns and callosities,Callus,Clavus",1,671
2569,L088,Other specified local infections of the skin and subcutaneous tissue,1,672
`.trim();

export const ICD10_MAIN_2569: Icd10MainRecord[] = RAW_ICD10_MAIN_CSV.split('\n').map((line) => {
  const cols = parseCsvLine(line);
  const code = cols[1] ?? '';
  const name = cols[2] ?? '';
  const count = toNumber(cols[3]);
  const rank = toNumber(cols[4]);
  return {
    rank,
    code,
    name,
    count,
    chapter: classifyIcd10Chapter(code),
  };
});

// ชุดที่ 13: จำนวนผู้รับบริการห้องหัตถการ (14081) ประเภทฉุกเฉินและอุบัติเหตุจำแนกรายโรค (ครบทั้ง 71 รหัส)
const RAW_ICD10_14081_CSV = `
1,I10,"Essential (primary) hypertension,HT",23,3,2,2,1,4,3,3,1,4,,,
2,C541,Malignant meoplasm of endometrium,9,,,3,1,4,1,,,,,,
3,C509,"Malignant neoplasm of breast,CA breast",7,,,,,,,,,3,3,1,
4,S913,"Open wound of other parts of foot,Wound foot",7,2,3,,,1,,,,,1,,
5,E789,"Disorder of lipoprotein metabolism,",6,1,1,,,,,,1,1,1,,1
6,L031,"Cellulitis of other parts of limb,axilla, shoulder,hip,ankle, arm, foot,except toe,hand,except finger,leg,knee",6,,,,,,5,,,,1,,
7,E119,Non-insulin-dependent diabetes mell,5,,,,1,,2,,,2,,,
8,R101,"Pain localized to upper abdomen,Abdomen Pain Upper,Epigastric pain",5,1,,1,,,,,1,1,,1,
9,R42,"Dizziness and giddiness,Vertigo",4,,1,1,,,,1,1,,,,
10,M6261,Muscle strain Shoulder region,3,1,1,,,,,1,,,,,
11,M6269,Muscle strain Site unspecified,3,,,3,,,,,,,,,
12,G819,"Hemiplegia, hemiparesis ,unspecified",3,1,,,,,2,,,,,,
13,I743,Embolism and thrombosis of arteries of the lower extremities,2,,,,,2,,,,,,,
14,G560,"Carpal tunnel syndrome,CTS",2,,,,,1,,1,,,,,
15,L039,Cellulitis;chronic,2,,,,,,1,,,,1,,
16,M4319,Spondylolisthesis Site unspecified,2,,,,,,,,,,1,1,
17,E149,Diabetes mellitus,2,,,,,,,1,,1,,,
18,H813,Other peripheral vertigo,2,,,,,,1,,,1,,,
19,N390,"Urinary tract infection,UTI",2,,,,,,2,,,,,,
20,R51,Headache,2,1,,,,1,,,,,,,
21,R55,Syncope and collapse,2,,,,,,1,1,,,,,
22,S099,Unspecified injury of head,2,,1,,,,,1,,,,,
23,E876,Hypokalaemia,1,1,,,,,,,,,,,
24,I959,"Hypotension, unspecified",1,,,,,,,,,,1,,
25,I499,"Arrhythmia cardiac ,unspecified",1,,,,,,,,,,,1,
26,I251,Atherosclerotic heart disease,1,,,,,,1,,,,,,
27,H811,Benign paroxysmal vertigo,1,,,,,,,,,1,,,
28,H571,Ocular pain,1,,,,,,,,,,,,1
29,H028,Other specified disorders of eyelid,1,1,,,,,,,,,,,
30,S202,Contusion of thorax,1,,,,,,1,,,,,,
31,S662,Injury of extensor muscle and tendon of thumb at wrist and hand level,1,,,,,,1,,,,,,
32,L088,Other specified local infections of the skin and subcutaneous tissue,1,1,,,,,,,,,,,
33,F320,Mild depressive episode,1,,,1,,,,,,,,,
34,J449,"Chronic obstructive pulmonary disease, unspecified",1,1,,,,,,,,,,,
35,E875,Hyperkalaemia,1,,,,,,,,,,1,,
36,S809,"Superficial injury of lower leg, unspecified",1,,,,1,,,,,,,,
37,E785,"Hyperlipidaemia, unspecified",1,1,,,,,,,,,,,
38,S819,"Open wound of lower leg, part unspecified",1,1,,,,,,,,,,,
39,E141,D.K.A.,1,,,,,,,1,,,,,
40,S909,"Superficial injury of ankle and foot, unspecified",1,,,,,,,1,,,,,
41,T140,"Superficial injury of unspecified body region,Hematoma (Traumatic),Hematoma",1,,,,,,,1,,,,,
42,T783,Angioneurotic oedema,1,,,,,,1,,,,,,
43,B330,Epidemic myalgia,1,,1,,,,,,,,,,
44,A419,"Septicemia, unspecified",1,,,,,,,,,1,,,
45,G318,Other specified degenerative diseases of the nervous system,1,,,,1,,,,,,,,
46,L239,Allergic contact dermatitis unspecified cause,1,,,,,1,,,,,,,
47,M8100,Postmenopausal osteoporosis Multiple sites,1,1,,,,,,,,,,,
48,N946,"Dysmenorrhoea, unspecified",1,,1,,,,,,,,,,
49,M545,Low back pain,1,,,,,,,,1,,,,
50,M4807,Spinal stenosis Lumbosacral region ,1,,,,,,,,,,1,,
51,M4796,Spondylosis unspecified Lumbar region,1,,1,,,,,,,,,,
52,M4722,Other spondylosis with radiculopathy Cervical region,1,,,,,,,,1,,,,
53,R002,Palpitations,1,1,,,,,,,,,,,
54,M4307,Spondylolysis Lumbosacral region ,1,,,,,,,1,,,,,
55,M170,"Primary osteoarthritis of knee, bilateral",1,,,,,,,,,,,1,
56,M169,"Coxarthrosis,OA  Hip",1,,,,1,,,,,,,,
57,J029,"Pharyngitis, Acute pharyngitis, unspecified",1,,1,,,,,,,,,,
58,L309,"Dermatitis, unspecified",1,,,,1,,,,,,,,
59,J40,"Bronchitis, not specified as acute or chronic",1,,,,,,,,,,1,,
60,L089,"Local infection of the skin and subcutaneous tissue, unspecified",1,,1,,,,,,,,,,
61,U78100,Palpitations,1,1,,,,,,,,,,,
62,R100,Acute abdomen,1,1,,,,,,,,,,,
63,A099,Gastroenteritis and colitis of unspecified origin,1,,,,,,,,1,,,,
64,L030,"Cellulitis of finger and toe,thumb,subcuticular,periosteal,intrathecal",1,,,1,,,,,,,,,
65,L022,"Abscess trunk, abdominal wall, inguinal, back, laumbar, mons pubis, chest wall, nevel, groin, iliac, pectoral, perineum,",1,,,,,,,1,,,,,
66,K30,Dyspepsia,1,,,,,,,,,1,,,
67,K219,Gastro-oesophageal reflux disease without oesophagitis,1,1,,,,,,,,,,,
68,K031,Abrasion of teeth,1,1,,,,,,,,,,,
69,J459,"Asthma, unspecified",1,1,,,,,,,,,,,
70,M8199,"Osteoporosis, unspecified Site unspecified",1,,,,,,,1,,,,,
71,L739,"Follicular disorder, unspecified",1,1,,,,,,,,,,,
`.trim();

export const ICD10_14081_2569: Icd10ProcedureRoomRecord[] = RAW_ICD10_14081_CSV.split('\n').map((line) => {
  const cols = parseCsvLine(line);
  const no = toNumber(cols[0]);
  const code = cols[1] ?? '';
  const name = cols[2] ?? '';
  const total = toNumber(cols[3]);
  const monthly = Array.from({ length: 12 }, (_, idx) => toNumber(cols[idx + 4]));
  return {
    no,
    code,
    name,
    total,
    monthly,
    chapter: classifyIcd10Chapter(code),
  };
});
