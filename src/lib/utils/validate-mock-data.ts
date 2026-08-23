import { MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { INSTITUTION_IDENTITIES } from '@/data/mock/institution-identities';
import { MOCK_PERFORMANCE_CATEGORIES, MOCK_ATTENTION_ITEMS } from '@/data/mock/performance.mock';

export interface ValidationReport {
  isValid: boolean;
  institutionCount: number;
  categoryCount: number;
  attentionItemCount: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validates mock dataset integrity, relationships, and identity mappings across the MIS.
 * Fails fast and reports diagnostics if any inconsistency is detected.
 */
export function validateMockData(): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validate Institution Identities vs Institutions Mock
  const identityIds = Object.keys(INSTITUTION_IDENTITIES);
  const mockInstIds = MOCK_INSTITUTIONS.map((i) => i.id);

  if (mockInstIds.length !== 19) {
    errors.push(`Expected exactly 19 institutions in MOCK_INSTITUTIONS, found ${mockInstIds.length}`);
  }

  if (identityIds.length !== 19) {
    errors.push(`Expected exactly 19 institutions in INSTITUTION_IDENTITIES, found ${identityIds.length}`);
  }

  // Check for duplicate IDs or Codes
  const seenIds = new Set<string>();
  const seenCodes = new Set<string>();

  for (const inst of MOCK_INSTITUTIONS) {
    if (seenIds.has(inst.id)) {
      errors.push(`Duplicate institution ID detected: "${inst.id}"`);
    }
    seenIds.add(inst.id);

    if (seenCodes.has(inst.code)) {
      errors.push(`Duplicate institution code detected: "${inst.code}"`);
    }
    seenCodes.add(inst.code);

    // Verify identity exists
    const identity = INSTITUTION_IDENTITIES[inst.id];
    if (!identity) {
      errors.push(`Institution ID "${inst.id}" is missing from INSTITUTION_IDENTITIES`);
    } else {
      if (identity.code !== inst.code) {
        errors.push(`Code mismatch for "${inst.id}": Identity has "${identity.code}", Mock has "${inst.code}"`);
      }
      if (identity.campus !== inst.campus) {
        errors.push(`Campus mismatch for "${inst.id}": Identity has "${identity.campus}", Mock has "${inst.campus}"`);
      }
    }

    // Verify score range & status
    if (inst.overallScore < 0 || inst.overallScore > 100) {
      errors.push(`Invalid score for "${inst.id}": ${inst.overallScore}`);
    }

    if (!['GREEN', 'ORANGE', 'RED'].includes(inst.status)) {
      errors.push(`Invalid status for "${inst.id}": "${inst.status}"`);
    }

    // Verify departments
    if (!inst.departments || inst.departments.length === 0) {
      warnings.push(`Institution "${inst.id}" has no constituent departments`);
    }
  }

  // 2. Validate Performance Categories
  if (MOCK_PERFORMANCE_CATEGORIES.length !== 14) {
    errors.push(`Expected exactly 14 performance categories, found ${MOCK_PERFORMANCE_CATEGORIES.length}`);
  }

  const categoryIds = new Set(MOCK_PERFORMANCE_CATEGORIES.map((c) => c.id));
  const categorySlugs = new Set(MOCK_PERFORMANCE_CATEGORIES.map((c) => c.slug));

  // 3. Validate Attention Items
  for (const item of MOCK_ATTENTION_ITEMS) {
    if (!seenIds.has(item.institutionId)) {
      errors.push(`Attention item "${item.id}" references nonexistent institutionId: "${item.institutionId}"`);
    }

    if (!categoryIds.has(item.categoryId)) {
      errors.push(`Attention item "${item.id}" references nonexistent categoryId: "${item.categoryId}"`);
    }

    if (!categorySlugs.has(item.categorySlug)) {
      errors.push(`Attention item "${item.id}" references nonexistent categorySlug: "${item.categorySlug}"`);
    }

    if (item.departmentId) {
      const inst = MOCK_INSTITUTIONS.find((i) => i.id === item.institutionId);
      const dept = inst?.departments.find((d) => d.id === item.departmentId);
      if (!dept) {
        warnings.push(`Attention item "${item.id}" references departmentId "${item.departmentId}" not found in institution "${item.institutionId}"`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    institutionCount: MOCK_INSTITUTIONS.length,
    categoryCount: MOCK_PERFORMANCE_CATEGORIES.length,
    attentionItemCount: MOCK_ATTENTION_ITEMS.length,
    errors,
    warnings,
  };
}
