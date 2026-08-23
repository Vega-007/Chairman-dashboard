import { PerformanceStatus } from './common';

export type CampusName = 'Ramapuram' | 'Trichy' | 'School';

export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
  facultyCount: number;
  studentCount: number;
  performanceScore: number;
  status: PerformanceStatus;
  is_mock: true;
}

export interface InstitutionSummary {
  id: string;
  name: string;
  shortName: string;
  code: string;
  campus: CampusName;
  campusDisplayName: string; // 'Chennai – Ramapuram' | 'Tiruchirappalli'
  institutionType: string;
  departmentCount: number;
  overallScore: number;
  status: PerformanceStatus;
  greenCount: number;
  orangeCount: number;
  redCount: number;
  previousScore: number;
  trendDelta: number;
  departments: DepartmentSummary[];
  topCategory?: string;
  lowestCategory?: string;
  attentionCount?: number;
  is_mock: true;
}

export interface CampusStats {
  campus: CampusName;
  displayName: string;
  totalInstitutions: number;
  overallScore: number;
  status: PerformanceStatus;
  greenCount: number;
  orangeCount: number;
  redCount: number;
  previousScore: number;
  trendDelta: number;
  institutions: InstitutionSummary[];
}

export interface GroupHierarchy {
  name: string;
  overallScore: number;
  status: PerformanceStatus;
  totalInstitutions: number;
  campuses: CampusStats[];
}
