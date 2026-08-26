import {
  PerformanceCategorySummary,
  InstitutionCategoryPerformance,
  CategoryCampusComparison,
  AttentionItem,
} from '@/lib/types/performance';
import { MOCK_INSTITUTIONS } from './institutions.mock';
import { computePerformanceStatus } from '@/lib/utils/status';

// Helper to create category summary with deterministic status
function createCategory(
  id: string,
  code: string,
  name: string,
  slug: string,
  description: string,
  target: number,
  actual: number,
  unit: string,
  prevYearPct: number,
  displayOrder: number
): PerformanceCategorySummary {
  const result = computePerformanceStatus(actual, target);
  const trend = Math.round((result.achievementPercentage - prevYearPct) * 10) / 10;

  return {
    id,
    code,
    name,
    slug,
    description,
    target,
    actual,
    unit,
    achievementPercentage: result.achievementPercentage,
    status: result.status,
    previousYearPercentage: prevYearPct,
    trend,
    displayOrder,
    is_mock: true,
  };
}

// Single Source of Truth: 14 Performance Categories
export const MOCK_PERFORMANCE_CATEGORIES: PerformanceCategorySummary[] = [
  createCategory(
    'cat-01',
    'PUB',
    'Publication',
    'publication',
    'Scopus and WoS indexed peer-reviewed journal publications and conference proceedings',
    2800,
    2640,
    'Papers',
    88.5,
    1
  ),
  createCategory(
    'cat-02',
    'PAT',
    'Patent',
    'patent',
    'Patents filed, published, and granted across national and international IP offices',
    120,
    84,
    'Patents',
    76.0,
    2
  ),
  createCategory(
    'cat-03',
    'PROJ',
    'Funded Project',
    'funded-project',
    'Extramural research grants funded by government agencies (DST, SERB, DBT, ICMR) and industry',
    45,
    34,
    'Projects',
    68.5,
    3
  ),
  createCategory(
    'cat-04',
    'CONS',
    'Consultancy',
    'consultancy',
    'Revenue generated through corporate consultancy, testing services, and industrial projects',
    650,
    520,
    '₹ Lakhs',
    75.0,
    4
  ),
  createCategory(
    'cat-05',
    'PLACE',
    'Placement',
    'placement',
    'Percentage of eligible graduating students placed in tier-1 and marquee companies',
    100,
    91.4,
    '% Placed',
    87.2,
    5
  ),
  createCategory(
    'cat-06',
    'ADM',
    'Admission',
    'admission',
    'Percentage of sanctioned intake seats filled across undergraduate and postgraduate programs',
    100,
    94.8,
    '% Intake',
    92.1,
    6
  ),
  createCategory(
    'cat-07',
    'NPTEL',
    'NPTEL',
    'nptel',
    'NPTEL / SWAYAM online course certifications completed by faculty and students',
    4200,
    3850,
    'Certs',
    85.0,
    7
  ),
  createCategory(
    'cat-08',
    'MOU',
    'MOU',
    'mou',
    'Active Memorandums of Understanding with academic institutions, research labs, and industry partners',
    85,
    78,
    'Active MOUs',
    88.0,
    8
  ),
  createCategory(
    'cat-09',
    'COE',
    'COE',
    'coe',
    'Functional Centers of Excellence established in emerging technologies and interdisciplinary domains',
    24,
    22,
    'Centers',
    90.0,
    9
  ),
  createCategory(
    'cat-10',
    'SCH',
    'Scholars',
    'scholars',
    'Active doctoral PhD scholars enrolled under institutional supervisors',
    340,
    285,
    'Scholars',
    81.0,
    10
  ),
  createCategory(
    'cat-11',
    'START',
    'Startup',
    'startup',
    'Incubated student and faculty startups, spin-offs, and registered ventures',
    40,
    26,
    'Startups',
    58.0,
    11
  ),
  createCategory(
    'cat-12',
    'GRAD',
    'Graduation',
    'graduation',
    'Percentage of enrolled students successfully graduating within stipulated program duration',
    100,
    93.6,
    '% Passed',
    91.5,
    12
  ),
  createCategory(
    'cat-13',
    'GOUT',
    'Graduate Outcome',
    'graduate-outcome',
    'Combined metric for higher studies enrollment, competitive exams, and entrepreneurial pursuits',
    100,
    88.2,
    '% Employed',
    84.6,
    13
  ),
  createCategory(
    'cat-14',
    'FAC',
    'Faculty Performance',
    'faculty-performance',
    'Average annual faculty appraisal score across teaching, research, and institutional development',
    100,
    91.0,
    'Avg Score',
    88.4,
    14
  ),
];

