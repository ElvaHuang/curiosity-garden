export const COLORS = {
  // Garden palette
  skyBlue: '#87CEEB',
  skyLight: '#B8E4F9',
  grassGreen: '#4CAF50',
  grassLight: '#81C784',
  grassDark: '#2E7D32',
  soilBrown: '#8D6E63',

  // UI
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  secondary: '#FF9800',
  accent: '#FFD54F',
  background: '#F1F8E9',
  surface: '#FFFFFF',
  text: '#2E3A23',
  textLight: '#6B7B5E',
  textOnPrimary: '#FFFFFF',
  error: '#E57373',

  // Category colors
  nature: '#66BB6A',
  numbers: '#42A5F5',
  stories: '#AB47BC',
  'how-things-work': '#FF7043',
  people: '#EC407A',
  wonder: '#FFD54F',
} as const;

export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
