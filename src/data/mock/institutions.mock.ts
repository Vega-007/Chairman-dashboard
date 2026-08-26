import { InstitutionSummary, CampusStats, GroupHierarchy, DepartmentSummary } from '@/lib/types/institution';
import { computePerformanceStatus } from '@/lib/utils/status';

// Helper to generate mock departments without claiming they are verified
function generateMockDepartments(instCode: string, names: string[], baseScore: number): DepartmentSummary[] {
  return names.map((name, idx) => {
    // Generate realistic deterministic variation around baseScore
    const variation = ((idx % 3) - 1) * 4.5;
    const score = Math.min(Math.max(Math.round((baseScore + variation) * 10) / 10, 52), 98);
    const facultyCount = 12 + (idx * 3) % 18;
    const studentCount = 180 + (idx * 65) % 400;

    return {
      id: `dept-${instCode.toLowerCase()}-${idx + 1}`,
      name,
      code: `${instCode}-D${idx + 1}`,
      facultyCount,
      studentCount,
      performanceScore: score,
      status: computePerformanceStatus(score, 100).status,
      is_mock: true,
    };
  });
}

export const MOCK_INSTITUTIONS: InstitutionSummary[] = [
  // ==========================================
  // CHENNAI – RAMAPURAM (7 Institutions)
  // ==========================================
  {
    id: 'eec',
    name: 'Easwari Engineering College',
    shortName: 'Easwari Engg College',
    code: 'EEC',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'Engineering College',
    departmentCount: 11,
    overallScore: 95.0,
    status: computePerformanceStatus(95.0, 100).status, // Achieved (95.0%)
    greenCount: 14,
    orangeCount: 0,
    redCount: 0,
    previousScore: 89.2,
    trendDelta: 5.8,
    topCategory: 'Placements (100%)',
    lowestCategory: 'Patents (91.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('EEC', [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication Engg',
      'Electrical & Electronics Engg',
      'Mechanical Engineering',
      'Civil Engineering',
      'Artificial Intelligence & Data Science',
      'Biomedical Engineering',
      'Robotics & Automation',
      'Computer Science & Business Systems',
      'Automobile Engineering',
    ], 88.4),
    is_mock: true,
  },
  {
    id: 'fet-rmp',
    name: 'SRM IST Faculty of Engineering & Technology – Ramapuram',
    shortName: 'SRM FET Ramapuram',
    code: 'SRMIST FET',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'Faculty',
    departmentCount: 16,
    overallScore: 92.6,
    status: computePerformanceStatus(92.6, 100).status, // Achieved (92.6%)
    greenCount: 12,
    orangeCount: 2,
    redCount: 0,
    previousScore: 89.1,
    trendDelta: 3.5,
    topCategory: 'Publications (95.4%)',
    lowestCategory: 'Consultancy (84.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('FET-RMP', [
      'School of CSE – Core & AI',
      'School of CSE – Cyber Security',
      'School of CSE – Cloud Computing',
      'School of CSE – Data Analytics',
      'Information Technology',
      'Electronics & Communication Engg',
      'Electrical & Electronics Engg',
      'Biotechnology',
      'Biomedical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Architecture & Interior Design',
      'Aerospace Engineering',
      'Robotics Engineering',
      'Computer Science & Design',
      'Humanities & Sciences',
    ], 92.6),
    is_mock: true,
  },
  {
    id: 'fsh-rmp',
    name: 'SRM FLABS Faculty of Liberal Arts and Business Studies',
    shortName: 'SRM FLABS Ramapuram',
    code: 'SRMIST FSH',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'Faculty',
    departmentCount: 6,
    overallScore: 81.2,
    status: computePerformanceStatus(81.2, 100).status, // Needs Improvement (81.2%)
    greenCount: 7,
    orangeCount: 5,
    redCount: 2,
    previousScore: 83.0,
    trendDelta: -1.8,
    topCategory: 'Admissions (94.0%)',
    lowestCategory: 'NPTEL Certs (66.2%)',
    attentionCount: 2,
    departments: generateMockDepartments('FSH-RMP', [
      'Computer Applications (BCA/MCA)',
      'Biotechnology & Biochemistry',
      'Commerce & Corporate Studies',
      'Visual Communication & Media',
      'Mathematics & Statistics',
      'English & Foreign Languages',
    ], 81.2),
    is_mock: true,
  },
  {
    id: 'fom-rmp',
    name: 'SRM IST Faculty of Management – Ramapuram',
    shortName: 'SRM FoM Ramapuram',
    code: 'SRMIST FOM',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'Faculty',
    departmentCount: 4,
    overallScore: 90.5,
    status: computePerformanceStatus(90.5, 100).status, // Achieved (90.5%)
    greenCount: 10,
    orangeCount: 3,
    redCount: 1,
    previousScore: 86.8,
    trendDelta: 3.7,
    topCategory: 'Placements (94.8%)',
    lowestCategory: 'Funded Research (78.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('FOM-RMP', [
      'Master of Business Administration (MBA)',
      'BBA Program & Analytics',
      'Executive Leadership Development',
      'Center for Financial Research',
    ], 90.5),
    is_mock: true,
  },
  {
    id: 'sead',
    name: 'SRM School of Environment, Architecture & Design (SEAD)',
    shortName: 'SRM SEAD Architecture',
    code: 'SRMIST SEAD',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'School',
    departmentCount: 3,
    overallScore: 86.0,
    status: computePerformanceStatus(86.0, 100).status, // Needs Improvement (86.0%)
    greenCount: 8,
    orangeCount: 4,
    redCount: 2,
    previousScore: 82.5,
    trendDelta: 3.5,
    topCategory: 'Design Studios (92.0%)',
    lowestCategory: 'Consultancy (70.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('SEAD', [
      'Bachelor of Architecture (B.Arch)',
      'Interior Design & Space Planning',
      'Sustainable Urban Planning & Landscape',
    ], 86.0),
    is_mock: true,
  },
  {
    id: 'sdc-rmp',
    name: 'SRM Dental College, Ramapuram',
    shortName: 'SRM Dental College',
    code: 'SRM Dental RMP',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    institutionType: 'Dental College',
    departmentCount: 13,
    overallScore: 94.1,
    status: computePerformanceStatus(94.1, 100).status, // Achieved (94.1%)
    greenCount: 13,
    orangeCount: 1,
    redCount: 0,
    previousScore: 91.8,
    trendDelta: 2.3,
    topCategory: 'Clinical Services (98.0%)',
    lowestCategory: 'Patents (84.5%)',
    attentionCount: 0,
    departments: generateMockDepartments('SDC-RMP', [
      'Conservative Dentistry & Endodontics',
      'Oral & Maxillofacial Surgery',
      'Orthodontics & Dentofacial Orthopedics',
      'Periodontics & Implantology',
      'Prosthodontics & Crown Bridge',
      'Pedodontics & Preventive Dentistry',
      'Oral Pathology & Microbiology',
      'Oral Medicine & Radiology',
      'Public Health Dentistry',
      'Anatomy & Histology',
      'Physiology & Biochemistry',
      'General Pathology & Microbiology',
      'General Surgery & Pharmacology',
    ], 94.1),
    is_mock: true,
  },
  {
    id: 'nhss',
    name: 'SRM Nightingale Higher Secondary School',
    shortName: 'SRM Nightingale HSS',
    code: 'NHSS',
    campus: 'School',
    campusDisplayName: 'West Mambalam, Chennai',
    institutionType: 'Higher Secondary School',
    departmentCount: 5,
    overallScore: 89.3,
    status: computePerformanceStatus(89.3, 100).status, // Needs Improvement (89.3%)
    greenCount: 9,
    orangeCount: 4,
    redCount: 1,
    previousScore: 87.0,
    trendDelta: 2.3,
    topCategory: 'Board Examination Results (96.5%)',
    lowestCategory: 'STEM Innovations (74.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('NHSS', [
      'Higher Secondary — Science Stream',
      'Higher Secondary — Commerce & Business',
      'Secondary School Section (Grades 9-10)',
      'Primary & Middle School Section',
      'Co-Curricular & Sports Wing',
    ], 89.3),
    is_mock: true,
  },

  // ==========================================
  // TIRUCHIRAPPALLI (12 Institutions)
  // ==========================================
  {
    id: 'fet-tcy',
    name: 'SRM IST Faculty of Engineering & Technology – Trichy',
    shortName: 'SRM FET Trichy',
    code: 'SRMIST FET TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Faculty',
    departmentCount: 8,
    overallScore: 74.5,
    status: computePerformanceStatus(74.5, 100).status, // Needs Improvement (74.5%)
    greenCount: 5,
    orangeCount: 6,
    redCount: 3,
    previousScore: 78.2,
    trendDelta: -3.7,
    topCategory: 'Admissions (86.0%)',
    lowestCategory: 'Startups Incubated (50.0%)',
    attentionCount: 2,
    departments: generateMockDepartments('FET-TCY', [
      'Computer Science & Engineering',
      'CSE – Artificial Intelligence & ML',
      'Information Technology',
      'Electronics & Communication Engg',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical & Electronics Engg',
      'Applied Science & Mathematics',
    ], 74.5),
    is_mock: true,
  },
  {
    id: 'fsh-tcy',
    name: 'SRM IST Faculty of Science and Humanities – Trichy',
    shortName: 'SRM FSH Trichy',
    code: 'SRMIST FSH TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Faculty',
    departmentCount: 6,
    overallScore: 79.8,
    status: computePerformanceStatus(79.8, 100).status, // Needs Improvement (79.8%)
    greenCount: 6,
    orangeCount: 6,
    redCount: 2,
    previousScore: 76.5,
    trendDelta: 3.3,
    topCategory: 'Teaching Outcomes (84.0%)',
    lowestCategory: 'Funded Research (64.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('FSH-TCY', [
      'Computer Science & BCA',
      'Biotechnology & Life Sciences',
      'Commerce & Accounting',
      'Media Studies & Communication',
      'Mathematics & Statistics',
      'Languages & Soft Skills',
    ], 79.8),
    is_mock: true,
  },
  {
    id: 'fom-tcy',
    name: 'SRM IST Faculty of Management – Trichy',
    shortName: 'SRM FoM Trichy',
    code: 'SRMIST FOM TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Faculty',
    departmentCount: 3,
    overallScore: 84.0,
    status: computePerformanceStatus(84.0, 100).status, // Needs Improvement (84.0%)
    greenCount: 7,
    orangeCount: 5,
    redCount: 2,
    previousScore: 80.4,
    trendDelta: 3.6,
    topCategory: 'Corporate Placements (88.0%)',
    lowestCategory: 'Consultancy (72.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('FOM-TCY', [
      'Master of Business Administration',
      'BBA Program & Marketing',
      'Executive Leadership Unit',
    ], 84.0),
    is_mock: true,
  },
  {
    id: 'ahs-tcy',
    name: 'SRMIST – Allied Health Sciences',
    shortName: 'SRMIST Allied Health',
    code: 'SRMIST AHS TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Allied Health',
    departmentCount: 7,
    overallScore: 87.6,
    status: computePerformanceStatus(87.6, 100).status, // Needs Improvement (87.6%)
    greenCount: 8,
    orangeCount: 5,
    redCount: 1,
    previousScore: 83.9,
    trendDelta: 3.7,
    topCategory: 'Clinical Training (92.5%)',
    lowestCategory: 'Publications (76.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('AHS-TCY', [
      'Medical Laboratory Technology (BMLT)',
      'Radiology & Imaging Technology',
      'Cardiac Care & Perfusion Technology',
      'Dialysis Technology',
      'Optometry & Ophthalmic Care',
      'Operation Theatre & Anaesthesia Tech',
      'Physician Assistant Program',
    ], 87.6),
    is_mock: true,
  },
  {
    id: 'ot-tcy',
    name: 'SRMIST – Occupational Therapy',
    shortName: 'SRMIST Occupational Therapy',
    code: 'SRMIST OT TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Allied Health',
    departmentCount: 2,
    overallScore: 91.0,
    status: computePerformanceStatus(91.0, 100).status, // Achieved (91.0%)
    greenCount: 11,
    orangeCount: 3,
    redCount: 0,
    previousScore: 88.0,
    trendDelta: 3.0,
    topCategory: 'Clinical Rehabilitation (96.0%)',
    lowestCategory: 'Research Publications (82.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('OT-TCY', [
      'Bachelor of Occupational Therapy (BOT)',
      'Postgraduate Neuro & Pediatric Rehab (MOT)',
    ], 91.0),
    is_mock: true,
  },
  {
    id: 'pt-tcy',
    name: 'SRMIST – Physiotherapy',
    shortName: 'SRMIST Physiotherapy',
    code: 'SRMIST PT TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Allied Health',
    departmentCount: 3,
    overallScore: 92.4,
    status: computePerformanceStatus(92.4, 100).status, // Achieved (92.4%)
    greenCount: 12,
    orangeCount: 2,
    redCount: 0,
    previousScore: 89.0,
    trendDelta: 3.4,
    topCategory: 'Sports Rehab & Ortho Clinic (97.0%)',
    lowestCategory: 'Funded Research (85.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('PT-TCY', [
      'Bachelor of Physiotherapy (BPT)',
      'MPT — Orthopaedics & Sports',
      'MPT — Neurology & Cardio-pulmonary',
    ], 92.4),
    is_mock: true,
  },
  {
    id: 'tasc',
    name: 'SRM Trichy Arts and Science College',
    shortName: 'SRM Trichy Arts & Sci',
    code: 'SRMIST TASC TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Arts & Science',
    departmentCount: 7,
    overallScore: 78.0,
    status: computePerformanceStatus(78.0, 100).status, // Needs Improvement (78.0%)
    greenCount: 6,
    orangeCount: 5,
    redCount: 3,
    previousScore: 79.5,
    trendDelta: -1.5,
    topCategory: 'Admissions Intake (88.0%)',
    lowestCategory: 'Patents Filed (50.0%)',
    attentionCount: 2,
    departments: generateMockDepartments('TASC', [
      'Computer Science & Data Analytics',
      'Commerce, Accounts & Finance',
      'Business Administration',
      'English Literature & Communication',
      'Biochemistry & Microbiology',
      'Mathematics',
      'Visual Communication',
    ], 78.0),
    is_mock: true,
  },
  {
    id: 'tsmc',
    name: 'Trichy SRM Medical College Hospital and Research Centre',
    shortName: 'Trichy SRM Medical College',
    code: 'TSMCHRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Medical College',
    departmentCount: 28,
    overallScore: 93.8,
    status: computePerformanceStatus(93.8, 100).status, // Achieved (93.8%)
    greenCount: 13,
    orangeCount: 1,
    redCount: 0,
    previousScore: 90.2,
    trendDelta: 3.6,
    topCategory: 'Hospital Inpatient & IPD (98.5%)',
    lowestCategory: 'Consultancies (82.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('TSMC', [
      'General Medicine & ICU',
      'General Surgery & OT',
      'Obstetrics & Gynaecology',
      'Paediatrics & Neonatology',
      'Orthopaedics & Trauma Center',
      'Cardiology & Interventional CathLab',
      'Neurology & Neurosurgery',
      'Nephrology & Renal Dialysis',
      'Gastroenterology',
      'Medical & Surgical Oncology',
      'Ophthalmology',
      'Oto-Rhino-Laryngology (ENT)',
      'Dermatology, Venereology & Leprosy',
      'Psychiatry & Behavioral Health',
      'Anaesthesiology & Critical Care',
      'Radiodiagnosis & Imaging',
      'Emergency Medicine & Trauma',
      'Community Medicine & Public Health',
      'Pathology & Blood Bank',
      'Microbiology & Virology',
      'Pharmacology & Therapeutics',
      'Forensic Medicine & Toxicology',
      'Physiology',
      'Anatomy',
      'Biochemistry',
      'Respiratory Medicine & Pulmonology',
      'Plastic & Reconstructive Surgery',
      'Paediatric Surgery',
    ], 93.8),
    is_mock: true,
  },
  {
    id: 'tahs',
    name: 'TSRM Allied Health Sciences',
    shortName: 'TSRM Allied Health',
    code: 'SRMIST TAHS TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Allied Health',
    departmentCount: 5,
    overallScore: 82.5,
    status: computePerformanceStatus(82.5, 100).status, // Needs Improvement (82.5%)
    greenCount: 7,
    orangeCount: 5,
    redCount: 2,
    previousScore: 78.0,
    trendDelta: 4.5,
    topCategory: 'Laboratory Internships (88.0%)',
    lowestCategory: 'Scholars Enrolled (72.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('TAHS', [
      'Clinical Medical Lab Technology',
      'Critical Care & Emergency Tech',
      'Neuro-Electrophysiology Tech',
      'Radiotherapy & Oncology Tech',
      'Blood Transfusion Technology',
    ], 82.5),
    is_mock: true,
  },
  {
    id: 'tcon',
    name: 'SRM Trichy College of Nursing',
    shortName: 'SRM Trichy Nursing',
    code: 'SRMIST TCON TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Nursing',
    departmentCount: 4,
    overallScore: 91.5,
    status: computePerformanceStatus(91.5, 100).status, // Achieved (91.5%)
    greenCount: 11,
    orangeCount: 3,
    redCount: 0,
    previousScore: 89.2,
    trendDelta: 2.3,
    topCategory: 'NCLEX/Nursing Licensure (96.0%)',
    lowestCategory: 'Patents (78.0%)',
    attentionCount: 0,
    departments: generateMockDepartments('TCON', [
      'B.Sc. Nursing Basic Program',
      'Medical-Surgical Nursing Specialty',
      'Obstetric & Gynaecological Nursing',
      'Community Health & Child Health Nursing',
    ], 91.5),
    is_mock: true,
  },
  {
    id: 'trp',
    name: 'SRM TRP Engineering College',
    shortName: 'SRM TRP Engineering',
    code: 'SRMIST TRP TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Engineering College',
    departmentCount: 8,
    overallScore: 68.2,
    status: computePerformanceStatus(68.2, 100).status, // Action Required (68.2%)
    greenCount: 3,
    orangeCount: 6,
    redCount: 5,
    previousScore: 72.0,
    trendDelta: -3.8,
    topCategory: 'NPTEL Enrollments (82.0%)',
    lowestCategory: 'Funded Research (41.7%)',
    attentionCount: 3,
    departments: generateMockDepartments('TRP', [
      'Computer Science & Engineering',
      'CSE – Artificial Intelligence & ML',
      'Information Technology',
      'Electronics & Communication Engg',
      'Electrical & Electronics Engg',
      'Mechanical Engineering',
      'Civil Engineering',
      'Science & Humanities Foundation',
    ], 68.2),
    is_mock: true,
  },
  {
    id: 'ihm-tcy',
    name: 'SRMIST – Institute of Hotel Management',
    shortName: 'SRMIST Hotel Management',
    code: 'SRMIST IHM TRC',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    institutionType: 'Hotel Management',
    departmentCount: 3,
    overallScore: 86.8,
    status: computePerformanceStatus(86.8, 100).status, // Needs Improvement (86.8%)
    greenCount: 8,
    orangeCount: 4,
    redCount: 2,
    previousScore: 84.1,
    trendDelta: 2.7,
    topCategory: 'Hospitality Internships (94.0%)',
    lowestCategory: 'Research Publications (70.0%)',
    attentionCount: 1,
    departments: generateMockDepartments('IHM-TCY', [
      'Food Production & Culinary Arts',
      'Food & Beverage Service Operations',
      'Accommodation Operations & Front Office',
    ], 86.8),
    is_mock: true,
  },
];

