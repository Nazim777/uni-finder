"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UniversityFilters } from "@/types/university";
import { debounce } from "@/lib/utils/helpers";

interface FilterPanelProps {
  filters: UniversityFilters;
  onFilterChange: (filters: UniversityFilters) => void;
  filterOptions: {
    countries: string[];
    cities: string[];
    programs: string[];
  };
}

export function FilterPanel({
  filters,
  onFilterChange,
  filterOptions,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<UniversityFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounced filter change
  const debouncedFilterChange = debounce((newFilters: UniversityFilters) => {
    onFilterChange(newFilters);
  }, 500);

  const updateFilter = (key: keyof UniversityFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  const handleMultiSelect = (
    key: "countries" | "cities" | "programs" | "campusTypes" | "researchOutput",
    value: string,
  ) => {
    const currentValues = localFilters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues.length > 0 ? newValues : undefined);
  };

  const resetFilters = () => {
    const resetFilters: UniversityFilters = {
      page: 1,
      limit: 12,
      sortOrder: "asc",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.keys(localFilters).filter(
    (key) =>
      !["page", "limit", "sortOrder", "sortBy"].includes(key) &&
      localFilters[key as keyof UniversityFilters],
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm font-normal text-primary-600">
                ({activeFilterCount} active)
              </span>
            )}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset All
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search by university name, city, or country..."
        value={localFilters.search || ""}
        onChange={(e) => updateFilter("search", e.target.value || undefined)}
        className="w-full h-12 text-base px-4 rounded-xl"
      />

      {/* Basic Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Country Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Countries
          </label>
          <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-gray-50">
            {filterOptions.countries.map((country) => (
              <label
                key={country}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.countries?.includes(country) || false}
                  onChange={() => handleMultiSelect("countries", country)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-base text-gray-800">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tuition Range */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tuition Fee Range (USD)
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minTuition || ""}
              onChange={(e) =>
                updateFilter(
                  "minTuition",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxTuition || ""}
              onChange={(e) =>
                updateFilter(
                  "maxTuition",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>

          {/* World Ranking */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              World Ranking Range
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Top"
                value={localFilters.minRanking || ""}
                onChange={(e) =>
                  updateFilter(
                    "minRanking",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
              <Input
                type="number"
                placeholder="Bottom"
                value={localFilters.maxRanking || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxRanking",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200 animate-slide-up">
          <h3 className="font-semibold text-gray-900">Advanced Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Programs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programs
              </label>
              <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-gray-50">
                {filterOptions.programs.map((program) => (
                  <label
                    key={program}
                    className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        localFilters.programs?.includes(program) || false
                      }
                      onChange={() => handleMultiSelect("programs", program)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-base text-gray-800">{program}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Acceptance Rate (%)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={localFilters.minAcceptanceRate || ""}
                  onChange={(e) =>
                    updateFilter(
                      "minAcceptanceRate",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={localFilters.maxAcceptanceRate || ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxAcceptanceRate",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              {/* Employment Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Employment Rate (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  value={localFilters.minEmploymentRate || ""}
                  onChange={(e) =>
                    updateFilter(
                      "minEmploymentRate",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              {/* Scholarship */}
              <div>
                <label className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.scholarshipOnly || false}
                    onChange={(e) =>
                      updateFilter(
                        "scholarshipOnly",
                        e.target.checked || undefined,
                      )
                    }
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Scholarship Available Only
                  </span>
                </label>
              </div>
            </div>

            {/* Campus Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campus Type
              </label>
              <div className="space-y-2">
                {["Urban", "Suburban", "Rural"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        localFilters.campusTypes?.includes(type as any) || false
                      }
                      onChange={() => handleMultiSelect("campusTypes", type)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-base text-gray-800">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Research Output */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Output
              </label>
              <div className="space-y-2">
                {["Low", "Medium", "High", "Very High"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        localFilters.researchOutput?.includes(level as any) ||
                        false
                      }
                      onChange={() =>
                        handleMultiSelect("researchOutput", level)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-base text-gray-800">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
