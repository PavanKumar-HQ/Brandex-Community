import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Activity,
  GitPullRequest,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { getOrCreateIdentity } from '../../utils/identity';

export interface NotificationItem {
  id: string;
  userHandle?: string;
  title: string;
  message: string;
  category: 'booking' | 'application' | 'pr' | 'circle' | 'system';
  createdAt?: string;
  timestamp?: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  try {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - then) / 1000));

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());

  const identity = getOrCreateIdentity();

  // Load real notifications from backend
  const fetchLiveNotifications = async (notifyIfNew = false) => {
    try {
      const res = await fetch(`/api/pwa/notifications?handle=${encodeURIComponent(identity.handle)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          const items: NotificationItem[] = data.notifications;
          
          // Check for newly arrived unread notifications to trigger OS Push/Notification
          if (notifyIfNew && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            items.forEach((item) => {
              if (!item.read && !knownIdsRef.current.has(item.id)) {
                try {
                  new Notification(item.title, {
                    body: item.message,
                    icon: '/brandex-logo.webp'
                  });
                } catch {}
              }
            });
          }

          items.forEach((item) => knownIdsRef.current.add(item.id));
          setNotifications(items);
        }
      }
    } catch {
      // Backend temporarily offline or network blip
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
    fetchLiveNotifications(false);

    // Real-time live polling every 8 seconds
    const interval = setInterval(() => {
      fetchLiveNotifications(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [identity.handle]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/pwa/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: identity.handle })
      });
    } catch {}
  };

  const markItemAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch('/api/pwa/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  const handleRequestPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('This browser does not support Web Push notifications.');
      return;
    }

    setIsEnablingPush(true);
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);

      if (permission === 'granted') {
        fetch('/api/pwa/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userHandle: identity.handle,
            subscription: { endpoint: 'https://fcm.googleapis.com/fcm/send/brandex-live' }
          })
        }).catch(() => {});

        // Test push banner
        try {
          new Notification('Brandex Notifications Active', {
            body: 'Real-time alerts connected to live ecosystem database.',
            icon: '/brandex-logo.webp'
          });
        } catch {}

        await fetchLiveNotifications(false);
      }
    } catch {
      // User dismissed
    } finally {
      setIsEnablingPush(false);
    }
  };

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'booking':
        return <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'pr':
        return <GitPullRequest className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'application':
      case 'circle':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchLiveNotifications(false);
        }}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
        title="Live Notification Center"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in font-sans">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Live Notifications
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Database Feed" />
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLiveNotifications(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Refresh feed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Web Push Permission Banner */}
          {pushStatus !== 'granted' && (
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                  Real-time booking & admission alerts
                </span>
              </div>
              <button
                onClick={handleRequestPush}
                disabled={isEnablingPush}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors"
              >
                {isEnablingPush ? 'Enabling...' : 'Enable'}
              </button>
            </div>
          )}

          {/* List of Real Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications logged in the database yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer ${
                    item.read
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      : 'bg-indigo-50/25 dark:bg-indigo-950/15 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span
                        className={`text-xs font-bold truncate ${
                          item.read
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {formatRelativeTime(item.createdAt || item.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-6.5 leading-relaxed">
                    {item.message}
                  </p>

                  {item.actionUrl && (
                    <div className="mt-2 pl-6.5">
                      <NavLink
                        to={item.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>{item.actionLabel || 'View Status'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </NavLink>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Link to Tracker */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <NavLink
              to="/status"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Deterministic Reference Verifier →
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};
