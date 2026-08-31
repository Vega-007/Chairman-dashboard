import {
  BarChart2,
  ClipboardCheck,
  FlaskConical,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  ChefHat,
  BookOpen,
  Building2,
  Microscope,
  Store,
  Home,
  Bus,
  type LucideIcon
} from 'lucide-react';

export type PortalCategory = 'ACADEMIC' | 'BUSINESS_UNIT';
export type PortalStatus = 'LIVE' | 'COMING_SOON';
export type PortalAccent =
  | 'royal-blue'
  | 'violet'
  | 'amber'
  | 'indigo'
  | 'emerald'
  | 'teal'
  | 'orange'
  | 'rose'
  | 'cyan'
  | 'slate'
  | 'gold';

export interface DashboardPortal {
  id: string;
  name: string;
  description: string;
  category: PortalCategory;
  status: PortalStatus;
  url?: string;
  icon: LucideIcon;
  accent: PortalAccent;
}

export const ACADEMIC_PORTALS: DashboardPortal[] = [
  {
    id: 'mis-dashboard',
    name: 'MIS Dashboard',
    description: 'Institutional Management Information System',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://mis-srm-vega.vercel.app/overview',
    icon: BarChart2,
    accent: 'royal-blue',
  },
  {
    id: 'appraisal-dashboard',
    name: 'Appraisal Dashboard',
    description: 'Faculty Performance & Goals Met',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://faculty-appraisal-form-five.vercel.app/?role=CHAIRMAN',
    icon: TrendingUp,
    accent: 'violet',
  },
  {
    id: 'reports-review',
    name: 'Reports & Review',
    description: 'Reports, Reviews & Performance Monitoring',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://srm-report-project.vercel.app/',
    icon: ClipboardCheck,
    accent: 'amber',
  },
  {
    id: 'rd-dashboard',
    name: 'R&D Dashboard',
    description: 'Research & Development Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://rd-dashboard-navy.vercel.app/index.html',
    icon: FlaskConical,
    accent: 'indigo',
  },
  {
    id: 'iqac-dashboard',
    name: 'IQAC Dashboard',
    description: 'Institutional Quality Assurance Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://iqac-portal-srm.vercel.app/admin/dashboard',
    icon: ShieldCheck,
    accent: 'emerald',
  },
  {
    id: 'placement-dashboard',
    name: 'Placement Dashboard',
    description: 'Student Placement & Career Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://placement-portal-sigma-seven.vercel.app/',
    icon: Briefcase,
    accent: 'teal',
  }
];

export const BUSINESS_UNIT_PORTALS: DashboardPortal[] = [
  {
    id: 'srm-good-foods',
    name: 'SRM Good Foods',
    description: 'Food Services & Operational Analytics',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: ChefHat,
    accent: 'orange',
  },
  {
    id: 'book-cdc',
    name: 'Book & CDC',
    description: 'Books, Learning & Development Operations',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: BookOpen,
    accent: 'royal-blue',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Infrastructure & Facilities Analytics',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: Building2,
    accent: 'slate',
  },
  {
    id: 'srm-diagnostic-lab',
    name: 'SRM Diagnostic Lab',
    description: 'Laboratory & Diagnostic Operations',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: Microscope,
    accent: 'cyan',
  },
  {
    id: 'q-mart',
    name: 'Q Mart',
    description: 'Retail & Business Operations Analytics',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: Store,
    accent: 'rose',
  },
  {
    id: 'hostel',
    name: 'Hostel',
    description: 'Residential & Accommodation Management',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: Home,
    accent: 'violet',
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Transport & Fleet Operations',
    category: 'BUSINESS_UNIT',
    status: 'COMING_SOON',
    icon: Bus,
    accent: 'gold',
  }
];
