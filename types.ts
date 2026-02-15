export type StudentType = 'SCHOOL' | 'COLLEGE';

export interface StudentData {
  name: string;
  year: string;
  goals: string;
}

export interface ReferenceLink {
  title: string;
  url: string;
  description: string;
}

export interface RoadmapResponse {
  motivationalQuote: string;
  roadmapContent: string;
  weeklySchedule: string;
  referenceLinks: ReferenceLink[];
}