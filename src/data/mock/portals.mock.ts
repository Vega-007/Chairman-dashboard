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
  Wifi,
  Users,
  FileCheck,
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
    url: 'https://srm-report-project.vercel.app/?role=CHAIRMAN',
    icon: ClipboardCheck,
    accent: 'amber',
  },
  {
    id: 'rd-dashboard',
    name: 'R&D Dashboard',
    description: 'Research & Development Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://rd-dashboard-navy.vercel.app/?role=CHAIRMAN',
    icon: FlaskConical,
    accent: 'indigo',
  },
  {
    id: 'iqac-dashboard',
    name: 'IQAC Dashboard',
    description: 'Institutional Quality Assurance Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://iqac-portal-srm.vercel.app/?role=CHAIRMAN',
    icon: ShieldCheck,
    accent: 'emerald',
  },
  {
    id: 'placement-dashboard',
    name: 'Placement Dashboard',
    description: 'Student Placement & Career Analytics',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://placement-portal-sigma-seven.vercel.app/?role=CHAIRMAN',
    icon: Briefcase,
    accent: 'teal',
  },
  {
    id: 'chairman-approval',
    name: 'Chairman Approval Dashboard',
    description: 'Centralized Approval & Authorization Workflow',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://srm-approval.vercel.app/?role=CHAIRMAN',
    icon: FileCheck,
    accent: 'rose',
  }
];

export const BUSINESS_UNIT_PORTALS: DashboardPortal[] = [
  {
    id: 'srm-good-foods',
    name: 'SRM Good Foods',
    description: 'Monitor revenue, profitability, sales performance, inventory, and outlet operations.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/srm-good-foods',
    icon: ChefHat,
    accent: 'orange',
  },
  {
    id: 'book-cdc',
    name: 'Book & CDC',
    description: 'Track sales, stock availability, revenue trends, demand, and resource utilization.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/book-cdc',
    icon: BookOpen,
    accent: 'royal-blue',
  },
  {
    id: 'infrastructure',
    name: 'SRM Infrastructure',
    description: 'Track infrastructure projects, budgets, assets, maintenance, and execution progress.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/infrastructure',
    icon: Building2,
    accent: 'slate',
  },
  {
    id: 'hostels-mess',
    name: 'Hostels & Mess',
    description: 'Monitor occupancy, operational costs, utilization, student satisfaction, and service issues.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/hostels-mess',
    icon: Home,
    accent: 'violet',
  },
  {
    id: 'srm-diagnostic-lab',
    name: 'SRM Diagnostic Lab',
    description: 'Track diagnostic activity, patient volume, revenue, utilization, and operational efficiency.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/srm-diagnostic-lab',
    icon: Microscope,
    accent: 'cyan',
  },
  {
    id: 'q-mart',
    name: 'Q Mart',
    description: 'Monitor sales, inventory levels, margins, stock turnover, and business growth.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/q-mart',
    icon: Store,
    accent: 'rose',
  },
  {
    id: 'net-dtp-center',
    name: 'Net & DTP Center',
    description: 'Track service usage, revenue, service performance, and department-wise utilization.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/net-dtp-center',
    icon: Wifi,
    accent: 'emerald',
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Monitor fleet operations, route utilization, fuel consumption, maintenance, and operating costs.',
    category: 'BUSINESS_UNIT',
    status: 'LIVE',
    url: '/business-units/transport',
    icon: Bus,
    accent: 'gold',
  }
];

export const COMMUNITY_PORTALS: DashboardPortal[] = [
  {
    id: 'alumni-network',
    name: 'Alumni Network',
    description: 'SRM Alumni Connect and Network Platform',
    category: 'ACADEMIC',
    status: 'LIVE',
    url: 'https://vishal-srm-connect-vishal-branch.vercel.app/?role=CHAIRMAN',
    icon: Users,
    accent: 'cyan',
  }
];
