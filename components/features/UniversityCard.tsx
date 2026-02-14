'use client';

import { University } from '@/types/university';
import { formatCurrency, formatPercentage, getRankingColor } from '@/lib/utils/helpers';
import { Button } from '@/components/ui/Button';

interface UniversityCardProps {
  university: University;
  onCompare?: (id: string) => void;
  isSelected?: boolean;
}

export function UniversityCard({ university, onCompare, isSelected }: UniversityCardProps) {
  const {
    id,
    name,
    country,
    city,
    state,
    tuitionFee,
    currency,
    ranking,
    establishedYear,
    acceptanceRate,
    employmentRate,
    scholarshipAvailable,
    campusType,
    programs,
  } = university;

  return (
    <div className={`
      bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden
      border-2 ${isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent'}
      group hover:-translate-y-1
    `}>
      {/* Header with gradient */}
      <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            {ranking && (
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white ${getRankingColor(ranking)}`}>
                #{ranking}
              </span>
            )}
            {scholarshipAvailable && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-400 text-yellow-900">
                Scholarship
              </span>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:line-clamp-none transition-all">
              {name}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{city}{state ? `, ${state}` : ''} • {country}</span>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Tuition Fee</p>
            <p className="font-bold text-primary-600">{formatCurrency(tuitionFee, currency)}/yr</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Acceptance</p>
            <p className="font-bold text-green-600">{formatPercentage(acceptanceRate)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Employment</p>
            <p className="font-bold text-blue-600">{formatPercentage(employmentRate)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Campus</p>
            <p className="font-bold text-gray-700">{campusType}</p>
          </div>
        </div>

        {/* Programs */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Popular Programs</p>
          <div className="flex flex-wrap gap-1">
            {programs.slice(0, 3).map((program) => (
              <span
                key={program}
                className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full"
              >
                {program}
              </span>
            ))}
            {programs.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                +{programs.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Est. {establishedYear}</span>
          {onCompare && (
            <Button
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onCompare(id)}
            >
              {isSelected ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Selected
                </>
              ) : (
                'Compare'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
