import React, { useState } from 'react';
import { 
  X, 
  CheckCheck, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Car, 
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onNavigateAction: (target: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearNotifications,
  onNavigateAction
}) => {
  const [filter, setFilter] = useState<'all' | 'booking' | 'payment' | 'chat' | 'ride'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'ride':
        return <Car className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Notificaciones Push
            </h2>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 tabular-nums">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Leídas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar (Segmented Controls §1.A) */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {(['all', 'booking', 'payment', 'chat', 'ride'] as const).map(tabKey => {
              const labels = {
                all: 'Todas',
                booking: 'Reservas',
                payment: 'Pagos',
                chat: 'Chat',
                ride: 'Viajes'
              };
              return (
                <button
                  key={tabKey}
                  onClick={() => setFilter(tabKey)}
                  className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                    filter === tabKey
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {labels[tabKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No tienes notificaciones en esta categoría</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Las alertas de reservas, pagos en vivo y mensajes aparecerán aquí.
              </p>
            </div>
          ) : (
            filtered.map(notification => (
              <div
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notification.read
                    ? 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {notification.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.actionUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                          onClose();
                          onNavigateAction(notification.actionUrl!);
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        <span>Abrir detalle</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs text-slate-500">
            <span>{notifications.length} notificaciones registradas</span>
            <button
              onClick={onClearNotifications}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
