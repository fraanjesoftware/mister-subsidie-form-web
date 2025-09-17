import { IconAlertCircle } from '@tabler/icons-react';

interface AlertProps {
  type: 'info' | 'warning' | 'error';
  children: React.ReactNode;
}

export const Alert = ({ type, children }: AlertProps) => {
  const styles = {
    info: 'bg-[var(--color-accent-light-4)] text-[var(--color-primary-medium-1)]',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800'
  };

  const iconColors = {
    info: 'text-[var(--color-accent)]',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className={`p-4 rounded-lg ${styles[type]}`}>
      <div className="flex items-start space-x-3">
        <IconAlertCircle className={`w-5 h-5 mt-0.5 ${iconColors[type]}`} />
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
};
