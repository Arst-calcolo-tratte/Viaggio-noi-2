import { Category, IncomeCategory, PaletteColor } from './types';

export const CATS: Category[] = [
  { id: 'aereo', n: 'Aereo', e: '✈️', c: '#3b82f6', s: '#e4efff' },
  { id: 'treno', n: 'Treno', e: '🚆', c: '#6366f1', s: '#e9e9ff' },
  { id: 'nave', n: 'Nave o traghetto', e: '⛴️', c: '#0ea5b7', s: '#e0f6f9' },
  { id: 'noleggio', n: 'Noleggio auto', e: '🚗', c: '#f97316', s: '#ffeede' },
  { id: 'carbur', n: 'Carburante', e: '⛽️', c: '#e11d48', s: '#ffe6ec' },
  { id: 'pedaggi', n: 'Pedaggi', e: '🛣️', c: '#a16207', s: '#fbf0d9' },
  { id: 'parch', n: 'Parcheggio', e: '🅿️', c: '#2563eb', s: '#e5edff' },
  { id: 'taxi', n: 'Taxi e bus', e: '🚕', c: '#eab308', s: '#fdf4d3' },
  { id: 'alloggio', n: 'Alloggio', e: '🏨', c: '#8b5cf6', s: '#f0e9ff' },
  { id: 'cibo', n: 'Ristoranti', e: '🍝', c: '#f43f5e', s: '#ffe8ec' },
  { id: 'spesa', n: 'Spesa e bar', e: '🛒', c: '#16a34a', s: '#e3f7e8' },
  { id: 'visite', n: 'Visite e musei', e: '🎟️', c: '#0891b2', s: '#e0f4fa' },
  { id: 'attivita', n: 'Attività', e: '🏄', c: '#0d9488', s: '#ddf5f1' },
  { id: 'shopping', n: 'Shopping', e: '🛍️', c: '#db2777', s: '#ffe7f2' },
  { id: 'souvenir', n: 'Souvenir', e: '🎁', c: '#c026d3', s: '#fbe7fe' },
  { id: 'assic', n: 'Assicurazione', e: '🛡️', c: '#475569', s: '#eaeef3' },
  { id: 'docum', n: 'Documenti', e: '🛂', c: '#334155', s: '#e8ecf1' },
  { id: 'bagagli', n: 'Bagagli', e: '🧳', c: '#b45309', s: '#fbeedb' },
  { id: 'sim', n: 'SIM e internet', e: '📶', c: '#0284c7', s: '#e0f0fb' },
  { id: 'salute', n: 'Farmacia', e: '💊', c: '#dc2626', s: '#ffe6e6' },
  { id: 'ospedale', n: 'Medico e ospedale', e: '🏥', c: '#be123c', s: '#ffe4ea' },
  { id: 'meccanico', n: 'Meccanico', e: '🔧', c: '#78716c', s: '#f0eeec' },
  { id: 'multe', n: 'Multe', e: '🚨', c: '#b91c1c', s: '#ffe3e3' },
  { id: 'soggiorno', n: 'Tassa di soggiorno', e: '🏛️', c: '#57534e', s: '#eeecea' },
  { id: 'cambio', n: 'Cambio e commissioni', e: '💱', c: '#15803d', s: '#e2f6e8' },
  { id: 'campeggio', n: 'Campeggio', e: '⛺', c: '#4d7c0f', s: '#eef7db' },
  { id: 'scooter', n: 'Scooter e bici', e: '🛵', c: '#ea580c', s: '#ffece0' },
  { id: 'attrezz', n: 'Attrezzatura', e: '🎿', c: '#0369a1', s: '#e2f0fa' },
  { id: 'benessere', n: 'Benessere e spa', e: '💆', c: '#be185d', s: '#ffe6f0' },
  { id: 'spiaggia', n: 'Spiaggia', e: '🏖️', c: '#0e7490', s: '#e0f4f8' },
  { id: 'bimbi', n: 'Bimbi', e: '🧸', c: '#c2410c', s: '#ffeadf' },
  { id: 'imprev', n: 'Imprevisti', e: '🆘', c: '#dc2626', s: '#ffe6e6' },
  { id: 'mance', n: 'Mance', e: '🪙', c: '#ca8a04', s: '#fcf3d6' },
  { id: 'lavand', n: 'Lavanderia', e: '🧺', c: '#65a30d', s: '#f0f8dd' },
  { id: 'animali', n: 'Animali', e: '🐾', c: '#7c3aed', s: '#efe8ff' },
  { id: 'altro', n: 'Varie ed eventuali', e: '✨', c: '#64748b', s: '#edf1f5' },
];

export const INCOMES: IncomeCategory[] = [
  { id: 'rimborso', n: 'Rimborso', e: '💶', c: '#17bfa6', s: '#dcf7f2' },
  { id: 'quota', n: 'Quota amici', e: '🤝', c: '#16a34a', s: '#e3f7e8' },
  { id: 'cashback', n: 'Cashback', e: '💳', c: '#0d9488', s: '#ddf5f1' },
  { id: 'rivendita', n: 'Rivendita', e: '🔁', c: '#0891b2', s: '#e0f4fa' },
  { id: 'altroin', n: 'Altro rientro', e: '➕', c: '#65a30d', s: '#f0f8dd' },
];

export const PALETTE: PaletteColor[] = [
  { c: '#7c3aed', s: '#efe8ff' },
  { c: '#0891b2', s: '#e0f4fa' },
  { c: '#ea580c', s: '#ffece0' },
  { c: '#16a34a', s: '#e3f7e8' },
  { c: '#db2777', s: '#ffe7f2' },
  { c: '#2563eb', s: '#e5edff' },
  { c: '#ca8a04', s: '#fcf3d6' },
  { c: '#0d9488', s: '#ddf5f1' },
];

export const FREE_EMOJI = ['⭐', '🔖', '🧾', '📌', '🎯', '🧩', '🔔', '🍀', '🔥', '💡', '🎨', '🧭', '🛎️', '🎪', '🚀', '🪄'];
