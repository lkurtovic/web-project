import { Brush, Utensils, Landmark, History, Drama } from 'lucide-react';

export const INTERESTS = [
  { key: 'art', icon: Brush, label: 'Art' },
  { key: 'food', icon: Utensils, label: 'Food' },
  { key: 'landmark', icon: Landmark, label: 'Landmark' },
  { key: 'history', icon: History, label: 'History' },
  { key: 'drama', icon: Drama, label: 'Drama' },
] as const;

export type InterestKey = (typeof INTERESTS)[number]['key'];
