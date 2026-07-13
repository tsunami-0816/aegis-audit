import { cn } from '@/utils/classNames';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  );
};
