import { MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { MOCK_PERFORMANCE_CATEGORIES, getCategoryInstitutionBreakdown } from '@/data/mock/performance.mock';
import { getFacultyBreakdown } from '@/data/mock/faculty-performance.mock';
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
          highlights.push(
            { label: 'Per Capita', value: 'Not available' },
            { label: 'Zero-Faculty Participation', value: 'Not available' },
            { label: 'Student / Other Publications', value: 'Not available' }
          );
          break;
        }
        case 'PAT': {
          highlights.push(
            { label: 'Zero-Faculty Participation', value: 'Not available' },
            { label: 'Patents Published / Granted', value: 'Not available' }
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
            { label: 'Zero-Faculty Participation', value: 'Not available' },
            { label: 'Active Corporate Clients', value: 'Not available' }
          );
          break;
        }
        case 'PLACE': {
          highlights.push(
            { label: 'Placement Percentage', value: `${actual}%` },
            { label: 'Eligible Students', value: 'Not available' },
            { label: 'Students Placed', value: 'Not available' }
          );
          break;
        }
        case 'ADM': {
          highlights.push(
            { label: 'Admission Percentage', value: `${actual}%` },
            { label: 'Sanctioned Intake', value: 'Not available' },
            { label: 'Seats Filled', value: 'Not available' }
          );
          break;
        }
        case 'NPTEL': {
          highlights.push(
            { label: 'Not Done / Incomplete', value: 'Not available' },
            { label: 'Zero-Faculty Participation', value: 'Not available' },
            { label: 'Faculty / Student Certifications', value: 'Not available' }
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
            { label: 'Total Faculty with PhD', value: 'Not available' },
            { label: 'PhD Guideship / Supervisors', value: 'Not available' }
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
          yearComparison = [
            { ay: '2023–24', value: 0, unit: 'Not available' },
            { ay: '2024–25', value: 0, unit: 'Not available' },
            { ay: '2025–26 (Current)', value: actual, unit: '%' },
          ];
          highlights.push(
            { label: 'Academic-Year Comparison', value: 'Available in Trend Table' },
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
            { label: 'Sanctioned / Total Vacancies', value: 'Not available' },
            { label: 'Department Open Vacancies', value: 'Not available' },
            { label: 'Appraisals Completed', value: 'Not available' }
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

    // Map constituent departments without inventing parameter-level scores
    const constituentDepartments: DepartmentCategoryMetric[] = institution.departments.map((dept) => {
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        departmentCode: dept.code,
        facultyCount: dept.facultyCount,
        studentCount: dept.studentCount,
        target: selectedCat ? selectedCat.target : 100,
        actual: selectedCat ? 'Not available' : dept.performanceScore,
        unit: selectedCat ? selectedCat.unit : '%',
        achievementPercentage: selectedCat ? 'Not available' : dept.performanceScore,
        status: dept.status,
        trend: 'Not available',
        openVacancies: 'Not available',
        sanctionedFaculty: 'Not available',
      };
    });

    // Parameter-specific department breakdown is not available in mock data
    if (selectedCat) {
      return {
        category: selectedCat,
        departments: constituentDepartments,
        isOverall: false,
        isUnavailable: true,
      };
    }

    return {
      departments: constituentDepartments,
      isOverall: true,
      isUnavailable: false,
    };
  },

  /**
   * Get faculty-level breakdown for a specific department and category.
   */
  getFacultyCategoryPerformance(institutionId: string, departmentId: string, categoryId: string) {
    return getFacultyBreakdown(institutionId, departmentId, categoryId);
  }
};
