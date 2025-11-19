import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, BellIcon, CogIcon, LogoutIcon, QuestionMarkCircleIcon, UserCircleIcon, ExclamationCircleIcon, SunIcon, MoonIcon } from './icons';
import { mockAlerts } from '../constants';
import { Theme, User, ViewType } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  user: User;
  onLogout: () => void;
  setCurrentView: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, user, onLogout, setCurrentView }) => {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
      {/* Left side: Search */}
      <div className="relative hidden md:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search clients, providers..."
          className="w-full md:w-96 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Center: Company Name (Mobile Only) */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">OdayCare</h1>
      </div>

      {/* Right side: Icons and profile */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 focus:outline-none"
          >
            <BellIcon />
            {mockAlerts.length > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-down">
              <div className="p-3 border-b dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-200">Notifications</div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start space-x-3">
                    <div className="mt-1">
                      <ExclamationCircleIcon className={`h-5 w-5 ${alert.priority === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{alert.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
               <a href="#" className="block p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700">View all notifications</a>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 hidden md:block"></div>

        {/* Profile Dropdown */}
        <div className="relative flex" ref={profileRef}>
          <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <img className="h-9 w-9 rounded-full object-cover" src="https://picsum.photos/100" alt="User" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 text-left">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-left">{user.role}</p>
            </div>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-down">
              <div className="p-2">
                <button onClick={() => { setCurrentView('settings'); setProfileOpen(false); }} className="w-full flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><CogIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Settings</button>
                <a href="#" className="flex items-center px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><QuestionMarkCircleIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Help Center</a>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <button onClick={toggleTheme} className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  {theme === 'light' ? <MoonIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> : <SunIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />}
                  <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                 <button onClick={onLogout} className="flex items-center w-full px-3 py-2 text-xs sm:text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"><LogoutIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" /> Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;