import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_AUTHORIZATION_CONFIG, type AuthorizationConfig } from '../config/authorization';

type TenantId = 'default' | 'mistersubsidie' | 'ignite';

interface AuthorizationInfoMeta {
  requestedId: string | null;
  tenantId: string;
  resolvedFromDefault: boolean;
}

type AuthorizationFetchStatus = 'idle' | 'loading' | 'success' | 'error';

interface AuthorizedRepresentativeResponse {
  gemachtigde?: string;
  gemachtigde_email?: string;
  gemachtigde_naam?: string;
  gemachtigde_telefoon?: string;
  gemachtigde_kvk?: string;
  meta?: AuthorizationInfoMeta;
}

interface UseAuthorizationInfoResult {
  tenantId: TenantId;
  authorization: AuthorizationConfig;
  status: AuthorizationFetchStatus;
  error: string | null;
  meta: AuthorizationInfoMeta | null;
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

const determineTenantId = (): TenantId => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const searchParams = new URLSearchParams(window.location.search);
  const queryTenant = searchParams.get('tenant');
  if (queryTenant) {
    return coerceTenantId(queryTenant);
  }

  const envTenant = coerceTenantId(import.meta.env.VITE_TENANT_ID);
  if (envTenant !== 'default') {
    return envTenant;
  }

  const hostname = window.location.hostname.toLowerCase();

  if (!hostname || hostname === 'localhost' || hostname.startsWith('127.') || hostname === '[::1]') {
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

const mapResponseToAuthorization = (response: AuthorizedRepresentativeResponse): AuthorizationConfig => ({
  organisatie: response.gemachtigde ?? DEFAULT_AUTHORIZATION_CONFIG.organisatie,
  kvkNummer: response.gemachtigde_kvk ?? DEFAULT_AUTHORIZATION_CONFIG.kvkNummer,
  contactpersoon: response.gemachtigde_naam ?? DEFAULT_AUTHORIZATION_CONFIG.contactpersoon,
  email: response.gemachtigde_email ?? DEFAULT_AUTHORIZATION_CONFIG.email,
  telefoon: response.gemachtigde_telefoon ?? DEFAULT_AUTHORIZATION_CONFIG.telefoon,
});

export const useAuthorizationInfo = (): UseAuthorizationInfoResult => {
  const [authorization, setAuthorization] = useState<AuthorizationConfig>(DEFAULT_AUTHORIZATION_CONFIG);
  const [status, setStatus] = useState<AuthorizationFetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<AuthorizationInfoMeta | null>(null);

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

        const data = (await response.json()) as AuthorizedRepresentativeResponse;

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
