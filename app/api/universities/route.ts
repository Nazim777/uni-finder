import { NextRequest, NextResponse } from 'next/server';
import { UniversityService } from '@/lib/university-service';
import { UniversityFiltersSchema } from '@/types/university';
import { z } from 'zod';

/**
 * GET /api/universities
 * Server-side filtered and paginated university listing
 * All filtering logic runs on the server
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const rawFilters = {
      search: searchParams.get('search') || undefined,
      countries: searchParams.get('countries')?.split(',').filter(Boolean) || undefined,
      cities: searchParams.get('cities')?.split(',').filter(Boolean) || undefined,
      minTuition: searchParams.get('minTuition') ? Number(searchParams.get('minTuition')) : undefined,
      maxTuition: searchParams.get('maxTuition') ? Number(searchParams.get('maxTuition')) : undefined,
      minRanking: searchParams.get('minRanking') ? Number(searchParams.get('minRanking')) : undefined,
      maxRanking: searchParams.get('maxRanking') ? Number(searchParams.get('maxRanking')) : undefined,
      minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
      maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
      programs: searchParams.get('programs')?.split(',').filter(Boolean) || undefined,
      minAcceptanceRate: searchParams.get('minAcceptanceRate') ? Number(searchParams.get('minAcceptanceRate')) : undefined,
      maxAcceptanceRate: searchParams.get('maxAcceptanceRate') ? Number(searchParams.get('maxAcceptanceRate')) : undefined,
      campusTypes: searchParams.get('campusTypes')?.split(',').filter(Boolean) as any || undefined,
      scholarshipOnly: searchParams.get('scholarshipOnly') === 'true' || undefined,
      minEmploymentRate: searchParams.get('minEmploymentRate') ? Number(searchParams.get('minEmploymentRate')) : undefined,
      researchOutput: searchParams.get('researchOutput')?.split(',').filter(Boolean) as any || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
      sortBy: searchParams.get('sortBy') as any || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    };

    // Validate filters using Zod schema
    const filters = UniversityFiltersSchema.parse(rawFilters);

    // Get filtered and paginated results
    const result = await UniversityService.getUniversities(filters);

    // Return with cache headers for performance
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Runtime configuration for optimal performance
 */
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
