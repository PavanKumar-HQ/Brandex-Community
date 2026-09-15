import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Code2, Users, Menu } from 'lucide-react';

interface MobileBottomBarProps {
  onOpenMenu: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenMenu }) => {
  const tabs = [
    { name: 'Home', path: '/', icon: Home, end: true },
    { name: 'Services', path: '/services', icon: Layers, end: false },
    { name: 'Projects', path: '/projects', icon: Code2, end: false },
    { name: 'Circles', path: '/community', icon: Users, end: false }
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight font-medium">
                    {tab.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Menu / Drawer Toggle */}
        <button
          onClick={onOpenMenu}
          aria-label="Open More Options"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors min-w-[56px]"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};
