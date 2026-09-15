import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  GitPullRequest,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { getOrCreateIdentity } from '../../utils/identity';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'booking' | 'application' | 'pr' | 'circle';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Service Booking Engine Live',
    message: 'Architecture scalability audits and GenAI agent sprints are now open for Q4 2026.',
    category: 'booking',
    timestamp: '10 mins ago',
    read: false,
    actionUrl: '/services',
    actionLabel: 'Book Sprint'
  },
  {
    id: 'notif-2',
    title: 'Good First Issues Available',
    message: '5 new beginner-friendly issues added to Swiss Editorial UI and Geniusphere repos.',
    category: 'pr',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/projects',
    actionLabel: 'View Registry'
  },
  {
    id: 'notif-3',
    title: 'Domain Circles Admissions Active',
    message: 'Review cycle open for AI Engineering and Distributed Systems circles.',
    category: 'circle',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/community',
    actionLabel: 'Explore Circles'
  }
];

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brandex_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('brandex_notifications', JSON.stringify(notifications));
  }, [notifications]);

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
        const identity = getOrCreateIdentity();
        // Send mock subscription registration to backend
        fetch('/api/pwa/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userHandle: identity.handle,
            endpoint: 'https://fcm.googleapis.com/fcm/send/brandex-demo-token',
            p256dh: 'mock-p256dh-key',
            auth: 'mock-auth-secret'
          })
        }).catch(() => {});

        // Add confirmation notification
        const welcomeNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'Push Notifications Enabled',
          message: 'You will receive real-time alerts when your application or booking status updates.',
          category: 'application',
          timestamp: 'Just now',
          read: false,
          actionUrl: '/status',
          actionLabel: 'View Tracker'
        };
        setNotifications((prev) => [welcomeNotif, ...prev]);
      }
    } catch {
      // Permission denied or dismissed
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
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
        title="Notification Center"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
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
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Web Push Permission Banner */}
          {pushStatus !== 'granted' && (
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                  Get real-time booking & admission alerts
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

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer ${
                    item.read
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      : 'bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          item.read
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.timestamp}
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
                        <span>{item.actionLabel || 'View Details'}</span>
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
              Track Application & Booking Status →
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};
