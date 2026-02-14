"use client";

import { useState, useEffect, useCallback } from "react";
import { UniversityCard } from "@/components/features/UniversityCard";
import { FilterPanel } from "@/components/features/FilterPanel";
import { ComparisonModal } from "@/components/features/ComparisonModal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  University,
  UniversityFilters,
  PaginatedResponse,
} from "@/types/university";
import { buildQueryString } from "@/lib/utils/helpers";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    cities: [] as string[],
    programs: [] as string[],
  });
  const [filters, setFilters] = useState<UniversityFilters>({
    page: 1,
    limit: 12,
    sortOrder: "asc",
  });
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    [],
  );
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch universities based on filters
  const fetchUniversities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString(filters);
      const response = await fetch(`/api/universities${queryString}`);

      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }

      const data: PaginatedResponse<University> = await response.json();

      setUniversities(data.data);
      setPagination(data.pagination);
      setFilterOptions(data.filters);
    } catch (err) {
      setError("Failed to load universities. Please try again.");
      console.error("Error fetching universities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleFilterChange = (newFilters: UniversityFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters({
      ...filters,
      sortBy: sortBy as any,
      sortOrder,
      page: 1,
    });
  };

  const handleCompareSelect = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(
        selectedForComparison.filter((uid) => uid !== id),
      );
    } else if (selectedForComparison.length < 2) {
      setSelectedForComparison([...selectedForComparison, id]);
    } else {
      // Replace first selection
      setSelectedForComparison([selectedForComparison[1], id]);
    }
  };

  const openComparison = () => {
    if (selectedForComparison.length === 2) {
      setIsComparisonOpen(true);
    }
  };

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "ranking-asc", label: "Ranking (Best First)" },
    { value: "ranking-desc", label: "Ranking (Worst First)" },
    { value: "tuitionFee-asc", label: "Tuition (Low to High)" },
    { value: "tuitionFee-desc", label: "Tuition (High to Low)" },
    { value: "acceptanceRate-asc", label: "Acceptance Rate (Low to High)" },
    { value: "acceptanceRate-desc", label: "Acceptance Rate (High to Low)" },
    { value: "employmentRate-desc", label: "Employment Rate (High to Low)" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect University
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover and compare top universities worldwide. Filter by
              location, tuition, rankings, and more to find your ideal
              educational institution.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span>{pagination.total} Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{filterOptions.countries.length} Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{filterOptions.programs.length} Programs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6 lg:h-full lg:min-h-0 lg:overflow-y-auto pl-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:h-full lg:min-h-0">
            {/* Filters Sidebar */}
            <div className="lg:col-span-2 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-2">
              <div className="">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  filterOptions={filterOptions}
                />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6 lg:h-full lg:min-h-0 lg:overflow-y-auto pl-2">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span className="font-medium">
                    {pagination.total}{" "}
                    {pagination.total === 1 ? "University" : "Universities"}{" "}
                    Found
                  </span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Select
                    options={sortOptions}
                    value={
                      filters.sortBy && filters.sortOrder
                        ? `${filters.sortBy}-${filters.sortOrder}`
                        : ""
                    }
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-");
                      handleSortChange(sortBy, sortOrder as "asc" | "desc");
                    }}
                    className="w-full sm:w-64"
                  />

                  {selectedForComparison.length > 0 && (
                    <Button
                      variant="primary"
                      onClick={openComparison}
                      disabled={selectedForComparison.length !== 2}
                    >
                      Compare ({selectedForComparison.length}/2)
                    </Button>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading universities...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => fetchUniversities()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && !error && universities.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Universities Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleFilterChange({
                        page: 1,
                        limit: 12,
                        sortOrder: "asc",
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* University Grid */}
              {!isLoading && universities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {universities.map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                      onCompare={handleCompareSelect}
                      isSelected={selectedForComparison.includes(university.id)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: Math.min(pagination.totalPages, 7) },
                      (_, i) => {
                        let pageNum: number;
                        if (pagination.totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 4) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 3
                        ) {
                          pageNum = pagination.totalPages - 6 + i;
                        } else {
                          pageNum = pagination.page - 3 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pagination.page === pageNum ? "primary" : "ghost"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        universityIds={selectedForComparison}
      />
    </div>
  );
}
