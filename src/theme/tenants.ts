import type { TenantId } from '../hooks/useTenantInfo';

interface TenantThemeColors {
  accent: string;
  accentLight1: string;
  accentLight2: string;
  accentLight3: string;
  accentLight4: string;
  accentLight5: string;
  primary: string;
  secondary: string;
  text: string;
  stepText: string;
  background: string;
  primaryDark: string;
  primaryMedium1: string;
  primaryMedium2: string;
  primaryLight1: string;
  primaryLight2: string;
  titleText: string;
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
  alertInfoBackground: string;
  alertInfoText: string;
  alertInfoIcon: string;
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
    accentLight5: '#F3F7DA',
    primary: '#03291F',
    secondary: '#C7DA46',
    text: '#1D1E1D',
    titleText: '#1D1E1D',
    stepText: '#1D1E1D',
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
    alertInfoBackground: '#FFFFFF',
    alertInfoText: '#1E3E35',
    alertInfoIcon: '#1E3E35',
  },
  fonts: {
    sans: 'Raleway, sans-serif',
    heading: 'Raleway, sans-serif',
  },
};

const ALT_THEME: TenantTheme = {
  colors: {
    accent: '#C8DA47',
    accentLight1: '#D2E06C',
    accentLight2: '#C8DA47',
    accentLight3: '#E8EFB5',
    accentLight4: '#F3F7DA',
    accentLight5: '#F3F7DA',
    primary: '#03291F',
    secondary: '#C7DA46',
    text: '#1D1E1D',
    titleText: '#1E3E36',
    stepText: '#C8DA47',
    background: '#1E3E36',
    primaryDark: '#03291F',
    primaryMedium1: '#1E3E35',
    primaryMedium2: '#455E57',
    primaryLight1: '#829490',
    primaryLight2: '#CED5D2',
    grayLight1: '#D3D4D3',
    grayLight2: '#FAF8F6',
    grayLight3: '#e9e6e442',
    grayLight4: '#CFCBCA',
    grayLight5: '#C2BFBD',
    grayLight6: '#ACA9A7',
    grayDark1: '#393E3A',
    grayDark2: '#5B5E5B',
    grayMedium: '#919392',
    accentTransparent: '#F3F7DA38',
    primaryTransparent: '#455E570A',
    alertInfoBackground: '#FFFFFF',
    alertInfoText: '#1E3E35',
    alertInfoIcon: '#1E3E35',
  },
  fonts: {
    sans: 'Raleway, sans-serif',
    heading: 'Raleway, sans-serif',
  },
};

const IGNITE_THEME: TenantTheme = {
  colors: {
    accent: '#0AEBBF',
    accentLight1: '#EBFFF7',
    accentLight2: '#0AEBBF',
    accentLight3: '#763bbe54',
    accentLight4: '#EBEBF7',
    accentLight5: '#EBFFF7',
    primary: '#1E063D',
    secondary: '#0AEBBF',
    text: '#000000',
    titleText: '#5F40B0',
    stepText: "#0AEBBF",
    background: '#351F51',
    primaryDark: '#120329',
    primaryMedium1: '#32105F',
    primaryMedium2: '#4A1F8C',
    primaryLight1: '#8A64C9',
    primaryLight2: '#C4ACE7',
    grayLight1: '#D9CEF6',
    grayLight2: '#F5F2FF',
    grayLight3: '#b5aedf4b',
    grayLight4: '#E2E0F5',
    grayLight5: '#CCC6EA',
    grayLight6: '#B5AEDF',
    grayDark1: '#5E3FB0',
    grayDark2: '#753BBD',
    grayMedium: '#9A7ED2',
    accentTransparent: 'rgba(10, 235, 191, 0.16)',
    primaryTransparent: 'rgba(30, 6, 61, 0.1)',
    alertInfoBackground: '#FFFFFF',
    alertInfoText: '#32105F',
    alertInfoIcon: '#0AEBBF',
  },
  fonts: {
    sans: '"Space Grotesk", sans-serif',
    heading: '"Space Grotesk", sans-serif',
  },
};

export const TENANT_THEMES: Record<TenantId, TenantTheme> = {
  default: DEFAULT_THEME,
  mistersubsidie: DEFAULT_THEME,
  ignite: IGNITE_THEME,
  test: ALT_THEME,
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