// Helper: Resolve Category by ID or Slug
export function getCategoryByIdOrSlug(idOrSlug: string): PerformanceCategorySummary | undefined {
  const query = idOrSlug.toLowerCase();
  return MOCK_PERFORMANCE_CATEGORIES.find(
    (c) => c.id.toLowerCase() === query || c.slug.toLowerCase() === query || c.code.toLowerCase() === query
  );
}

// Prioritized Chairman's Attention Required Queue
export const MOCK_ATTENTION_ITEMS: AttentionItem[] = [
  // 1. RED items (Critical Action Required)
  {
    id: 'att-01',
    institutionId: 'trp',
    institutionName: 'SRM TRP Engineering College',
    institutionShortName: 'TRP Engineering',
    campus: 'Trichy',
    departmentId: 'dept-trp-1',
    departmentName: 'Computer Science & Engineering',
    categoryId: 'cat-03',
    categorySlug: 'funded-project',
    categoryName: 'Funded Project',
    categoryCode: 'PROJ',
    actual: 5,
    target: 12,
    gap: -7,
    unit: 'Projects',
    achievementPercentage: 41.7,
    status: 'RED',
    trend: -14.2,
    recommendedAction: 'Review departmental research proposal pipeline with HOD and mandate monthly DST/SERB grant submission targets.',
    is_mock: true,
  },
  {
    id: 'att-02',
    institutionId: 'trp',
    institutionName: 'SRM TRP Engineering College',
    institutionShortName: 'TRP Engineering',
    campus: 'Trichy',
    categoryId: 'cat-04',
    categorySlug: 'consultancy',
    categoryName: 'Consultancy',
    categoryCode: 'CONS',
    actual: 42,
    target: 80,
    gap: -38,
    unit: '₹ Lakhs',
    achievementPercentage: 52.5,
    status: 'RED',
    trend: -8.5,
    recommendedAction: 'Initiate industrial outreach drive with Trichy manufacturing clusters and audit faculty consultancy deliverables.',
    is_mock: true,
  },
  {
    id: 'att-03',
    institutionId: 'fet-tcy',
    institutionName: 'SRM IST Faculty of Engineering & Technology – Trichy',
    institutionShortName: 'FET Trichy',
    campus: 'Trichy',
    departmentId: 'dept-fet-tcy-1',
    departmentName: 'School of CSE – Core & AI',
    categoryId: 'cat-11',
    categorySlug: 'startup',
    categoryName: 'Startup',
    categoryCode: 'START',
    actual: 4,
    target: 8,
    gap: -4,
    unit: 'Startups',
    achievementPercentage: 50.0,
    status: 'RED',
    trend: -10.0,
    recommendedAction: 'Appoint dedicated incubation mentor and allocate seed fund grant for final-year student prototype projects.',
    is_mock: true,
  },
  {
    id: 'att-04',
    institutionId: 'tasc',
    institutionName: 'SRM Trichy Arts and Science College',
    institutionShortName: 'SRM Trichy Arts & Sci',
    campus: 'Trichy',
    categoryId: 'cat-02',
    categorySlug: 'patent',
    categoryName: 'Patent',
    categoryCode: 'PAT',
    actual: 5,
    target: 10,
    gap: -5,
    unit: 'Patents',
    achievementPercentage: 50.0,
    status: 'RED',
    trend: -6.4,
    recommendedAction: 'Organize IP drafting workshops for basic sciences faculty and subsidize attorney filing expenses.',
    is_mock: true,
  },
  {
    id: 'att-05',
    institutionId: 'fsh-rmp',
    institutionName: 'SRM FLABS Faculty of Liberal Arts and Business Studies',
    institutionShortName: 'SRM FLABS',
    campus: 'Ramapuram',
    departmentId: 'dept-fsh-rmp-2',
    departmentName: 'Department of Commerce',
    categoryId: 'cat-07',
    categorySlug: 'nptel',
    categoryName: 'NPTEL',
    categoryCode: 'NPTEL',
    actual: 430,
    target: 650,
    gap: -220,
    unit: 'Certs',
    achievementPercentage: 66.2,
    status: 'RED',
    trend: -5.1,
    recommendedAction: 'Mandate NPTEL credit transfer integration across 2nd & 3rd year core commerce curriculum.',
    is_mock: true,
  },
  {
    id: 'att-06',
    institutionId: 'trp',
    institutionName: 'SRM TRP Engineering College',
    institutionShortName: 'TRP Engineering',
    campus: 'Trichy',
    departmentId: 'dept-trp-3',
    departmentName: 'Electronics & Communication Engg',
    categoryId: 'cat-05',
    categorySlug: 'placement',
    categoryName: 'Placement',
    categoryCode: 'PLACE',
    actual: 68.4,
    target: 100,
    gap: -31.6,
    unit: '% Placed',
    achievementPercentage: 68.4,
    status: 'RED',
    trend: -4.8,
    recommendedAction: 'Deploy centralized corporate placement team for intensive technical interview bootcamps in ECE.',
    is_mock: true,
  },

  // 2. ORANGE items (Needs Improvement)
  {
    id: 'att-07',
    institutionId: 'sead',
    institutionName: 'SRM School of Environment, Architecture & Design (SEAD)',
    institutionShortName: 'SEAD Architecture',
    campus: 'Ramapuram',
    categoryId: 'cat-04',
    categorySlug: 'consultancy',
    categoryName: 'Consultancy',
    categoryCode: 'CONS',
    actual: 28,
    target: 40,
    gap: -12,
    unit: '₹ Lakhs',
    achievementPercentage: 70.0,
    status: 'ORANGE',
    trend: 1.5,
    recommendedAction: 'Partner with urban planning authorities and architectural firms for commercial design consultancy contracts.',
    is_mock: true,
  },
  {
    id: 'att-08',
    institutionId: 'fet-tcy',
    institutionName: 'SRM IST Faculty of Engineering & Technology – Trichy',
    institutionShortName: 'FET Trichy',
    campus: 'Trichy',
    departmentId: 'dept-fet-tcy-4',
    departmentName: 'Mechanical Engineering',
    categoryId: 'cat-01',
    categorySlug: 'publication',
    categoryName: 'Publication',
    categoryCode: 'PUB',
    actual: 255,
    target: 350,
    gap: -95,
    unit: 'Papers',
    achievementPercentage: 72.9,
    status: 'ORANGE',
    trend: -2.3,
    recommendedAction: 'Incentivize Scopus Q1/Q2 journal publications with seed grants for faculty authors.',
    is_mock: true,
  },
  {
    id: 'att-09',
    institutionId: 'tahs',
    institutionName: 'TSRM Allied Health Sciences',
    institutionShortName: 'TSRM Allied Health',
    campus: 'Trichy',
    categoryId: 'cat-10',
    categorySlug: 'scholars',
    categoryName: 'Scholars',
    categoryCode: 'SCH',
    actual: 18,
    target: 25,
    gap: -7,
    unit: 'Scholars',
    achievementPercentage: 72.0,
    status: 'ORANGE',
    trend: 3.2,
    recommendedAction: 'Expand PhD supervisor guide approvals and launch full-time research fellowship stipends.',
    is_mock: true,
  },

];

