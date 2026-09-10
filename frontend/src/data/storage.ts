import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './types';

const KEY = 'conti-viaggio-v1';

export const defaultState: AppState = {
  trip: { name: '', cur: '€', people: 1, budget: '', from: '', to: '' },
  items: [],
  custom: [],
  open: {},
};

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      trip: { ...defaultState.trip, ...(parsed.trip || {}) },
      items: Array.isArray(parsed.items) ? parsed.items : [],
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      open: parsed.open || {},
    };
  } catch {
    return defaultState;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
