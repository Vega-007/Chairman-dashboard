import { create } from 'zustand';
import { AcademicYearOption, UserProfile } from '../types/common';

interface AppState {
  academicYear: AcademicYearOption;
  setAcademicYear: (year: AcademicYearOption) => void;
  availableYears: AcademicYearOption[];
  
  isDemoData: boolean;
  setIsDemoData: (val: boolean) => void;
  
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  user: UserProfile;
}

export const useAppStore = create<AppState>((set) => ({
  academicYear: '2025–26',
  setAcademicYear: (year) => set({ academicYear: year }),
  availableYears: ['2025–26', '2024–25', '2023–24'],
  
  isDemoData: true,
  setIsDemoData: (val) => set({ isDemoData: val }),
  
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  user: {
    name: 'Dr. R. Shivakumar',
    role: 'Chairman',
    email: 'chairman@srmgroup.edu.in',
    campusScope: 'Ramapuram & Trichy',
  },
}));
