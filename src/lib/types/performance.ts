import { PerformanceStatus } from './common';
import { CampusName } from './institution';

export interface PerformanceCategorySummary {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  target: number;
  actual: number;
  unit: string;
  achievementPercentage: number;
  status: PerformanceStatus;
  previousYearPercentage: number;
  trend: number;
  displayOrder: number;
  is_mock: true;
}

export interface InstitutionCategoryPerformance {
  institutionId: string;
  institutionName: string;
  institutionShortName: string;
  code: string;
  campus: CampusName;
  campusDisplayName: string;
  institutionType: string;
  target: number;
  actual: number;
  unit: string;
  achievementPercentage: number;
  status: PerformanceStatus;
  gap: number;
  trend: number;
  is_mock: true;
}

export interface CategoryCampusComparison {
  campus: CampusName;
  displayName: string;
  totalInstitutions: number;
  actual: number;
  target: number;
  achievementPercentage: number;
  status: PerformanceStatus;
  gap: number;
  greenCount: number;
  orangeCount: number;
  redCount: number;
}

export interface AttentionItem {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionShortName: string;
  campus: CampusName;
  departmentId?: string;
  departmentName?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  categoryCode: string;
  target: number;
  actual: number;
  unit: string;
  achievementPercentage: number;
  status: PerformanceStatus;
  gap: number;
  trend: number;
  recommendedAction: string;
  is_mock: true;
}

export interface GroupHealthSummary {
  overallScore: number;
  status: PerformanceStatus;
  academicYear: string;
  totalInstitutions: number;
  greenCount: number;
  orangeCount: number;
  redCount: number;
  previousScore: number;
  trendDelta: number;
}

export interface MetricHighlight {
  label: string;
  value: string | number;
  note?: string;
}

export interface YearComparisonMetric {
  ay: string;
  value: number;
  unit?: string;
}

export interface InstitutionCategoryDetail {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  target: number;
  actual: number | string;
  unit: string;
  achievementPercentage: number | string;
  status: PerformanceStatus;
  trend: number;
  displayOrder: number;
  highlights: MetricHighlight[];
  yearComparison?: YearComparisonMetric[];
}

export interface DepartmentCategoryMetric {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  facultyCount: number;
  studentCount: number;
  target: number | string;
  actual: number | string;
  unit: string;
  achievementPercentage: number | string;
  status: PerformanceStatus;
  trend: number | string;
  openVacancies?: number | string;
  sanctionedFaculty?: number | string;
}
