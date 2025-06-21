interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
      {children}
    </div>
  );
};