export function getInstitutionById(id: string): InstitutionSummary | undefined {
  return MOCK_INSTITUTIONS.find(
    (i) => i.id.toLowerCase() === id.toLowerCase() || i.code.toLowerCase() === id.toLowerCase()
  );
}

export function getDepartmentById(
  institutionId: string,
  departmentId: string
): { institution: InstitutionSummary; department: DepartmentSummary } | undefined {
  const inst = getInstitutionById(institutionId);
  if (!inst) return undefined;
  const dept = inst.departments.find(
    (d) => d.id.toLowerCase() === departmentId.toLowerCase() || d.code.toLowerCase() === departmentId.toLowerCase()
  );
  if (!dept) return undefined;
  return { institution: inst, department: dept };
}

// Campus summaries
export function getCampusStats(campus: 'Ramapuram' | 'Trichy' | 'School'): CampusStats {
  const insts = MOCK_INSTITUTIONS.filter((i) => i.campus === campus);
  const total = insts.length;
  const displayName =
    campus === 'Ramapuram'
      ? 'Chennai – Ramapuram'
      : campus === 'School'
      ? 'School'
      : 'Tiruchirappalli';
  const avgScore =
    Math.round((insts.reduce((acc, curr) => acc + curr.overallScore, 0) / total) * 10) / 10;
  const prevAvg =
    Math.round((insts.reduce((acc, curr) => acc + curr.previousScore, 0) / total) * 10) / 10;
  const trendDelta = Math.round((avgScore - prevAvg) * 10) / 10;

  const greenCount = insts.filter((i) => i.status === 'GREEN').length;
  const orangeCount = insts.filter((i) => i.status === 'ORANGE').length;
  const redCount = insts.filter((i) => i.status === 'RED').length;

  return {
    campus,
    displayName,
    totalInstitutions: total,
    overallScore: avgScore,
    status: computePerformanceStatus(avgScore, 100).status,
    greenCount,
    orangeCount,
    redCount,
    previousScore: prevAvg,
    trendDelta,
    institutions: insts,
  };
}

