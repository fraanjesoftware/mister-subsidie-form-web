import type { TenantId } from '../hooks/useTenantInfo';

const DEFAULT_API_BASE_URL = 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
const DEFAULT_FUNCTION_CODE = 'DDipjiIMeEVPtIY8Kx3C7hz4ME6us6EeDwddhRdoUhYKAzFuODcd5Q==';
const DEFAULT_TEMPLATE_ID = '4e941c38-804a-4a38-991c-146639ede747';
const TEST_API_BASE_URL = 'https://ignite-group-form-api-hfamc6fphyg7hadz.westeurope-01.azurewebsites.net';
const TEST_FUNCTION_CODE = 'aFcWAoezMMHtnnBPc82qK4FpRYt6AwN9SIZtXCLECVvuAzFuhFUK3g==';

const TENANT_API_OVERRIDES: Partial<Record<TenantId, { baseUrl?: string; functionCode?: string }>> = {
  test: {
    baseUrl: TEST_API_BASE_URL,
    functionCode: TEST_FUNCTION_CODE,
  },
};

const sanitizeFunctionCode = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.replace(/^"|"$/g, '');
};

export const getApiBaseUrl = (tenantId?: TenantId): string => {
  if (tenantId) {
    const override = TENANT_API_OVERRIDES[tenantId]?.baseUrl;
    if (override) {
      return override;
    }
  }

  const envValue = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return envValue?.trim() || DEFAULT_API_BASE_URL;
};

export const getOptionalFunctionCode = (tenantId?: TenantId): string | undefined => {
  if (tenantId) {
    const override = TENANT_API_OVERRIDES[tenantId]?.functionCode;
    if (override) {
      return override;
    }
  }

  const envValue = sanitizeFunctionCode(import.meta.env.VITE_FUNCTION_CODE as string | undefined);
  return envValue || undefined;
};

export const getFunctionCode = (tenantId?: TenantId): string => {
  return getOptionalFunctionCode(tenantId) || DEFAULT_FUNCTION_CODE;
};

export const getSignWellTemplateId = (): string => {
  const envValue = import.meta.env.VITE_SIGNWELL_TEMPLATE_ID as string | undefined;
  return envValue?.trim() || DEFAULT_TEMPLATE_ID;
};

export { DEFAULT_API_BASE_URL, DEFAULT_FUNCTION_CODE, DEFAULT_TEMPLATE_ID };
