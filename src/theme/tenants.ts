import type { TenantId } from '../hooks/useTenantInfo';

interface TenantThemeColors {
  accent: string;
  accentLight1: string;
  accentLight2: string;
  accentLight3: string;
  accentLight4: string;
  primary: string;
  secondary: string;
  text: string;
  background: string;
  primaryDark: string;
  primaryMedium1: string;
  primaryMedium2: string;
  primaryLight1: string;
  primaryLight2: string;
  grayLight1: string;
  grayLight2: string;
  grayLight3: string;
  grayLight4: string;
  grayLight5: string;
  grayLight6: string;
  grayDark1: string;
  grayDark2: string;
  grayMedium: string;
  accentTransparent: string;
  primaryTransparent: string;
}

interface TenantThemeFonts {
  sans: string;
  heading: string;
}

export interface TenantTheme {
  colors: TenantThemeColors;
  fonts: TenantThemeFonts;
}

const DEFAULT_THEME: TenantTheme = {
  colors: {
    accent: '#C8DA47',
    accentLight1: '#D2E06C',
    accentLight2: '#DEE790',
    accentLight3: '#E8EFB5',
    accentLight4: '#F3F7DA',
    primary: '#03291F',
    secondary: '#C7DA46',
    text: '#1D1E1D',
    background: '#FAF8F6',
    primaryDark: '#03291F',
    primaryMedium1: '#1E3E35',
    primaryMedium2: '#455E57',
    primaryLight1: '#829490',
    primaryLight2: '#CED5D2',
    grayLight1: '#D3D4D3',
    grayLight2: '#FAF8F6',
    grayLight3: '#E9E6E4',
    grayLight4: '#CFCBCA',
    grayLight5: '#C2BFBD',
    grayLight6: '#ACA9A7',
    grayDark1: '#393E3A',
    grayDark2: '#5B5E5B',
    grayMedium: '#919392',
    accentTransparent: '#F3F7DA38',
    primaryTransparent: '#455E570A',
  },
  fonts: {
    sans: 'Raleway, sans-serif',
    heading: 'Raleway, sans-serif',
  },
};

const IGNITE_THEME: TenantTheme = {
  colors: {
    accent: '#FF7A00',
    accentLight1: '#FF9E42',
    accentLight2: '#FFB870',
    accentLight3: '#FFD1A3',
    accentLight4: '#FFE8CF',
    primary: '#1F2933',
    secondary: '#FF7A00',
    text: '#1F2933',
    background: '#FFF8F2',
    primaryDark: '#151C24',
    primaryMedium1: '#27323C',
    primaryMedium2: '#3B4651',
    primaryLight1: '#6B7783',
    primaryLight2: '#CBD2D9',
    grayLight1: '#D3D7DC',
    grayLight2: '#F8FAFB',
    grayLight3: '#ECEFF2',
    grayLight4: '#E2E6EB',
    grayLight5: '#D5DAE0',
    grayLight6: '#C0C7CF',
    grayDark1: '#3D4751',
    grayDark2: '#4E5863',
    grayMedium: '#7A828D',
    accentTransparent: '#FF7A0026',
    primaryTransparent: '#1F293314',
  },
  fonts: {
    sans: 'Poppins, sans-serif',
    heading: 'Poppins, sans-serif',
  },
};

export const TENANT_THEMES: Record<TenantId, TenantTheme> = {
  default: DEFAULT_THEME,
  mistersubsidie: DEFAULT_THEME,
  ignite: IGNITE_THEME,
};

const toCssVarName = (token: string): string =>
  token
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase();

export const applyTenantTheme = (tenantId: TenantId) => {
  if (typeof document === 'undefined') {
    return;
  }

  const theme = TENANT_THEMES[tenantId] ?? DEFAULT_THEME;
  const root = document.documentElement;

  root.setAttribute('data-tenant-theme', tenantId);

  Object.entries(theme.colors).forEach(([token, value]) => {
    root.style.setProperty(`--color-${toCssVarName(token)}`, value);
  });

  root.style.setProperty('--font-sans', theme.fonts.sans);
  root.style.setProperty('--font-heading', theme.fonts.heading);
};

export const getTenantTheme = (tenantId: TenantId): TenantTheme =>
  TENANT_THEMES[tenantId] ?? DEFAULT_THEME;