// Helper: Generate all 19 constituent institution performance records for a given category
export function getCategoryInstitutionBreakdown(idOrSlug: string): InstitutionCategoryPerformance[] {
  const category = getCategoryByIdOrSlug(idOrSlug) || MOCK_PERFORMANCE_CATEGORIES[0];
  
  return MOCK_INSTITUTIONS.map((inst, instIdx) => {
    let instTarget = Math.round((category.target / 19) * (0.85 + (instIdx % 5) * 0.08));
    if (category.unit.startsWith('%')) {
      instTarget = 100;
    }

    // 1. Check explicit Attention Items
    const attItem = MOCK_ATTENTION_ITEMS.find(
      (a) =>
        a.institutionId.toLowerCase() === inst.id.toLowerCase() &&
        (a.categoryId === category.id || a.categorySlug === category.slug || a.categoryCode === category.code)
    );
    if (attItem) {
      const gap = Math.round((attItem.actual - attItem.target) * 10) / 10;
      return {
        institutionId: inst.id,
        institutionName: inst.name,
        institutionShortName: inst.shortName,
        code: inst.code,
        campus: inst.campus,
        campusDisplayName: inst.campusDisplayName,
        institutionType: inst.institutionType,
        target: attItem.target,
        actual: attItem.actual,
        unit: category.unit,
        achievementPercentage: attItem.achievementPercentage,
        status: attItem.status,
        gap,
        trend: attItem.trend,
        is_mock: true,
      };
    }

    // 2. Check topCategory
    if (inst.topCategory && inst.topCategory.toLowerCase().includes(category.name.toLowerCase().slice(0, 4))) {
      const match = inst.topCategory.match(/([0-9.]+)%/);
      const pct = match ? parseFloat(match[1]) : 95.0;
      const actual = category.unit.startsWith('%') ? pct : Math.round(instTarget * (pct / 100) * 10) / 10;
      return {
        institutionId: inst.id,
        institutionName: inst.name,
        institutionShortName: inst.shortName,
        code: inst.code,
        campus: inst.campus,
        campusDisplayName: inst.campusDisplayName,
        institutionType: inst.institutionType,
        target: instTarget,
        actual,
        unit: category.unit,
        achievementPercentage: pct,
        status: 'GREEN',
        gap: Math.round((actual - instTarget) * 10) / 10,
        trend: 3.2,
        is_mock: true,
      };
    }

    // 3. Check lowestCategory
    if (inst.lowestCategory && inst.lowestCategory.toLowerCase().includes(category.name.toLowerCase().slice(0, 4))) {
      const match = inst.lowestCategory.match(/([0-9.]+)%/);
      const pct = match ? parseFloat(match[1]) : (inst.redCount > 0 ? 58.0 : 76.0);
      const actual = category.unit.startsWith('%') ? pct : Math.round(instTarget * (pct / 100) * 10) / 10;
      const status: 'GREEN' | 'ORANGE' | 'RED' = pct >= 90 ? 'GREEN' : pct >= 70 ? 'ORANGE' : 'RED';
      return {
        institutionId: inst.id,
        institutionName: inst.name,
        institutionShortName: inst.shortName,
        code: inst.code,
        campus: inst.campus,
        campusDisplayName: inst.campusDisplayName,
        institutionType: inst.institutionType,
        target: instTarget,
        actual,
        unit: category.unit,
        achievementPercentage: pct,
        status,
        gap: Math.round((actual - instTarget) * 10) / 10,
        trend: -2.8,
        is_mock: true,
      };
    }

    // 4. Deterministic assignment across 14 categories matching inst.redCount, inst.orangeCount, inst.greenCount
    const rank = (category.displayOrder * 5 + instIdx * 7) % 14;

    let pct: number;
    let status: 'GREEN' | 'ORANGE' | 'RED';

    if (rank < inst.redCount) {
      status = 'RED';
      pct = Math.round((50 + ((rank % 3) * 6.5)) * 10) / 10;
    } else if (rank < inst.redCount + inst.orangeCount) {
      status = 'ORANGE';
      const oRank = rank - inst.redCount;
      pct = Math.round((73 + (oRank * 3.2)) * 10) / 10;
    } else {
      status = 'GREEN';
      const gRank = rank - (inst.redCount + inst.orangeCount);
      pct = Math.round((90.5 + ((gRank % 4) * 2.1)) * 10) / 10;
    }

    const actual = category.unit.startsWith('%')
      ? pct
      : Math.round(instTarget * (pct / 100) * 10) / 10;

    const trend = Math.round((((category.displayOrder + instIdx) % 5) - 2) * 1.6 * 10) / 10;

    return {
      institutionId: inst.id,
      institutionName: inst.name,
      institutionShortName: inst.shortName,
      code: inst.code,
      campus: inst.campus,
      campusDisplayName: inst.campusDisplayName,
      institutionType: inst.institutionType,
      target: instTarget,
      actual,
      unit: category.unit,
      achievementPercentage: pct,
      status,
      gap: Math.round((actual - instTarget) * 10) / 10,
      trend,
      is_mock: true,
    };
  });
}

