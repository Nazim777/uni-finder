import { z } from 'zod';

/**
 * University data model with comprehensive fields for filtering and display
 */
export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  state?: string;
  tuitionFee: number; // Annual tuition in USD
  currency: string;
  ranking: number | null; // World ranking
  establishedYear: number;
  imageUrl: string;
  
  // Additional innovative filter fields
  studentPopulation: number;
  internationalStudents: number; // Percentage
  acceptanceRate: number; // Percentage
  graduationRate: number; // Percentage
  
  // Academic features
  programs: string[];
  researchOutput: 'Low' | 'Medium' | 'High' | 'Very High';
  
  // Student support
  scholarshipAvailable: boolean;
  avgScholarshipAmount?: number;
  
  // Campus features
  campusType: 'Urban' | 'Suburban' | 'Rural';
  housingAvailable: boolean;
  
  // Career outcomes
  employmentRate: number; // Percentage within 6 months of graduation
  avgStartingSalary?: number; // In USD
  
  // Additional metadata
  website: string;
  description: string;
}

/**
 * Filter parameters schema with validation
 */
export const UniversityFiltersSchema = z.object({
  search: z.string().optional(),
  countries: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  minTuition: z.number().min(0).optional(),
  maxTuition: z.number().min(0).optional(),
  minRanking: z.number().min(1).optional(),
  maxRanking: z.number().min(1).optional(),
  minYear: z.number().min(1000).max(new Date().getFullYear()).optional(),
  maxYear: z.number().min(1000).max(new Date().getFullYear()).optional(),
  programs: z.array(z.string()).optional(),
  minAcceptanceRate: z.number().min(0).max(100).optional(),
  maxAcceptanceRate: z.number().min(0).max(100).optional(),
  campusTypes: z.array(z.enum(['Urban', 'Suburban', 'Rural'])).optional(),
  scholarshipOnly: z.boolean().optional(),
  minEmploymentRate: z.number().min(0).max(100).optional(),
  researchOutput: z.array(z.enum(['Low', 'Medium', 'High', 'Very High'])).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.enum(['name', 'ranking', 'tuitionFee', 'establishedYear', 'acceptanceRate', 'employmentRate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type UniversityFilters = z.infer<typeof UniversityFiltersSchema>;

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    countries: string[];
    cities: string[];
    programs: string[];
  };
}

/**
 * Comparison data for side-by-side university comparison
 */
export interface UniversityComparison {
  universities: [University, University];
  comparison: {
    tuitionDifference: number;
    rankingDifference: number | null;
    acceptanceRateDifference: number;
    employmentRateDifference: number;
  };
}
