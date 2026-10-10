import React from 'react';
import { Bell, CheckCheck, X, AlertTriangle, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Notifications</h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Live Agro-Met & Query Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white transition cursor-pointer flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications at the moment.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`pt-2.5 first:pt-0 flex items-start gap-3 p-3 rounded-2xl transition ${
                  n.isRead ? 'bg-slate-50/60' : 'bg-emerald-50/80 border border-emerald-200/70'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'alert'
                    ? 'bg-amber-100 text-amber-600'
                    : n.type === 'query'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'query' ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Center
          </button>
        </div>
      </div>
    </div>
  );
};
