import { PerformanceStatus } from '@/lib/types/common';

export interface FacultyMetric {
  facultyId: string;
  name: string;
  designation: string;
  metricValue: number;
  zeroCountIndicator: boolean;
  status: PerformanceStatus;
}

export interface DepartmentFacultyBreakdown {
  departmentId: string;
  categoryId: string;
  facultyMetrics: FacultyMetric[];
  isUnavailable: boolean; // Set to true if faculty data for this metric isn't supported
}

/**
 * Deterministic generation of faculty metrics.
 * Provides rich mock data for PUB (Publications) and PAT (Patents).
 * Marks other categories as unavailable to demonstrate gracefully handling missing data.
 */
export const getFacultyBreakdown = (
  institutionId: string,
  departmentId: string,
  categoryId: string,
  totalFacultyCount: number = 10
): DepartmentFacultyBreakdown => {
  // Only PUB and PAT are fully supported in this mock data
  const supportedCategories = ['cat-01', 'cat-02'];
  const isSupported = supportedCategories.includes(categoryId);

  if (!isSupported || totalFacultyCount === 0) {
    return {
      departmentId,
      categoryId,
      facultyMetrics: [],
      isUnavailable: true,
    };
  }

  // Create a seeded random-like deterministic output based on dept + category length
  const seed = (departmentId.length + categoryId.length) * (institutionId.length || 1);
  const facultyMetrics: FacultyMetric[] = [];

  const firstNames = ['Anand', 'Priya', 'Karthik', 'Lakshmi', 'Ramesh', 'Sanjay', 'Meera', 'Vikram', 'Neha', 'Arjun', 'Divya', 'Surya', 'Aarti', 'Ganesh', 'Vandana'];
  const lastNames = ['Kumar', 'Natarajan', 'Krishnan', 'Iyer', 'Menon', 'Rao', 'Reddy', 'Patel', 'Sharma', 'Nair', 'Pillai', 'Ram', 'Raj'];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor'];

  for (let i = 0; i < totalFacultyCount; i++) {
    // Deterministic selection
    const fnIndex = (seed + i * 3) % firstNames.length;
    const lnIndex = (seed + i * 7) % lastNames.length;
    const desigIndex = (seed + i * 2) % designations.length;
    
    let metricValue = 0;
    
    if (categoryId === 'cat-01') {
      // Publications: 0 to 8
      metricValue = (seed + i * 11) % 9; 
    } else if (categoryId === 'cat-02') {
      // Patents: mostly 0, 1, or 2
      metricValue = (seed + i * 13) % 4 === 0 ? ((seed + i) % 3) : 0;
    }

    const zeroCountIndicator = metricValue === 0;

    // Status logic (varies by category, standardizing here for mock simplicity)
    let status: PerformanceStatus = 'GREEN';
    if (categoryId === 'cat-01') {
      if (metricValue >= 4) status = 'GREEN';
      else if (metricValue > 0) status = 'ORANGE';
      else status = 'RED';
    } else if (categoryId === 'cat-02') {
      if (metricValue > 0) status = 'GREEN';
      else status = 'ORANGE'; // Patents are harder, so 0 is orange instead of red for average faculty
    }

    facultyMetrics.push({
      facultyId: `fac-${departmentId}-${i + 1}`,
      name: `Dr. ${firstNames[fnIndex]} ${lastNames[lnIndex]}`,
      designation: designations[desigIndex],
      metricValue,
      zeroCountIndicator,
      status,
    });
  }

  // Sort by highest value first
  facultyMetrics.sort((a, b) => b.metricValue - a.metricValue);

  return {
    departmentId,
    categoryId,
    facultyMetrics,
    isUnavailable: false,
  };
};
