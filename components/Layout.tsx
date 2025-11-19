import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ViewType, Theme, User } from '../types';
import FooterNav from './FooterNav';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  theme: Theme;
  toggleTheme: () => void;
  user: User;
  onLogout: () => void;
  onAddClient: () => void;
  onAddProvider: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, theme, toggleTheme, user, onLogout, onAddClient, onAddProvider }) => {

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme}
          user={user}
          onLogout={onLogout}
          setCurrentView={setCurrentView}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 pb-24 md:pb-0">
          {children}
        </main>
      </div>
      <FooterNav 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
        onAddClient={onAddClient}
        onAddProvider={onAddProvider}
      />
    </div>
  );
};

export default Layout;