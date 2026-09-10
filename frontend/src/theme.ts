// Theme tokens synced from design_guidelines.json
export const colors = {
  surface: '#F4F6F9',
  onSurface: '#0D2237',
  surfaceSecondary: '#FFFFFF',
  onSurfaceSecondary: '#0D2237',
  surfaceTertiary: '#E2E8F0',
  onSurfaceTertiary: '#0D2237',
  surfaceInverse: '#0D2237',
  onSurfaceInverse: '#FFFFFF',
  brand: '#0D2237',
  brandPrimary: '#0D2237',
  onBrandPrimary: '#FFFFFF',
  brandSecondary: '#3B82F6',
  onBrandSecondary: '#FFFFFF',
  brandTertiary: '#EBF0F8',
  onBrandTertiary: '#0D2237',
  success: '#16A34A',
  onSuccess: '#FFFFFF',
  warning: '#F97316',
  onWarning: '#FFFFFF',
  error: '#DB2777',
  onError: '#FFFFFF',
  info: '#8B5CF6',
  onInfo: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#E2E8F0',
  muted: '#64748B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  fontFamily: 'Outfit_400Regular',
  fontFamilyMedium: 'Outfit_500Medium',
  fontFamilySemibold: 'Outfit_600Semibold',
  fontFamilyBold: 'Outfit_700Bold',
};

export function useTheme() {
  return { colors, spacing, radius, typography };
}
