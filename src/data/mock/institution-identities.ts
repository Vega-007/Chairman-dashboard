import { InstitutionIdentity } from '@/lib/types/identity';

/**
 * Single Source of Truth for Institutional Identity across SRM Group (19 Constituent Entities).
 * Used by all cards, headers, tree views, intelligence panels, filters, and drill-downs.
 */
export const INSTITUTION_IDENTITIES: Record<string, InstitutionIdentity> = {
  // ==========================================
  // CHENNAI – RAMAPURAM (7 Institutions)
  // ==========================================
  eec: {
    id: 'eec',
    code: 'EEC',
    officialName: 'Easwari Engineering College',
    shortName: 'Easwari Engg College',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'Engineering College',
    logoUrl: '/logos/eec.png',
    fallbackInitials: 'EEC',
  },
  'fet-rmp': {
    id: 'fet-rmp',
    code: 'FET-RMP',
    officialName: 'SRM IST Faculty of Engineering & Technology – Ramapuram',
    shortName: 'SRM FET Ramapuram',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'Faculty',
    logoUrl: '/logos/fet-rmp.png',
    fallbackInitials: 'FET',
  },
  'fsh-rmp': {
    id: 'fsh-rmp',
    code: 'FSH-RMP',
    officialName: 'SRM FLABS Faculty of Liberal Arts and Business Studies',
    shortName: 'SRM FLABS Ramapuram',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'Faculty',
    logoUrl: '/logos/fsh-rmp.png',
    fallbackInitials: 'FLABS',
  },
  'fom-rmp': {
    id: 'fom-rmp',
    code: 'FOM-RMP',
    officialName: 'SRM IST Faculty of Management – Ramapuram',
    shortName: 'SRM FoM Ramapuram',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'Faculty',
    logoUrl: '/logos/fom-rmp.png',
    fallbackInitials: 'FOM',
  },
  sead: {
    id: 'sead',
    code: 'SEAD',
    officialName: 'SRM School of Environment, Architecture & Design (SEAD)',
    shortName: 'SRM SEAD Architecture',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'School',
    logoUrl: '/logos/sead.png',
    fallbackInitials: 'SEAD',
  },
  'sdc-rmp': {
    id: 'sdc-rmp',
    code: 'SDC-RMP',
    officialName: 'SRM Dental College, Ramapuram',
    shortName: 'SRM Dental College',
    campus: 'Ramapuram',
    campusDisplayName: 'Chennai – Ramapuram',
    type: 'Dental College',
    logoUrl: '/logos/sdc-rmp.png',
    fallbackInitials: 'SDC',
  },
  nhss: {
    id: 'nhss',
    code: 'NHSS',
    officialName: 'SRM Nightingale Higher Secondary School',
    shortName: 'SRM Nightingale HSS',
    campus: 'School',
    campusDisplayName: 'West Mambalam, Chennai',
    type: 'Higher Secondary School',
    logoUrl: '/logos/nhss.png',
    fallbackInitials: 'NHSS',
  },

  // ==========================================
  // TIRUCHIRAPPALLI (12 Institutions)
  // ==========================================
  'fet-tcy': {
    id: 'fet-tcy',
    code: 'FET-TCY',
    officialName: 'SRM IST Faculty of Engineering & Technology – Trichy',
    shortName: 'SRM FET Trichy',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Faculty',
    logoUrl: '/logos/fet-tcy.png',
    fallbackInitials: 'FET',
  },
  'fsh-tcy': {
    id: 'fsh-tcy',
    code: 'FSH-TCY',
    officialName: 'SRM IST Faculty of Science and Humanities – Trichy',
    shortName: 'SRM FSH Trichy',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Faculty',
    logoUrl: '/logos/fsh-tcy.png',
    fallbackInitials: 'FSH',
  },
  'fom-tcy': {
    id: 'fom-tcy',
    code: 'FOM-TCY',
    officialName: 'SRM IST Faculty of Management – Trichy',
    shortName: 'SRM FoM Trichy',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Faculty',
    logoUrl: '/logos/fom-tcy.png',
    fallbackInitials: 'FOM',
  },
  'ahs-tcy': {
    id: 'ahs-tcy',
    code: 'AHS-TCY',
    officialName: 'SRMIST – Allied Health Sciences',
    shortName: 'SRMIST Allied Health',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Allied Health',
    logoUrl: '/logos/ahs-tcy.png',
    fallbackInitials: 'AHS',
  },
  'ot-tcy': {
    id: 'ot-tcy',
    code: 'OT-TCY',
    officialName: 'SRMIST – Occupational Therapy',
    shortName: 'SRMIST Occupational Therapy',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Allied Health',
    logoUrl: '/logos/ot-tcy.png',
    fallbackInitials: 'OT',
  },
  'pt-tcy': {
    id: 'pt-tcy',
    code: 'PT-TCY',
    officialName: 'SRMIST – Physiotherapy',
    shortName: 'SRMIST Physiotherapy',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Allied Health',
    logoUrl: '/logos/pt-tcy.png',
    fallbackInitials: 'PT',
  },
  tasc: {
    id: 'tasc',
    code: 'TASC',
    officialName: 'SRM Trichy Arts and Science College',
    shortName: 'SRM Trichy Arts & Sci',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Arts & Science',
    logoUrl: '/logos/tasc.png',
    fallbackInitials: 'TASC',
  },
  tsmc: {
    id: 'tsmc',
    code: 'TSMC',
    officialName: 'Trichy SRM Medical College Hospital and Research Centre',
    shortName: 'Trichy SRM Medical College',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Medical College',
    logoUrl: '/logos/tsmc.png',
    fallbackInitials: 'TSMC',
  },
  tahs: {
    id: 'tahs',
    code: 'TAHS',
    officialName: 'TSRM Allied Health Sciences',
    shortName: 'TSRM Allied Health',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Allied Health',
    logoUrl: '/logos/tahs.png',
    fallbackInitials: 'TAHS',
  },
  tcon: {
    id: 'tcon',
    code: 'TCON',
    officialName: 'SRM Trichy College of Nursing',
    shortName: 'SRM Trichy Nursing',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Nursing',
    logoUrl: '/logos/tcon.png',
    fallbackInitials: 'TCON',
  },
  trp: {
    id: 'trp',
    code: 'TRP',
    officialName: 'SRM TRP Engineering College',
    shortName: 'SRM TRP Engineering',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Engineering College',
    logoUrl: '/logos/trp.png',
    fallbackInitials: 'TRP',
  },
  'ihm-tcy': {
    id: 'ihm-tcy',
    code: 'IHM-TCY',
    officialName: 'SRMIST – Institute of Hotel Management',
    shortName: 'SRMIST Hotel Management',
    campus: 'Trichy',
    campusDisplayName: 'Tiruchirappalli',
    type: 'Hotel Management',
    logoUrl: '/logos/ihm-tcy.png',
    fallbackInitials: 'IHM',
  },
};

/**
 * Helper to get the canonical identity by ID or Code.
 */
export function getInstitutionIdentity(idOrCode: string): InstitutionIdentity | undefined {
  const query = idOrCode.toLowerCase();
  return (
    INSTITUTION_IDENTITIES[query] ||
    Object.values(INSTITUTION_IDENTITIES).find(
      (inst) => inst.id.toLowerCase() === query || inst.code.toLowerCase() === query
    )
  );
}
