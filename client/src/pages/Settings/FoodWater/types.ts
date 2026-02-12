// types.ts
export type FoodRow = {
  id: number;
  name: string;
  section: 'Food' | 'Drink' | 'Food & Drink';
  amount: number | null;
  unit: string;
  selected: boolean;
  quantity: number | null;
};
