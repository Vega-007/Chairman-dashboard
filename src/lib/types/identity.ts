import { CampusName } from './institution';

export interface InstitutionIdentity {
  id: string;
  code: string;
  officialName: string;
  shortName: string;
  campus: CampusName;
  campusDisplayName: 'Chennai – Ramapuram' | 'Tiruchirappalli' | 'West Mambalam, Chennai';
  type: string;
  logoUrl?: string;
  fallbackInitials: string;
}

export type ScoreRangeFilter = 'ALL' | '90_100' | '70_89' | 'BELOW_70';

export type InstitutionSortOption =
  | 'SCORE_DESC'
  | 'SCORE_ASC'
  | 'GAP_DESC'
  | 'IMPROVED_DESC'
  | 'DECLINED_DESC'
  | 'ATTENTION_FIRST'
  | 'CODE_ASC'
  | 'NAME_ASC';

export type CategorySortOption =
  | 'ORDER'
  | 'ACHIEVEMENT_DESC'
  | 'ACHIEVEMENT_ASC'
  | 'GAP_DESC'
  | 'TREND_DESC'
  | 'TREND_ASC'
  | 'CODE';
