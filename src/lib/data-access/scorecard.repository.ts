import { MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { MOCK_PERFORMANCE_CATEGORIES, getCategoryInstitutionBreakdown } from '@/data/mock/performance.mock';
import {
  InstitutionCategoryDetail,
  DepartmentCategoryMetric,
  MetricHighlight,
  YearComparisonMetric,
} from '@/lib/types/performance';

/**
 * Scorecard Repository: provides detailed category & department analytics
 * for an institution scorecard view.
 *
 * Strictly adheres to DATA INTEGRITY requirements:
 * - NO hallucinated data
 * - NO modeled values
 * - NO fabricated metrics
 * - Objects calculated using direct objectively valid formulas are labeled as "(Calculated)"
 * - Missing mock fields display "Not available" or "Department-level data unavailable"
 */
export const scorecardRepository = {
  /**
   * Get all 14 Key Performance Categories for a specific institution.
   * Uses only the canonical getCategoryInstitutionBreakdown from the mock data.
   */
  getInstitutionCategories(institutionId: string): InstitutionCategoryDetail[] {
    const institution = MOCK_INSTITUTIONS.find(
      (i) => i.id.toLowerCase() === institutionId.toLowerCase() || i.code.toLowerCase() === institutionId.toLowerCase()
    );

    if (!institution) {
      return [];
    }

    const totalFaculty = institution.departments.reduce((acc, d) => acc + d.facultyCount, 0);

    return MOCK_PERFORMANCE_CATEGORIES.map((cat) => {
      // Fetch the canonical mock breakdown for this category
      const breakdown = getCategoryInstitutionBreakdown(cat.id);
      const row = breakdown.find((b) => b.institutionId === institution.id);

      const target = row ? row.target : cat.target;
      const actual = row ? row.actual : cat.actual;
      const achievementPercentage = row ? row.achievementPercentage : cat.achievementPercentage;
      const status = row ? row.status : cat.status;
      const trend = row ? row.trend : cat.trend;

      // Primary highlights matrix matching data availability
      const highlights: MetricHighlight[] = [];
      let yearComparison: YearComparisonMetric[] | undefined = undefined;

      switch (cat.code) {
        case 'PUB': {
          // Objective calculation from existing actual publications and faculty counts
          const perCapita = (actual / Math.max(1, totalFaculty)).toFixed(2);
          highlights.push(
            { label: 'Per Capita', value: `${perCapita} papers/faculty`, note: '(Calculated)' },
            { label: 'Zero-Pub Faculty', value: 'Not available' },
            { label: 'Scopus / WoS Indexed', value: 'Not available' }
          );
          break;
        }
        case 'PAT': {
          highlights.push(
            { label: 'Patents Published', value: 'Not available' },
            { label: 'Patents Granted', value: 'Not available' },
            { label: 'Zero-Faculty Patents', value: 'Not available' }
          );
          break;
        }
        case 'PROJ': {
          highlights.push(
            { label: 'Total Grant Value', value: 'Not available' },
            { label: 'Proposals Submitted', value: 'Not available' }
          );
          break;
        }
        case 'CONS': {
          highlights.push(
            { label: 'Active Corporate Clients', value: 'Not available' },
            { label: 'Zero-Consultancy Faculty', value: 'Not available' }
          );
          break;
        }
        case 'PLACE': {
          highlights.push(
            { label: 'Eligible Students', value: 'Not available' },
            { label: 'Students Placed', value: 'Not available' }
          );
          break;
        }
        case 'ADM': {
          highlights.push(
            { label: 'Sanctioned Intake', value: 'Not available' },
            { label: 'Seats Filled', value: 'Not available' }
          );
          break;
        }
        case 'NPTEL': {
          highlights.push(
            { label: 'Faculty Certifications', value: 'Not available' },
            { label: 'Student Certifications', value: 'Not available' }
          );
          break;
        }
        case 'MOU': {
          highlights.push(
            { label: 'Industry Collaborations', value: 'Not available' },
            { label: 'International MOUs', value: 'Not available' }
          );
          break;
        }
        case 'COE': {
          highlights.push(
            { label: 'Industry-Backed CoEs', value: 'Not available' },
            { label: 'Active Seed Grants', value: 'Not available' }
          );
          break;
        }
        case 'SCH': {
          highlights.push(
            { label: 'Approved PhD Guides', value: 'Not available' },
            { label: 'Faculty Holding PhD', value: 'Not available' }
          );
          break;
        }
        case 'START': {
          highlights.push(
            { label: 'Seed-Funded Ventures', value: 'Not available' },
            { label: 'IPs Commercialized', value: 'Not available' }
          );
          break;
        }
        case 'GRAD': {
          // Comparisons not available in the current mock data
          yearComparison = [
            { ay: '2023–24', value: 0, unit: 'Not available' },
            { ay: '2024–25', value: 0, unit: 'Not available' },
            { ay: '2025–26 (Current)', value: actual, unit: '%' },
          ];
          highlights.push(
            { label: 'Distinction / First Class', value: 'Not available' }
          );
          break;
        }
        case 'GOUT': {
          highlights.push(
            { label: 'Higher Studies Share', value: 'Not available' },
            { label: 'Employment Share', value: 'Not available' }
          );
          break;
        }
        case 'FAC': {
          highlights.push(
            { label: 'Appraisals Completed', value: 'Not available' },
            { label: 'Teaching Quality Score', value: 'Not available' }
          );
          break;
        }
      }

      return {
        id: cat.id,
        code: cat.code,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        target,
        actual,
        unit: cat.unit,
        achievementPercentage,
        status,
        trend,
        displayOrder: cat.displayOrder,
        highlights,
        yearComparison,
      };
    });
  },

  /**
   * Get department-level breakdown for a specific category across all
   * constituent departments of an institution.
   *
   * Only returns department breakdown for "Overall Score" since parameter-level
   * department mock data is unavailable in the dataset.
   */
  getDepartmentCategoryPerformance(
    institutionId: string,
    categoryIdOrSlug?: string
  ): {
    category?: InstitutionCategoryDetail;
    departments: DepartmentCategoryMetric[];
    isOverall: boolean;
    isUnavailable: boolean;
  } {
    const institution = MOCK_INSTITUTIONS.find(
      (i) => i.id.toLowerCase() === institutionId.toLowerCase() || i.code.toLowerCase() === institutionId.toLowerCase()
    );

    if (!institution) {
      return { departments: [], isOverall: true, isUnavailable: false };
    }

    const allCategories = this.getInstitutionCategories(institution.id);
    const selectedCat = categoryIdOrSlug && categoryIdOrSlug !== 'all'
      ? allCategories.find(
          (c) =>
            c.id.toLowerCase() === categoryIdOrSlug.toLowerCase() ||
            c.slug.toLowerCase() === categoryIdOrSlug.toLowerCase() ||
            c.code.toLowerCase() === categoryIdOrSlug.toLowerCase()
        )
      : undefined;

    // Parameter-specific department breakdown is not available in mock data
    if (selectedCat) {
      return {
        category: selectedCat,
        departments: [],
        isOverall: false,
        isUnavailable: true,
      };
    }

    // Return the actual department-level overall scores
    const departments: DepartmentCategoryMetric[] = institution.departments.map((dept) => {
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        departmentCode: dept.code,
        facultyCount: dept.facultyCount,
        studentCount: dept.studentCount,
        target: 100,
        actual: dept.performanceScore,
        unit: '%',
        achievementPercentage: dept.performanceScore,
        status: dept.status,
        trend: 'Not available',
        openVacancies: 'Not available',
        sanctionedFaculty: 'Not available',
      };
    });

    return {
      departments,
      isOverall: true,
      isUnavailable: false,
    };
  },
};