// Helper: Compute Ramapuram vs Trichy comparison for a category
export function getCategoryCampusComparison(idOrSlug: string): {
  ramapuram: CategoryCampusComparison;
  trichy: CategoryCampusComparison;
} {
  const breakdown = getCategoryInstitutionBreakdown(idOrSlug);
  const ramapuramRecords = breakdown.filter((b) => b.campus === 'Ramapuram');
  const trichyRecords = breakdown.filter((b) => b.campus === 'Trichy');

  const calcCampus = (records: InstitutionCategoryPerformance[], campus: 'Ramapuram' | 'Trichy'): CategoryCampusComparison => {
    const totalInsts = records.length;
    const totalTarget = records.reduce((acc, r) => acc + r.target, 0);
    const totalActual = records.reduce((acc, r) => acc + r.actual, 0);
    const statusRes = computePerformanceStatus(totalActual, totalTarget);
    
    return {
      campus,
      displayName: campus === 'Ramapuram' ? 'Chennai – Ramapuram' : 'Tiruchirappalli',
      totalInstitutions: totalInsts,
      actual: Math.round(totalActual * 10) / 10,
      target: Math.round(totalTarget * 10) / 10,
      achievementPercentage: statusRes.achievementPercentage,
      status: statusRes.status,
      gap: Math.round((totalActual - totalTarget) * 10) / 10,
      greenCount: records.filter((r) => r.status === 'GREEN').length,
      orangeCount: records.filter((r) => r.status === 'ORANGE').length,
      redCount: records.filter((r) => r.status === 'RED').length,
    };
  };

  return {
    ramapuram: calcCampus(ramapuramRecords, 'Ramapuram'),
    trichy: calcCampus(trichyRecords, 'Trichy'),
  };
}



