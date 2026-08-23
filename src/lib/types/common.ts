export type PerformanceStatus = 'GREEN' | 'ORANGE' | 'RED';

export interface ThresholdConfig {
  green: number;  // Default: >= 90%
  orange: number; // Default: >= 70% and < 90%
}

export type AcademicYearOption = '2025–26' | '2024–25' | '2023–24';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  campusScope: string;
  avatarUrl?: string;
}
