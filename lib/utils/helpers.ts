import { type ClassValue, clsx } from './clsx';

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency with proper symbol and localization
 */
export function formatCurrency(amount: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    CAD: 'C$',
    AUD: 'A$',
    SGD: 'S$',
    CHF: 'CHF',
    JPY: '¥',
    CNY: '¥',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format based on currency
  if (currency === 'JPY' || currency === 'CNY') {
    return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format percentage
 */
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

/**
 * Build URL with query parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        searchParams.set(key, value.join(','));
      } else if (!Array.isArray(value)) {
        searchParams.set(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get color class based on ranking
 */
export function getRankingColor(ranking: number | null): string {
  if (!ranking) return 'text-gray-500';
  if (ranking <= 10) return 'text-yellow-600 font-bold';
  if (ranking <= 50) return 'text-blue-600 font-semibold';
  if (ranking <= 100) return 'text-green-600';
  return 'text-gray-600';
}

/**
 * Get acceptance rate category
 */
export function getAcceptanceCategory(rate: number): string {
  if (rate < 10) return 'Highly Selective';
  if (rate < 30) return 'Very Selective';
  if (rate < 50) return 'Selective';
  return 'Moderately Selective';
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
