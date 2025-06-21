import { AlertCircle } from 'lucide-react';

interface AlertProps {
  type: 'info' | 'warning' | 'error';
  children: React.ReactNode;
}

export const Alert = ({ type, children }: AlertProps) => {
  const styles = {
    info: 'bg-blue-50 text-blue-800',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800'
  };

  const iconColors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className={`p-4 rounded-lg ${styles[type]}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${iconColors[type]}`} />
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};