// Full multi-tier hierarchy
export function getInstitutionalHierarchy(): GroupHierarchy {
  const group = getGroupHealthSummary();
  const ramapuram = getCampusStats('Ramapuram');
  const trichy = getCampusStats('Trichy');

  return {
    name: 'SRM GROUP',
    overallScore: group.overallScore,
    status: computePerformanceStatus(group.overallScore, 100).status,
    totalInstitutions: group.totalInstitutions,
    campuses: [ramapuram, trichy],
  };
}

// Group health summary
export function getGroupHealthSummary(): {
  overallScore: number;
  previousScore: number;
  trendDelta: number;
  totalInstitutions: number;
  greenCount: number;
  orangeCount: number;
  redCount: number;
} {
  const total = MOCK_INSTITUTIONS.length;
  const avgScore =
    Math.round((MOCK_INSTITUTIONS.reduce((acc, curr) => acc + curr.overallScore, 0) / total) * 10) / 10;
  const prevAvg =
    Math.round((MOCK_INSTITUTIONS.reduce((acc, curr) => acc + curr.previousScore, 0) / total) * 10) / 10;
  const trendDelta = Math.round((avgScore - prevAvg) * 10) / 10;

  const greenCount = MOCK_INSTITUTIONS.filter((i) => i.status === 'GREEN').length;
  const orangeCount = MOCK_INSTITUTIONS.filter((i) => i.status === 'ORANGE').length;
  const redCount = MOCK_INSTITUTIONS.filter((i) => i.status === 'RED').length;

  return {
    overallScore: avgScore,
    previousScore: prevAvg,
    trendDelta,
    totalInstitutions: total,
    greenCount,
    orangeCount,
    redCount,
  };
}
