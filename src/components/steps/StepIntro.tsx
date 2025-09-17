import type { ReactNode } from 'react';

interface StepIntroProps {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export const StepIntro = ({ title, description, children }: StepIntroProps) => {
  return (
    <div className="space-y-2 mb-6">
      <h3 className="text-xl font-semibold text-[var(--color-title-text)]">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </div>
  );
};
