import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react';
import { useTenantInfo, type UseTenantInfoResult } from '../hooks/useTenantInfo';
import { applyTenantTheme } from '../theme/tenants';

const TenantContext = createContext<UseTenantInfoResult | null>(null);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const tenantInfo = useTenantInfo();

  useLayoutEffect(() => {
    applyTenantTheme(tenantInfo.tenantId);
  }, [tenantInfo.tenantId]);

  return (
    <TenantContext.Provider value={tenantInfo}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): UseTenantInfoResult => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
};
