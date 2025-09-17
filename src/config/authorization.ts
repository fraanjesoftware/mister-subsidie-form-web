export interface AuthorizationConfig {
  organisatie: string;
  kvkNummer: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
}

export const DEFAULT_AUTHORIZATION_CONFIG: AuthorizationConfig = {
  organisatie: import.meta.env.VITE_AUTH_ORGANISATIE || 'Tim Otte/NOT-Company bv h.o.d.n. Mistersubsidie',
  kvkNummer: import.meta.env.VITE_AUTH_KVK_NUMMER || '24353031',
  contactpersoon: import.meta.env.VITE_AUTH_CONTACTPERSOON || 'Tim Otte',
  email: import.meta.env.VITE_AUTH_EMAIL || 'Tim@mistersubsidie.nl',
  telefoon: import.meta.env.VITE_AUTH_TELEFOON || '06 11 24 13 60',
};

// Backwards compatible export for legacy imports (can be removed once unused)
export const authorizationConfig = DEFAULT_AUTHORIZATION_CONFIG;
