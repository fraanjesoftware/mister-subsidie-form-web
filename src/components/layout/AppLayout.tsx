import type { ReactNode } from 'react';
import { TenantHeader, TenantFooter } from '../form';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <div className="flex-shrink-0">
        <TenantHeader />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <div className="flex-shrink-0">
        <TenantFooter />
      </div>
    </div>
  );
};
