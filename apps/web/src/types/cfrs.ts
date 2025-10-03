/**
 * CloudFlow Resume Schema (CFRS) TypeScript Types
 * Generated from cfrs.schema.json v1.0.0
 */

export interface CFRSResume {
  $schema: string;
  basics: CFRSBasics;
  work?: CFRSWork[];
  volunteer?: CFRSVolunteer[];
  education?: CFRSEducation[];
  awards?: CFRSAward[];
  certificates?: CFRSCertificate[];
  publications?: CFRSPublication[];
  skills?: CFRSSkill[];
  languages?: CFRSLanguage[];
  interests?: CFRSInterest[];
  references?: CFRSReference[];
  projects?: CFRSProject[];
  x_cfrs_custom_sections?: CFRSCustomSection[];
}

export interface CFRSBasics {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: CFRSLocation;
  profiles?: CFRSProfile[];
  x_cfrs_pronouns?: string;
  x_cfrs_locale?: string;
  x_cfrs_variants?: Record<string, unknown>;
}

export interface CFRSLocation {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface CFRSProfile {
  network?: string;
  username?: string;
  url?: string;
}

export interface CFRSWork {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  x_cfrs_keywords?: string[];
  x_cfrs_employment_type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  x_cfrs_remote_eligible?: boolean;
}

export interface CFRSVolunteer {
  organization?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface CFRSEducation {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
  x_cfrs_academic_honors?: string[];
}

export interface CFRSAward {
  title?: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface CFRSCertificate {
  name?: string;
  date?: string;
  issuer?: string;
  url?: string;
  x_cfrs_expiry_date?: string;
  x_cfrs_credential_id?: string;
}

export interface CFRSPublication {
  name?: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
  x_cfrs_co_authors?: string[];
  x_cfrs_citation_count?: number;
}

export interface CFRSSkill {
  name?: string;
  level?: string;
  keywords?: string[];
  x_cfrs_years_of_experience?: number;
  x_cfrs_skill_category?: string;
}

export interface CFRSLanguage {
  language?: string;
  fluency?: string;
  x_cfrs_cefr_level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface CFRSInterest {
  name?: string;
  keywords?: string[];
}

export interface CFRSReference {
  name?: string;
  reference?: string;
  x_cfrs_contact_email?: string;
  x_cfrs_contact_phone?: string;
}

export interface CFRSProject {
  name?: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
  x_cfrs_featured?: boolean;
}

export interface CFRSCustomSection {
  sectionTitle: string;
  sectionType: string;
  items: Record<string, unknown>[];
}

export interface ValidationError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, unknown>;
  message?: string | undefined;
}

export type Theme = 'classic' | 'modern';
export type ExportFormat = 'cfrs' | 'json-resume' | 'fresh' | 'html' | 'markdown';
