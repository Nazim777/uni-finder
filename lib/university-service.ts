import { University, UniversityFilters, PaginatedResponse } from '@/types/university';
import { universities, getFilterOptions } from '@/lib/db';

/**
 * Server-side university filtering service
 * All filtering logic runs on the server for security and performance
 */
export class UniversityService {
  /**
   * Filter universities based on provided criteria
   * Implements complex multi-field filtering with AND logic
   */
  private static filterUniversities(filters: UniversityFilters): University[] {
    let filtered = [...universities];

    // Text search across name, city, country
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.city.toLowerCase().includes(searchLower) ||
        u.country.toLowerCase().includes(searchLower) ||
        u.description.toLowerCase().includes(searchLower)
      );
    }

    // Country filter (multiple selection)
    if (filters.countries && filters.countries.length > 0) {
      filtered = filtered.filter(u => 
        filters.countries!.includes(u.country)
      );
    }

    // City filter (multiple selection)
    if (filters.cities && filters.cities.length > 0) {
      filtered = filtered.filter(u => 
        filters.cities!.includes(u.city)
      );
    }

    // Tuition fee range
    if (filters.minTuition !== undefined) {
      filtered = filtered.filter(u => u.tuitionFee >= filters.minTuition!);
    }
    if (filters.maxTuition !== undefined) {
      filtered = filtered.filter(u => u.tuitionFee <= filters.maxTuition!);
    }

    // Ranking range (lower is better)
    if (filters.minRanking !== undefined) {
      filtered = filtered.filter(u => 
        u.ranking !== null && u.ranking >= filters.minRanking!
      );
    }
    if (filters.maxRanking !== undefined) {
      filtered = filtered.filter(u => 
        u.ranking !== null && u.ranking <= filters.maxRanking!
      );
    }

    // Established year range
    if (filters.minYear !== undefined) {
      filtered = filtered.filter(u => u.establishedYear >= filters.minYear!);
    }
    if (filters.maxYear !== undefined) {
      filtered = filtered.filter(u => u.establishedYear <= filters.maxYear!);
    }

    // Programs filter (multiple selection - ANY match)
    if (filters.programs && filters.programs.length > 0) {
      filtered = filtered.filter(u => 
        filters.programs!.some(program => u.programs.includes(program))
      );
    }

    // Acceptance rate range
    if (filters.minAcceptanceRate !== undefined) {
      filtered = filtered.filter(u => 
        u.acceptanceRate >= filters.minAcceptanceRate!
      );
    }
    if (filters.maxAcceptanceRate !== undefined) {
      filtered = filtered.filter(u => 
        u.acceptanceRate <= filters.maxAcceptanceRate!
      );
    }

    // Campus type filter (multiple selection)
    if (filters.campusTypes && filters.campusTypes.length > 0) {
      filtered = filtered.filter(u => 
        filters.campusTypes!.includes(u.campusType)
      );
    }

    // Scholarship availability filter
    if (filters.scholarshipOnly) {
      filtered = filtered.filter(u => u.scholarshipAvailable);
    }

    // Employment rate filter
    if (filters.minEmploymentRate !== undefined) {
      filtered = filtered.filter(u => 
        u.employmentRate >= filters.minEmploymentRate!
      );
    }

    // Research output filter (multiple selection)
    if (filters.researchOutput && filters.researchOutput.length > 0) {
      filtered = filtered.filter(u => 
        filters.researchOutput!.includes(u.researchOutput)
      );
    }

    return filtered;
  }

  /**
   * Sort universities based on criteria
   */
  private static sortUniversities(
    universities: University[],
    sortBy?: UniversityFilters['sortBy'],
    sortOrder: 'asc' | 'desc' = 'asc'
  ): University[] {
    if (!sortBy) return universities;

    const sorted = [...universities].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'ranking':
          // Handle null rankings (put them at the end)
          aValue = a.ranking ?? Number.MAX_SAFE_INTEGER;
          bValue = b.ranking ?? Number.MAX_SAFE_INTEGER;
          break;
        case 'tuitionFee':
          aValue = a.tuitionFee;
          bValue = b.tuitionFee;
          break;
        case 'establishedYear':
          aValue = a.establishedYear;
          bValue = b.establishedYear;
          break;
        case 'acceptanceRate':
          aValue = a.acceptanceRate;
          bValue = b.acceptanceRate;
          break;
        case 'employmentRate':
          aValue = a.employmentRate;
          bValue = b.employmentRate;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }

  /**
   * Paginate results
   */
  private static paginateResults(
    universities: University[],
    page: number,
    limit: number
  ): { data: University[]; total: number; totalPages: number } {
    const total = universities.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = universities.slice(start, end);

    return { data, total, totalPages };
  }

  /**
   * Main method to get universities with filters
   * Returns paginated results with metadata
   */
  static async getUniversities(
    filters: UniversityFilters
  ): Promise<PaginatedResponse<University>> {
    // Apply filters
    let filtered = this.filterUniversities(filters);

    // Sort results
    filtered = this.sortUniversities(filtered, filters.sortBy, filters.sortOrder);

    // Paginate
    const { data, total, totalPages } = this.paginateResults(
      filtered,
      filters.page,
      filters.limit
    );

    // Get filter options for UI
    const filterOptions = getFilterOptions();

    return {
      data,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages,
      },
      filters: filterOptions,
    };
  }

  /**
   * Get a single university by ID
   */
  static async getUniversityById(id: string): Promise<University | null> {
    return universities.find(u => u.id === id) || null;
  }

  /**
   * Get multiple universities by IDs (for comparison)
   */
  static async getUniversitiesByIds(ids: string[]): Promise<University[]> {
    return universities.filter(u => ids.includes(u.id));
  }

  /**
   * Get statistics for homepage/dashboard
   */
  static async getStatistics() {
    return {
      totalUniversities: universities.length,
      countries: new Set(universities.map(u => u.country)).size,
      avgTuitionFee: Math.round(
        universities.reduce((sum, u) => sum + u.tuitionFee, 0) / universities.length
      ),
      topRanked: universities
        .filter(u => u.ranking !== null)
        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))
        .slice(0, 5),
    };
  }
}
