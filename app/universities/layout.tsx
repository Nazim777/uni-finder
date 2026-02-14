import { Metadata } from 'next';
import UniversitiesPage from './page';

export const metadata: Metadata = {
  title: 'Find Universities | Search & Compare Top Universities Worldwide',
  description: 'Search and compare universities from around the world. Filter by country, tuition fees, rankings, acceptance rates, and programs. Find your perfect university match with detailed comparisons.',
  keywords: [
    'find universities',
    'university search',
    'compare universities',
    'university rankings',
    'tuition fees comparison',
    'study abroad universities',
    'acceptance rates',
    'university programs',
    'higher education search'
  ],
  openGraph: {
    title: 'Find Universities | Search & Compare Top Universities',
    description: 'Search and compare universities worldwide with advanced filters',
    type: 'website',
  },
  alternates: {
    canonical: '/universities',
  },
};

export default UniversitiesPage;
