import React, { useState } from 'react';
import { ViewType } from '../types';
import { navItems } from '../constants';
import { ChevronDownIcon } from './icons';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const getActiveGroup = () => {
    const activeParent = navItems.find(item => item.children?.some(child => child.view === currentView));
    return activeParent ? activeParent.id : null;
  };

  const [openGroup, setOpenGroup] = useState<string | null>(getActiveGroup);

  const handleGroupClick = (groupId: string) => {
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  return (
    <div className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
      <div className="h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">OdayCare</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          if (item.children) {
            const isGroupActive = item.children.some(child => child.view === currentView);
            const isGroupOpen = openGroup === item.id;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleGroupClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isGroupActive
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 mr-3"><Icon /></span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGroupOpen && (
                  <div className="pt-2 pl-6 space-y-1 animate-fade-in-down">
                    {item.children.map(child => {
                      const isChildActive = currentView === child.view;
                      return (
                        <button
                          key={child.id}
                          onClick={() => setCurrentView(child.view!)}
                          className={`flex items-center w-full px-4 py-2 text-sm text-left font-medium rounded-lg transition-all duration-200 group ${
                            isChildActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.view!)}
              className={`relative flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white dark:bg-blue-400 rounded-r-full"></span>}
              <span className="w-6 h-6 mr-3"><Icon /></span>
              <span className="group-hover:translate-x-1 transition-transform duration-200 ease-in-out">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
