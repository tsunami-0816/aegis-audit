import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/classNames';
import type { ToastMessage } from '@/types';

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export const Toast = ({ messages, onRemove }: ToastProps) => {
  useEffect(() => {
    messages.forEach((msg) => {
      const timer = setTimeout(() => {
        onRemove(msg.id);
      }, 4000);
      return () => clearTimeout(timer);
    });
  }, [messages, onRemove]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((msg) => {
        const Icon = icons[msg.type];
        return (
          <div
            key={msg.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-[slideIn_0.3s_ease-out]',
              styles[msg.type]
            )}
            style={{
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <Icon className={cn('h-5 w-5 flex-shrink-0', iconStyles[msg.type])} />
            <p className="text-sm font-medium">{msg.message}</p>
            <button
              onClick={() => onRemove(msg.id)}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
