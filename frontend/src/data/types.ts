export type Category = {
  id: string;
  n: string;
  e: string;
  c: string; // main color
  s: string; // soft color
  mia?: boolean; // custom
};

export type IncomeCategory = Category;

export type PaletteColor = { c: string; s: string };

export type Item = {
  id: string;
  cat: string;
  kind: 'out' | 'in';
  amount: number;
  desc: string;
  date: string; // YYYY-MM-DD
};

export type Trip = {
  name: string;
  cur: string;
  people: number;
  budget: string;
  from: string;
  to: string;
};

export type AppState = {
  trip: Trip;
  items: Item[];
  custom: Category[];
  open: Record<string, boolean>;
};
