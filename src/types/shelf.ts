export type ShelfType = "AUTOMATIC" | "MANUAL" | "PERSONALIZED";

export type ShelfLayout = 
  | "CAROUSEL" 
  | "LIST" 
  | "HERO_BANNER" 
  | "MID_BANNER" 
  | "AD_BANNER" 
  | "GRID";

export type ShelfDomain = 
  | "CONTENT" 
  | "COLLECTION" 
  | "NEWS" 
  | "AGENT" 
  | "GROUP" 
  | "AGENDA" 
  | "BANNER";

export type ShelfAlgorithm = 
  | "BECAUSE_YOU_WATCHED" 
  | "SUGGESTIONS_FOR_YOU";

export type FilterRule = 
  | "RANDOM" 
  | "RECENT" 
  | "ALPHABETICAL" 
  | "TOP";

export type FilterDomain = 
  | "CONTENT" 
  | "COLLECTION" 
  | "NEWS" 
  | "AGENT" 
  | "GROUP" 
  | "AGENDA";

export interface ShelfFilter {
  id?: string;
  rule: FilterRule;
  domain: FilterDomain;
  domainField?: string;
  value?: string;
}

export interface Shelf {
  id: string;
  title: string;
  type: ShelfType;
  layout: ShelfLayout;
  domain: ShelfDomain;
  hasSeeMore: boolean;
  seeMoreUrl?: string;
  scheduleDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
  
  // For Manual type
  selectedItems?: string[];
  
  // For Automatic type
  filter?: ShelfFilter;
  
  // For Personalized type
  algorithm?: ShelfAlgorithm;
  limit?: number;
}
