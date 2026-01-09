
import React, { useEffect } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />
  };

  const bgColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
    error: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50'
  };

  return (
    <div className={`
      fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-[24px] border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-10 fade-in duration-500
      ${bgColors[type]}
    `}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight pr-4">
        {message}
      </p>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-all"
      >
        <X size={16} className="text-slate-400" />
      </button>
    </div>
  );
};

export default Toast;
