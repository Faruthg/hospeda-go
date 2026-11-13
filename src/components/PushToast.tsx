import React, { useEffect } from 'react';
import { Bell, X, ExternalLink, Calendar, CreditCard, MessageSquare, Car } from 'lucide-react';
import { PushNotification } from '../types';

interface PushToastProps {
  notification: PushNotification | null;
  onClose: () => void;
  onOpenCenter: () => void;
  onActionClick?: (url: string) => void;
}

export const PushToast: React.FC<PushToastProps> = ({
  notification,
  onClose,
  onOpenCenter,
  onActionClick
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'ride':
        return <Car className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div 
        onClick={onOpenCenter}
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-4 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                Notificación Push en Vivo
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                {notification.timestamp}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {notification.message}
            </p>
            {notification.actionUrl && onActionClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick(notification.actionUrl!);
                  onClose();
                }}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
              >
                <span>Ver en la app</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
