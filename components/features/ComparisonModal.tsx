'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { UniversityComparison } from '@/types/university';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/helpers';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  universityIds: string[];
}

export function ComparisonModal({ isOpen, onClose, universityIds }: ComparisonModalProps) {
  const [comparison, setComparison] = useState<UniversityComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && universityIds.length === 2) {
      fetchComparison();
    }
  }, [isOpen, universityIds]);

  const fetchComparison = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/universities/compare?ids=${universityIds.join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch comparison');
      const data = await response.json();
      setComparison(data);
    } catch (err) {
      setError('Failed to load comparison data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading comparison...</p>
          </div>
        </div>
      );
    }

    if (error || !comparison) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Failed to load comparison'}</p>
          <Button variant="primary" className="mt-4" onClick={fetchComparison}>
            Try Again
          </Button>
        </div>
      );
    }

    const [uni1, uni2] = comparison.universities;

    const ComparisonRow = ({ 
      label, 
      value1, 
      value2, 
      better 
    }: { 
      label: string; 
      value1: string | number; 
      value2: string | number; 
      better?: 'lower' | 'higher' | null;
    }) => {
      const getBgColor = (isFirst: boolean) => {
        if (!better) return '';
        
        const isValue1Better = better === 'lower' 
          ? Number(value1) < Number(value2)
          : Number(value1) > Number(value2);
        
        if (isFirst && isValue1Better) return 'bg-green-50 font-semibold';
        if (!isFirst && !isValue1Better) return 'bg-green-50 font-semibold';
        return '';
      };

      return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-gray-700">{label}</td>
          <td className={`py-3 px-4 text-center ${getBgColor(true)}`}>{value1}</td>
          <td className={`py-3 px-4 text-center ${getBgColor(false)}`}>{value2}</td>
        </tr>
      );
    };

    return (
      <div className="space-y-6">
        {/* University Headers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{uni1.name}</h3>
            <p className="text-primary-100">{uni1.city}, {uni1.country}</p>
            {uni1.ranking && (
              <div className="mt-3 inline-block bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                World Rank: #{uni1.ranking}
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{uni2.name}</h3>
            <p className="text-blue-100">{uni2.city}, {uni2.country}</p>
            {uni2.ranking && (
              <div className="mt-3 inline-block bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                World Rank: #{uni2.ranking}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Metric</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">{uni1.name}</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">{uni2.name}</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="Tuition Fee (Annual)"
                value1={formatCurrency(uni1.tuitionFee, uni1.currency)}
                value2={formatCurrency(uni2.tuitionFee, uni2.currency)}
                better="lower"
              />
              {uni1.ranking && uni2.ranking && (
                <ComparisonRow
                  label="World Ranking"
                  value1={`#${uni1.ranking}`}
                  value2={`#${uni2.ranking}`}
                  better="lower"
                />
              )}
              <ComparisonRow
                label="Established"
                value1={uni1.establishedYear}
                value2={uni2.establishedYear}
                better={null}
              />
              <ComparisonRow
                label="Acceptance Rate"
                value1={formatPercentage(uni1.acceptanceRate)}
                value2={formatPercentage(uni2.acceptanceRate)}
                better={null}
              />
              <ComparisonRow
                label="Employment Rate"
                value1={formatPercentage(uni1.employmentRate)}
                value2={formatPercentage(uni2.employmentRate)}
                better="higher"
              />
              <ComparisonRow
                label="Student Population"
                value1={formatNumber(uni1.studentPopulation)}
                value2={formatNumber(uni2.studentPopulation)}
                better={null}
              />
              <ComparisonRow
                label="International Students"
                value1={formatPercentage(uni1.internationalStudents)}
                value2={formatPercentage(uni2.internationalStudents)}
                better={null}
              />
              <ComparisonRow
                label="Campus Type"
                value1={uni1.campusType}
                value2={uni2.campusType}
                better={null}
              />
              <ComparisonRow
                label="Research Output"
                value1={uni1.researchOutput}
                value2={uni2.researchOutput}
                better={null}
              />
              <ComparisonRow
                label="Scholarship Available"
                value1={uni1.scholarshipAvailable ? 'Yes' : 'No'}
                value2={uni2.scholarshipAvailable ? 'Yes' : 'No'}
                better={null}
              />
            </tbody>
          </table>
        </div>

        {/* Programs Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Programs Offered</h4>
            <div className="flex flex-wrap gap-2">
              {uni1.programs.map((program) => (
                <span
                  key={program}
                  className={`text-xs px-3 py-1 rounded-full ${
                    uni2.programs.includes(program)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {program}
                  {uni2.programs.includes(program) && ' ✓'}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Programs Offered</h4>
            <div className="flex flex-wrap gap-2">
              {uni2.programs.map((program) => (
                <span
                  key={program}
                  className={`text-xs px-3 py-1 rounded-full ${
                    uni1.programs.includes(program)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {program}
                  {uni1.programs.includes(program) && ' ✓'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Key Differences</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Tuition difference: {formatCurrency(comparison.comparison.tuitionDifference, 'USD')} per year</li>
            {comparison.comparison.rankingDifference && (
              <li>• Ranking difference: {comparison.comparison.rankingDifference} positions</li>
            )}
            <li>• Acceptance rate difference: {formatPercentage(comparison.comparison.acceptanceRateDifference)}</li>
            <li>• Employment rate difference: {formatPercentage(comparison.comparison.employmentRateDifference)}</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="University Comparison"
      size="xl"
    >
      {renderContent()}
    </Modal>
  );
}
