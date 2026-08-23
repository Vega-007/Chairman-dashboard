import {
  MOCK_PERFORMANCE_CATEGORIES,
  MOCK_ATTENTION_ITEMS,
  getCategoryByIdOrSlug,
  getCategoryInstitutionBreakdown,
  getCategoryCampusComparison,
  getAttentionSummaryStats,
} from '@/data/mock/performance.mock';
import {
  PerformanceCategorySummary,
  InstitutionCategoryPerformance,
  CategoryCampusComparison,
  AttentionItem,
} from '@/lib/types/performance';
import { CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter, CategorySortOption } from '@/lib/types/identity';

export interface CategoryQueryOptions {
  status?: PerformanceStatus | 'ALL';
  scoreRange?: ScoreRangeFilter;
  search?: string;
  sortBy?: CategorySortOption;
}

export interface BreakdownQueryOptions {
  campus?: CampusName | 'ALL';
  status?: PerformanceStatus | 'ALL';
  scoreRange?: ScoreRangeFilter;
  search?: string;
  sortBy?: 'SCORE_DESC' | 'SCORE_ASC' | 'GAP_DESC' | 'TREND_DESC' | 'CODE';
}

export interface AttentionQueryOptions {
  campus?: CampusName | 'ALL';
  status?: PerformanceStatus | 'ALL';
  category?: string;
  institution?: string;
  search?: string;
  sortBy?: 'PRIORITY_FIRST' | 'GAP_DESC' | 'TREND_ASC' | 'SCORE_ASC';
}

/**
 * Performance Repository: query interface over performance categories, category drill-downs, and attention queue.
 */
