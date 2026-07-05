export type OrganizationType = "company" | "ngo";

export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  description: string;
  technologies: string[];
  sdgs: string[];
  targetRegions: string[];
  createdAt: string;
}

export type ProjectMode = "new_opportunity" | "existing_partner" | "ngo_seeking_partner";
export type ProjectStatus = "draft" | "in_progress" | "completed";

export interface Project {
  id: string;
  organizationId: string;
  title: string;
  mode: ProjectMode;
  status: ProjectStatus;
  selectedCountry?: string;
  selectedPartner?: string;
}

export interface Citation {
  id: string;
  projectId: string;
  sourceName: string;
  title: string;
  url: string;
  usedIn: string[];
  snippet?: string;
}

export interface CountryOpportunity {
  country: string;
  opportunityScore: number;
  reasons: string[];
  evidence: Citation[];
}

export interface PartnerMatch {
  name: string;
  matchScore: number;
  matchReasons: string[];
  risk: string;
  recommendation: string;
}

export interface OrganizationProfile {
  organizationType: OrganizationType;
  coreTechnology: string[];
  industry: string[];
  relatedSdgs: string[];
  possibleUseCases: string[];
  confidence: number;
  citations: Citation[];
}
