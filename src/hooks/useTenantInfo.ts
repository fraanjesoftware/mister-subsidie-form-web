import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_AUTHORIZATION_CONFIG, type AuthorizationConfig } from '../config/authorization';

export type TenantId = 'default' | 'mistersubsidie' | 'ignite';

export interface TenantInfoMeta {
  requestedId: string | null;
  tenantId: string;
  resolvedFromDefault: boolean;
}

export type TenantInfoStatus = 'idle' | 'loading' | 'success' | 'error';

interface TenantInfoResponse {
  gemachtigde?: string;
  gemachtigde_email?: string;
  gemachtigde_naam?: string;
  gemachtigde_telefoon?: string;
  gemachtigde_kvk?: string;
  meta?: TenantInfoMeta;
}

export interface UseTenantInfoResult {
  tenantId: TenantId;
  authorization: AuthorizationConfig;
  status: TenantInfoStatus;
  error: string | null;
  meta: TenantInfoMeta | null;
}

const DEFAULT_API_BASE_URL = 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';

const KNOWN_TENANTS: TenantId[] = ['default', 'mistersubsidie', 'ignite'];

const sanitizeFunctionCode = (value?: string): string => {
  if (!value) return '';
  return value.replace(/^"|"$/g, '');
};

const coerceTenantId = (candidate?: string | null): TenantId => {
  if (!candidate) return 'default';
  const normalized = candidate.trim().toLowerCase();
  return (KNOWN_TENANTS as string[]).includes(normalized) ? (normalized as TenantId) : 'default';
};

const isLocalHostname = (hostname: string): boolean => {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('127.') ||
    hostname === '[::1]' ||
    hostname.endsWith('.local')
  );
};

const isTenantOverrideAllowed = (hostname: string): boolean => {
  if (import.meta.env.DEV) {
    return true;
  }

  if ((import.meta.env.VITE_ALLOW_TENANT_OVERRIDE ?? '').toLowerCase() === 'true') {
    return true;
  }

  return isLocalHostname(hostname);
};

const determineTenantId = (): TenantId => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const hostname = window.location.hostname.toLowerCase();

  const envTenant = coerceTenantId(import.meta.env.VITE_TENANT_ID);
  if (envTenant !== 'default') {
    return envTenant;
  }

  if (isTenantOverrideAllowed(hostname)) {
    const queryTenant = new URLSearchParams(window.location.search).get('tenant');
    if (queryTenant) {
      return coerceTenantId(queryTenant);
    }
  }

  if (!hostname || isLocalHostname(hostname)) {
    return 'default';
  }

  if (hostname.includes('ignite')) {
    return 'ignite';
  }

  if (hostname.includes('mistersubsidie')) {
    return 'mistersubsidie';
  }

  const [subdomain] = hostname.split('.');

  if (subdomain?.includes('ignite')) {
    return 'ignite';
  }

  if (subdomain?.includes('mister') || subdomain?.includes('ms')) {
    return 'mistersubsidie';
  }

  return 'default';
};

const mapResponseToAuthorization = (response: TenantInfoResponse): AuthorizationConfig => ({
  organisatie: response.gemachtigde ?? DEFAULT_AUTHORIZATION_CONFIG.organisatie,
  kvkNummer: response.gemachtigde_kvk ?? DEFAULT_AUTHORIZATION_CONFIG.kvkNummer,
  contactpersoon: response.gemachtigde_naam ?? DEFAULT_AUTHORIZATION_CONFIG.contactpersoon,
  email: response.gemachtigde_email ?? DEFAULT_AUTHORIZATION_CONFIG.email,
  telefoon: response.gemachtigde_telefoon ?? DEFAULT_AUTHORIZATION_CONFIG.telefoon,
});

export const useTenantInfo = (): UseTenantInfoResult => {
  const [authorization, setAuthorization] = useState<AuthorizationConfig>(DEFAULT_AUTHORIZATION_CONFIG);
  const [status, setStatus] = useState<TenantInfoStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TenantInfoMeta | null>(null);

  const tenantId = useMemo(determineTenantId, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAuthorization = async () => {
      setStatus('loading');
      setError(null);

      try {
        const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL;
        const apiFunctionCode = sanitizeFunctionCode(import.meta.env.VITE_FUNCTION_CODE as string | undefined);

        const endpoint = new URL(`${apiBaseUrl.replace(/\/$/, '')}/api/getAuthorizedRepresentativeInfo`);

        if (apiFunctionCode) {
          endpoint.searchParams.set('code', apiFunctionCode);
        }

        const response = await fetch(endpoint.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: tenantId }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as TenantInfoResponse;

        if (!isMounted) {
          return;
        }

        setAuthorization(mapResponseToAuthorization(data));
        setMeta(data.meta ?? null);
        setStatus('success');
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load authorized representative info:', err);
        setError(err instanceof Error ? err.message : 'Onbekende fout');
        setStatus('error');
        setMeta(null);
        // Keep default authorization data as fallback
      }
    };

    fetchAuthorization();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  return {
    tenantId,
    authorization,
    status,
    error,
    meta,
  };
};
