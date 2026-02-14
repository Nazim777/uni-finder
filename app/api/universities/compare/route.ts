import { NextRequest, NextResponse } from 'next/server';
import { UniversityService } from '@/lib/university-service';
import { UniversityComparison } from '@/types/university';

/**
 * GET /api/universities/compare?ids=id1,id2
 * Compare two universities side by side
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing ids parameter' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').filter(Boolean);

    if (ids.length !== 2) {
      return NextResponse.json(
        { error: 'Exactly 2 university IDs are required for comparison' },
        { status: 400 }
      );
    }

    const universities = await UniversityService.getUniversitiesByIds(ids);

    if (universities.length !== 2) {
      return NextResponse.json(
        { error: 'One or both universities not found' },
        { status: 404 }
      );
    }

    const [uni1, uni2] = universities;

    // Calculate comparison metrics
    const comparison: UniversityComparison = {
      universities: [uni1, uni2],
      comparison: {
        tuitionDifference: Math.abs(uni1.tuitionFee - uni2.tuitionFee),
        rankingDifference: 
          uni1.ranking && uni2.ranking 
            ? Math.abs(uni1.ranking - uni2.ranking) 
            : null,
        acceptanceRateDifference: Math.abs(uni1.acceptanceRate - uni2.acceptanceRate),
        employmentRateDifference: Math.abs(uni1.employmentRate - uni2.employmentRate),
      },
    };

    return NextResponse.json(comparison, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error comparing universities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
