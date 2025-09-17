const DEFAULT_API_BASE_URL = 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
const DEFAULT_FUNCTION_CODE = 'DDipjiIMeEVPtIY8Kx3C7hz4ME6us6EeDwddhRdoUhYKAzFuODcd5Q==';
const DEFAULT_TEMPLATE_ID = '4e941c38-804a-4a38-991c-146639ede747';

const sanitizeFunctionCode = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.replace(/^"|"$/g, '');
};

export const getApiBaseUrl = (): string => {
  const envValue = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return envValue?.trim() || DEFAULT_API_BASE_URL;
};

export const getOptionalFunctionCode = (): string | undefined => {
  const envValue = sanitizeFunctionCode(import.meta.env.VITE_FUNCTION_CODE as string | undefined);
  return envValue || undefined;
};

export const getFunctionCode = (): string => {
  return getOptionalFunctionCode() || DEFAULT_FUNCTION_CODE;
};

export const getSignWellTemplateId = (): string => {
  const envValue = import.meta.env.VITE_SIGNWELL_TEMPLATE_ID as string | undefined;
  return envValue?.trim() || DEFAULT_TEMPLATE_ID;
};

export { DEFAULT_API_BASE_URL, DEFAULT_FUNCTION_CODE, DEFAULT_TEMPLATE_ID };
