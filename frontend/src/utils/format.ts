import { Item, Trip } from '../data/types';

export function money(v: number): string {
  const sign = v < 0 ? '-' : '';
  return (
    sign +
    Math.abs(v).toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function num(s: string | number): number {
  if (typeof s === 'number') return s;
  const t = String(s || '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.\-]/g, '');
  const n = parseFloat(t);
  return isNaN(n) ? 0 : n;
}

export function today(): string {
  const d = new Date();
  const p = (x: number) => (x < 10 ? '0' : '') + x;
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

export function dateLabel(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  const y = parts[0];
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(m) || isNaN(d)) return iso;
  return d + ' ' + MONTHS[m] + ' ' + y.slice(-2);
}

export function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (isNaN(a) || isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86400000) + 1;
}

export type Totals = { out: number; inc: number; net: number };

export function computeTotals(items: Item[]): Totals {
  let out = 0;
  let inc = 0;
  items.forEach((it) => {
    if (it.kind === 'in') inc += it.amount;
    else out += it.amount;
  });
  return { out, inc, net: out - inc };
}

export function groupByCategory(items: Item[], kind: 'out' | 'in'): Record<string, Item[]> {
  const map: Record<string, Item[]> = {};
  items.forEach((it) => {
    if (it.kind !== kind) return;
    if (!map[it.cat]) map[it.cat] = [];
    map[it.cat].push(it);
  });
  Object.values(map).forEach((arr) =>
    arr.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  );
  return map;
}

export function sumItems(items: Item[]): number {
  return items.reduce((a, b) => a + b.amount, 0);
}

export function budgetInfo(trip: Trip, totals: Totals) {
  const b = num(trip.budget);
  if (!b) return null;
  const left = b - totals.net;
  const perc = Math.min(100, Math.max(0, (totals.net / b) * 100));
  return { budget: b, left, perc };
}
