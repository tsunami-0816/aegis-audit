import { cn } from '@/utils/classNames';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = ({ 
  label, 
  icon, 
  error, 
  className, 
  type = 'text',
  ...props 
}: InputProps) => {
  const inputStyles = cn(
    'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none',
    icon && 'pl-10',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className
  );

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input type={type} className={inputStyles} {...props} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
