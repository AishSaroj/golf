import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, ChevronDown, MoonStar, Sparkles, SunMedium, UserCircle } from 'lucide-react';
import api from '../../utils/api';
import { setNotifications, toggleTheme } from '../../features/ui/uiSlice';

export const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme, notifications } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await api.get('/notifications/my');
        if (response.data.success) {
          const nextNotifications = response.data.data.notifications || [];
          dispatch(setNotifications(nextNotifications));
          setUnreadCount(
            response.data.data.unreadCount ??
            nextNotifications.filter((notification) => !notification.isRead).length
          );
        }
      } catch {
        // Keep the navbar usable if notifications fail to load.
      }
    };

    fetchNotifications();
  }, [dispatch, isAuthenticated]);

  return (
    <nav className="fixed w-full z-50 border-b border-white/10 bg-obsidian/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald via-[#2dd4bf] to-[#f5c842] p-[1px] shadow-[0_0_30px_rgba(0,200,150,0.28)]">
            <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center text-emerald">
              <Sparkles size={16} />
            </div>
          </div>

          {/* ✅ CHANGED ONLY HERE */}
          <div className="hidden sm:block leading-none">
            <span className="block font-display font-bold text-xl tracking-tight">
              GOLF
            </span>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-text-secondary mt-1">
              Digital Heros
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-sm font-medium shadow-[0_10px_40px_rgba(0,0,0,0.16)]">
          <Link to="/how-it-works" className="rounded-full px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">How it Works</Link>
          <Link to="/charities" className="rounded-full px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">Charities</Link>
          <Link to="/draw-results" className="rounded-full px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">Draw Results</Link>
          <Link to="/pricing" className="rounded-full px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-text-primary flex items-center justify-center transition-all hover:scale-105 active:scale-97 shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>

          {isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-text-primary flex items-center justify-center transition-all hover:scale-105 active:scale-97 relative shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral text-[10px] leading-4 text-white text-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] glass-panel rounded-3xl shadow-2xl overflow-hidden classic-frame">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="font-display font-bold">Notifications</span>
                    <span className="text-xs text-text-secondary">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-text-secondary">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <Link
                          key={notification._id || notification.id}
                          to={notification.link || '/dashboard'}
                          className="block px-4 py-3 border-b border-border/50 hover:bg-surface-2 transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <div className="text-sm font-medium">{notification.title}</div>
                          <div className="text-xs text-text-secondary mt-1 line-clamp-2">{notification.message}</div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-white/5 px-2 pr-3 py-1.5 hover:border-emerald/30 hover:bg-white/10 transition-all">
              <div className="hidden sm:block text-right leading-tight">
                <span className="block text-[11px] uppercase tracking-[0.25em] text-text-secondary">Welcome</span>
                <span className="block text-sm font-medium">{user?.firstName || 'Dashboard'}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald/20 to-gold/20 border border-emerald/20 flex items-center justify-center text-emerald">
                <UserCircle size={22} className="opacity-80" />
              </div>
              <ChevronDown size={14} className="text-text-secondary hidden sm:block" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-primary hover:text-emerald transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};