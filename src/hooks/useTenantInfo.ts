import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_AUTHORIZATION_CONFIG, type AuthorizationConfig } from '../config/authorization';
import { getApiBaseUrl, getOptionalFunctionCode } from '../config/api';
import { isLocalHostname } from '../utils/environment';

export type TenantId = 'default' | 'mistersubsidie' | 'ignite' | 'test';

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

const KNOWN_TENANTS: TenantId[] = ['default', 'mistersubsidie', 'ignite', 'test'];

const coerceTenantId = (candidate?: string | null): TenantId => {
  if (!candidate) return 'default';
  const normalized = candidate.trim().toLowerCase();
  return (KNOWN_TENANTS as string[]).includes(normalized) ? (normalized as TenantId) : 'default';
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

  if (hostname.includes('test')) {
    return 'test';
  }

  const [subdomain] = hostname.split('.');

  if (subdomain?.includes('ignite')) {
    return 'ignite';
  }

  if (subdomain?.includes('mister')) {
    return 'mistersubsidie';
  }

    if (subdomain?.includes('test')) {
    return 'test';
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
        const apiBaseUrl = getApiBaseUrl();
        const apiFunctionCode = getOptionalFunctionCode();

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
