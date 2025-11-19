import React, { useState, useRef, useEffect } from 'react';
import { ViewType, User } from '../types';
import { navItems } from '../constants';
import { PlusIcon, UsersIcon, IdentificationIcon, XIcon } from './icons';

interface FooterNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: User;
  onAddClient: () => void;
  onAddProvider: () => void;
}

const mobileNavViewsToInclude: ViewType[] = ['dashboard', 'clients', 'scheduling', 'billing'];
const mobileNavItems = navItems
  .flatMap(item => item.children || item)
  .filter(item => item.view && mobileNavViewsToInclude.includes(item.view));

const FooterNav: React.FC<FooterNavProps> = ({ currentView, setCurrentView, user, onAddClient, onAddProvider }) => {
  const [isAddMenuOpen, setAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 px-4 z-40" ref={menuRef}>
      {isAddMenuOpen && (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setAddMenuOpen(false)}></div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3">
                 <button onClick={() => { onAddProvider(); setAddMenuOpen(false); }} className="flex items-center justify-center w-40 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg shadow-lg animate-fade-in-down" style={{animationDelay: '0.1s'}}>
                    <IdentificationIcon />
                    <span className="ml-2">New Provider</span>
                </button>
                <button onClick={() => { onAddClient(); setAddMenuOpen(false); }} className="flex items-center justify-center w-40 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg shadow-lg animate-fade-in-down">
                    <UsersIcon />
                    <span className="ml-2">New Client</span>
                </button>
            </div>
        </>
      )}

      {/* FAB Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setAddMenuOpen(!isAddMenuOpen)}
          className={`flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transform transition-all duration-300 ease-in-out ${isAddMenuOpen ? 'bg-red-500 rotate-45' : 'bg-blue-600'}`}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Navigation Bar */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-16 shadow-t-lg">
        <nav className="flex justify-around items-center h-full">
          {mobileNavItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.view!)}
                className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 rounded-lg ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-blue-50 dark:bg-blue-500/20' : ''}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}

          <div className="w-1/5"></div>

          {mobileNavItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.view!)}
                className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 rounded-lg ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-blue-50 dark:bg-blue-500/20' : ''}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default FooterNav;