export const performanceRepository = {
  /**
   * Get all 14 performance categories with optional filtering and sorting
   */
  getCategories(options: CategoryQueryOptions = {}): PerformanceCategorySummary[] {
    let result = [...MOCK_PERFORMANCE_CATEGORIES];

    // Status filter
    if (options.status && options.status !== 'ALL') {
      result = result.filter((c) => c.status === options.status);
    }

    // Score range filter
    if (options.scoreRange && options.scoreRange !== 'ALL') {
      switch (options.scoreRange) {
        case '90_100':
          result = result.filter((c) => c.achievementPercentage >= 90);
          break;
        case '70_89':
          result = result.filter((c) => c.achievementPercentage >= 70 && c.achievementPercentage < 90);
          break;
        case 'BELOW_70':
          result = result.filter((c) => c.achievementPercentage < 70);
          break;
      }
    }

    // Search query
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'ORDER':
          result.sort((a, b) => a.displayOrder - b.displayOrder);
          break;
        case 'ACHIEVEMENT_DESC':
          result.sort((a, b) => b.achievementPercentage - a.achievementPercentage);
          break;
        case 'ACHIEVEMENT_ASC':
          result.sort((a, b) => a.achievementPercentage - b.achievementPercentage);
          break;
        case 'GAP_DESC':
          result.sort((a, b) => (100 - b.achievementPercentage) - (100 - a.achievementPercentage));
          break;
        case 'TREND_DESC':
          result.sort((a, b) => b.trend - a.trend);
          break;
        case 'TREND_ASC':
          result.sort((a, b) => a.trend - b.trend);
          break;
        case 'CODE':
          result.sort((a, b) => a.code.localeCompare(b.code));
          break;
      }
    }

    return result;
  },

  /**
   * Get single category by ID, Slug, or Code
   */
  getCategory(idOrSlug: string): PerformanceCategorySummary | undefined {
    return getCategoryByIdOrSlug(idOrSlug);
  },

  /**
   * Get 19 constituent institutions breakdown for a category with filtering/sorting
   */
  getInstitutionBreakdown(
    idOrSlug: string,
    options: BreakdownQueryOptions = {}
  ): InstitutionCategoryPerformance[] {
    const rawBreakdown = getCategoryInstitutionBreakdown(idOrSlug);
    let result = [...rawBreakdown];

    // Campus filter
    if (options.campus && options.campus !== 'ALL') {
      result = result.filter((b) => b.campus === options.campus);
    }

    // Status filter
    if (options.status && options.status !== 'ALL') {
      result = result.filter((b) => b.status === options.status);
    }

    // Score range filter
    if (options.scoreRange && options.scoreRange !== 'ALL') {
      switch (options.scoreRange) {
        case '90_100':
          result = result.filter((b) => b.achievementPercentage >= 90);
          break;
        case '70_89':
          result = result.filter((b) => b.achievementPercentage >= 70 && b.achievementPercentage < 90);
          break;
        case 'BELOW_70':
          result = result.filter((b) => b.achievementPercentage < 70);
          break;
      }
    }

    // Search query
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.institutionName.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q) ||
          b.institutionShortName.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'SCORE_DESC':
          result.sort((a, b) => b.achievementPercentage - a.achievementPercentage);
          break;
        case 'SCORE_ASC':
          result.sort((a, b) => a.achievementPercentage - b.achievementPercentage);
          break;
        case 'GAP_DESC':
          result.sort((a, b) => a.gap - b.gap); // largest negative gap first
          break;
        case 'TREND_DESC':
          result.sort((a, b) => b.trend - a.trend);
          break;
        case 'CODE':
          result.sort((a, b) => a.code.localeCompare(b.code));
          break;
      }
    }

    return result;
  },

  /**
   * Get head-to-head campus comparison for a category
   */
  getCampusComparison(idOrSlug: string): {
    ramapuram: CategoryCampusComparison;
    trichy: CategoryCampusComparison;
  } {
    return getCategoryCampusComparison(idOrSlug);
  },

  /**
   * Get prioritized Chairman Attention queue with multi-field filtering and strict priority sorting
   */
  getAttentionItems(options: AttentionQueryOptions = {}): AttentionItem[] {
    let result = [...MOCK_ATTENTION_ITEMS];

    // Campus filter
    if (options.campus && options.campus !== 'ALL') {
      result = result.filter((i) => i.campus === options.campus);
    }

    // Status filter
    if (options.status && options.status !== 'ALL') {
      result = result.filter((i) => i.status === options.status);
    }

    // Category filter
    if (options.category && options.category !== 'ALL') {
      result = result.filter(
        (i) => i.categoryId === options.category || i.categorySlug === options.category
      );
    }

    // Institution filter
    if (options.institution && options.institution !== 'ALL') {
      result = result.filter((i) => i.institutionId === options.institution);
    }

    // Search query
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.institutionName.toLowerCase().includes(q) ||
          i.categoryName.toLowerCase().includes(q) ||
          i.categoryCode.toLowerCase().includes(q) ||
          (i.departmentName && i.departmentName.toLowerCase().includes(q)) ||
          i.recommendedAction.toLowerCase().includes(q)
      );
    }

    // Strict executive priority sorting: RED -> ORANGE -> GREEN; largest deficit gap -> negative trend -> lowest score
    const statusRank: Record<PerformanceStatus, number> = { RED: 0, ORANGE: 1, GREEN: 2 };

    const sortStrategy = options.sortBy || 'PRIORITY_FIRST';

    result.sort((a, b) => {
      if (sortStrategy === 'PRIORITY_FIRST') {
        if (statusRank[a.status] !== statusRank[b.status]) {
          return statusRank[a.status] - statusRank[b.status];
        }
        if (a.gap !== b.gap) {
          return a.gap - b.gap; // largest deficit first (e.g. -38 before -7)
        }
        if (a.trend !== b.trend) {
          return a.trend - b.trend; // most negative trend first
        }
        return a.achievementPercentage - b.achievementPercentage;
      }

      if (sortStrategy === 'GAP_DESC') {
        return a.gap - b.gap;
      }

      if (sortStrategy === 'TREND_ASC') {
        return a.trend - b.trend;
      }

      if (sortStrategy === 'SCORE_ASC') {
        return a.achievementPercentage - b.achievementPercentage;
      }

      return 0;
    });

    return result;
  },

  /**
   * Get Executive summary stats for Action Center
   */
  getAttentionStats() {
    return getAttentionSummaryStats();
  },
};
