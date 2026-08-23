import {
  MOCK_INSTITUTIONS,
  getCampusStats,
  getGroupHealthSummary,
  getInstitutionalHierarchy,
} from '@/data/mock/institutions.mock';
import { getInstitutionIdentity } from '@/data/mock/institution-identities';
import {
  InstitutionSummary,
  CampusStats,
  GroupHierarchy,
  DepartmentSummary,
  CampusName,
} from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter, InstitutionSortOption } from '@/lib/types/identity';

export interface InstitutionQueryOptions {
  campus?: CampusName | 'ALL';
  status?: PerformanceStatus | 'ALL';
  scoreRange?: ScoreRangeFilter;
  search?: string;
  sortBy?: InstitutionSortOption;
}

export interface InstitutionQueryResult {
  items: InstitutionSummary[];
  total: number;
  greenCount: number;
  orangeCount: number;
  redCount: number;
  averageScore: number;
}

/**
 * Institutions Repository: query interface over institutional data.
 * When Supabase/backend is introduced, only this layer needs to be updated.
 */
export const institutionsRepository = {
  /**
   * Get all 19 constituent institutions
   */
  getAll(): InstitutionSummary[] {
    return MOCK_INSTITUTIONS;
  },

  /**
   * Get a single institution by ID or Code
   */
  getById(idOrCode: string): InstitutionSummary | undefined {
    const query = idOrCode.toLowerCase();
    return MOCK_INSTITUTIONS.find(
      (i) => i.id.toLowerCase() === query || i.code.toLowerCase() === query
    );
  },

  /**
   * Get all institutions for a specific campus
   */
  getByCampus(campus: CampusName): InstitutionSummary[] {
    return MOCK_INSTITUTIONS.filter((i) => i.campus === campus);
  },

  /**
   * Search institutions by keyword across name, code, shortName, type, and departments
   */
  search(queryStr: string): InstitutionSummary[] {
    const q = queryStr.trim().toLowerCase();
    if (!q) return MOCK_INSTITUTIONS;

    return MOCK_INSTITUTIONS.filter((inst) => {
      if (inst.name.toLowerCase().includes(q)) return true;
      if (inst.code.toLowerCase().includes(q)) return true;
      if (inst.shortName.toLowerCase().includes(q)) return true;
      if (inst.institutionType.toLowerCase().includes(q)) return true;
      if (inst.campusDisplayName.toLowerCase().includes(q)) return true;
      if (inst.departments.some((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    });
  },

  /**
   * Generalized query function with filtering and sorting
   */
  query(options: InstitutionQueryOptions = {}): InstitutionQueryResult {
    let result = [...MOCK_INSTITUTIONS];

    // 1. Campus filter
    if (options.campus && options.campus !== 'ALL') {
      result = result.filter((i) => i.campus === options.campus);
    }

    // 2. Status filter
    if (options.status && options.status !== 'ALL') {
      result = result.filter((i) => i.status === options.status);
    }

    // 3. Score range filter
    if (options.scoreRange && options.scoreRange !== 'ALL') {
      switch (options.scoreRange) {
        case '90_100':
          result = result.filter((i) => i.overallScore >= 90);
          break;
        case '70_89':
          result = result.filter((i) => i.overallScore >= 70 && i.overallScore < 90);
          break;
        case 'BELOW_70':
          result = result.filter((i) => i.overallScore < 70);
          break;
      }
    }

    // 4. Search query
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter((inst) => {
        return (
          inst.name.toLowerCase().includes(q) ||
          inst.code.toLowerCase().includes(q) ||
          inst.shortName.toLowerCase().includes(q) ||
          inst.institutionType.toLowerCase().includes(q) ||
          inst.departments.some((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
        );
      });
    }

    // 5. Sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'SCORE_DESC':
          result.sort((a, b) => b.overallScore - a.overallScore);
          break;
        case 'SCORE_ASC':
          result.sort((a, b) => a.overallScore - b.overallScore);
          break;
        case 'GAP_DESC':
          result.sort((a, b) => (100 - b.overallScore) - (100 - a.overallScore));
          break;
        case 'IMPROVED_DESC':
          result.sort((a, b) => b.trendDelta - a.trendDelta);
          break;
        case 'DECLINED_DESC':
          result.sort((a, b) => a.trendDelta - b.trendDelta);
          break;
        case 'ATTENTION_FIRST':
          result.sort((a, b) => {
            const rank = { RED: 0, ORANGE: 1, GREEN: 2 };
            if (rank[a.status] !== rank[b.status]) {
              return rank[a.status] - rank[b.status];
            }
            return a.overallScore - b.overallScore;
          });
          break;
        case 'CODE_ASC':
          result.sort((a, b) => a.code.localeCompare(b.code));
          break;
        case 'NAME_ASC':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    const greenCount = result.filter((i) => i.status === 'GREEN').length;
    const orangeCount = result.filter((i) => i.status === 'ORANGE').length;
    const redCount = result.filter((i) => i.status === 'RED').length;
    const avgScore =
      result.length > 0
        ? Math.round((result.reduce((acc, curr) => acc + curr.overallScore, 0) / result.length) * 10) / 10
        : 0;

    return {
      items: result,
      total: result.length,
      greenCount,
      orangeCount,
      redCount,
      averageScore: avgScore,
    };
  },

  /**
   * Get campus aggregate statistics
   */
  getCampusStats(campus: CampusName): CampusStats {
    return getCampusStats(campus);
  },

  /**
   * Get full multi-tier group hierarchy
   */
  getHierarchy(): GroupHierarchy {
    return getInstitutionalHierarchy();
  },

  /**
   * Get Group health overview summary
   */
  getGroupHealthSummary() {
    return getGroupHealthSummary();
  },

  /**
   * Get department details with parent institution
   */
  getDepartmentById(
    institutionId: string,
    departmentId: string
  ): { institution: InstitutionSummary; department: DepartmentSummary } | undefined {
    const inst = this.getById(institutionId);
    if (!inst) return undefined;
    const dept = inst.departments.find(
      (d) => d.id.toLowerCase() === departmentId.toLowerCase() || d.code.toLowerCase() === departmentId.toLowerCase()
    );
    if (!dept) return undefined;
    return { institution: inst, department: dept };
  },

  /**
   * Get canonical identity
   */
  getIdentity(idOrCode: string) {
    return getInstitutionIdentity(idOrCode);
  },
};