// Helper: Get Attention Items filtered by campus, priority/status, category, or institution
export function getFilteredAttentionItems(filters?: {
  campus?: string;
  status?: string;
  category?: string;
  institution?: string;
}): AttentionItem[] {
  return MOCK_ATTENTION_ITEMS.filter((item) => {
    if (filters?.campus && filters.campus !== 'ALL' && item.campus !== filters.campus) {
      return false;
    }
    if (filters?.status && filters.status !== 'ALL' && item.status !== filters.status) {
      return false;
    }
    if (
      filters?.category &&
      filters.category !== 'ALL' &&
      item.categoryId !== filters.category &&
      item.categorySlug !== filters.category
    ) {
      return false;
    }
    if (
      filters?.institution &&
      filters.institution !== 'ALL' &&
      item.institutionId !== filters.institution
    ) {
      return false;
    }
    return true;
  });
}

// Helper: Get Executive Summary Stats for Attention Required page
export function getAttentionSummaryStats(): {
  redCount: number;
  orangeCount: number;
  institutionsAffectedCount: number;
  departmentsAffectedCount: number;
  criticalCategoriesCount: number;
} {
  const redItems = MOCK_ATTENTION_ITEMS.filter((i) => i.status === 'RED');
  const orangeItems = MOCK_ATTENTION_ITEMS.filter((i) => i.status === 'ORANGE');

  const instIds = new Set(MOCK_ATTENTION_ITEMS.map((i) => i.institutionId));
  const deptIds = new Set(
    MOCK_ATTENTION_ITEMS.filter((i) => i.departmentId).map((i) => i.departmentId)
  );
  const catIds = new Set(MOCK_ATTENTION_ITEMS.map((i) => i.categoryId));

  return {
    redCount: redItems.length,
    orangeCount: orangeItems.length,
    institutionsAffectedCount: instIds.size,
    departmentsAffectedCount: deptIds.size,
    criticalCategoriesCount: catIds.size,
  };
}

export function getChairmanAttentionItems(limit = 6): AttentionItem[] {
  return MOCK_ATTENTION_ITEMS.slice(0, limit);
}

export function getAttentionItemsTotalCount(): number {
  return MOCK_ATTENTION_ITEMS.length;
}
