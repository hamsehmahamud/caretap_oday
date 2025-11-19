import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import ProviderManagement from './components/ProviderManagement';
import Billing from './components/Billing';
import Reports from './components/Reports';
import CalendarPage from './components/CalendarPage';
import ProfileDetailView from './components/ProfileDetailView';
import AddClientModal from './components/AddClientModal';
import AddProviderModal from './components/AddProviderModal';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { ViewType, Client, Provider, Theme, ThemeSetting, Claim, ClaimStatus, User, Kpi, Alert, CalendarEvent } from './types';
import * as db from './database';
import { UsersIcon, BriefcaseIcon, DocumentChartBarIcon, ChartPieIcon } from './components/icons';

type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [selectedProfile, setSelectedProfile] = useState<Client | Provider | null>(null);
  const [isAddClientModalOpen, setAddClientModalOpen] = useState(false);
  const [isAddProviderModalOpen, setAddProviderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(() => (localStorage.getItem('theme') as ThemeSetting) || 'system');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    db.initializeDatabase();
    const loggedInUserJson = sessionStorage.getItem('odayCareUser');
    if (loggedInUserJson) {
      setCurrentUser(JSON.parse(loggedInUserJson));
    } else {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      let currentTheme: Theme;
      if (themeSetting === 'system') {
        currentTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        currentTheme = themeSetting;
      }
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
      setTheme(currentTheme);
      localStorage.setItem('theme', themeSetting);
    };

    updateTheme();
    
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeSetting]);
  
  const fetchData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const [clientsData, providersData, claimsData, eventsData] = await Promise.all([
      db.getClients(),
      db.getProviders(),
      db.getClaims(),
      db.getEvents(),
    ]);
    setClients(clientsData);
    setProviders(providersData);
    setClaims(claimsData);
    setEvents(eventsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleLogin = (user: User) => {
    const { password, ...userToStore } = user;
    sessionStorage.setItem('odayCareUser', JSON.stringify(userToStore));
    setCurrentUser(userToStore);
  };

  const handleSignup = (user: User) => {
    const { password, ...userToStore } = user;
    sessionStorage.setItem('odayCareUser', JSON.stringify(userToStore));
    setCurrentUser(userToStore);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('odayCareUser');
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const createAuditLog = (action: 'CREATE' | 'UPDATE' | 'DELETE', details: string): any => ({
      id: `log-${Date.now()}`,
      user: currentUser?.name || 'Admin User',
      action,
      details,
      timestamp: new Date().toLocaleString()
  });

  const handleAddClient = async (clientData: Omit<Client, 'id' | 'type' | 'documents' | 'auditLog'>) => {
    const newClient: Client = {
      ...clientData,
      id: `CL-${Date.now()}`, type: 'client', documents: [],
      auditLog: [createAuditLog('CREATE', 'Client profile created.')],
    };
    await db.addClient(newClient);
    fetchData();
    setAddClientModalOpen(false);
  };

  const handleUpdateClient = async (client: Client) => {
      const updatedClient = {
          ...client,
          auditLog: [...client.auditLog, createAuditLog('UPDATE', 'Client details updated.')]
      };
      await db.updateClient(updatedClient);
      fetchData();
      if(selectedProfile?.id === client.id) {
          setSelectedProfile(updatedClient);
      }
  };

  const handleAddProvider = async (providerData: Omit<Provider, 'id' | 'type' | 'documents' | 'auditLog' | 'certifications'>) => {
    const newProvider: Provider = {
      ...providerData,
      id: `PR-${Date.now()}`, type: 'provider', certifications: [], documents: [],
      auditLog: [createAuditLog('CREATE', 'Provider profile created.')],
    };
    await db.addProvider(newProvider);
    fetchData();
    setAddProviderModalOpen(false);
  };

  const handleUpdateProvider = async (provider: Provider) => {
      const updatedProvider = {
          ...provider,
          auditLog: [...provider.auditLog, createAuditLog('UPDATE', 'Provider details updated.')]
      };
      await db.updateProvider(updatedProvider);
      fetchData();
       if(selectedProfile?.id === provider.id) {
          setSelectedProfile(updatedProvider);
      }
  };

  const handleUpdateClaim = async (claim: Claim) => {
    await db.updateClaim(claim);
    fetchData();
  };

  const handleBatchSubmitClaims = async () => {
      const claimsToSubmit = claims.filter(c => c.status === ClaimStatus.ReadyToBill);
      if (claimsToSubmit.length === 0) {
          alert('No claims are ready to be billed.');
          return;
      }
      const claimIds = claimsToSubmit.map(c => c.id);
      await db.batchUpdateClaimStatus(claimIds, ClaimStatus.Submitted);
      fetchData();
      alert(`${claimIds.length} claims have been submitted successfully.`);
  };

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...eventData, id: `EVT-${Date.now()}` };
    await db.addEvent(newEvent);
    fetchData();
  };

  const handleUpdateEvent = async (event: CalendarEvent) => {
    await db.updateEvent(event);
    fetchData();
  };

  const handleDeleteEvent = async (eventId: string) => {
    await db.deleteEvent(eventId);
    fetchData();
  };
  
  const handleUpdateUser = async (user: User) => {
    const updatedUser = await db.updateUser(user);
    const { password, ...userToStore } = updatedUser;
    sessionStorage.setItem('odayCareUser', JSON.stringify(userToStore));
    setCurrentUser(userToStore);
  };
  
  // Dynamic KPIs and Alerts
  const dashboardKpis = useMemo((): Kpi[] => {
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const activeProviders = providers.filter(p => p.status === 'Active').length;
    const pendingClaims = claims.filter(c => c.status === 'Ready to Bill' || c.status === 'Submitted');
    const pendingAmount = pendingClaims.reduce((sum, c) => sum + c.amount, 0);
    const revenueMTD = claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0) / 2; // Mock MTD

    return [
      { label: 'Active Clients', value: activeClients.toString(), change: '+2 vs last week', changeType: 'increase', icon: UsersIcon },
      { label: 'Active Providers', value: activeProviders.toString(), change: '+1 vs last week', changeType: 'increase', icon: BriefcaseIcon },
      { label: 'Pending Claims', value: `$${pendingAmount.toLocaleString()}`, change: '-1.8%', changeType: 'decrease', icon: DocumentChartBarIcon },
      { label: 'Revenue (MTD)', value: `$${revenueMTD.toLocaleString()}`, change: '+10.1%', changeType: 'increase', icon: ChartPieIcon },
    ];
  }, [clients, providers, claims]);

  const dashboardAlerts = useMemo((): Alert[] => {
      const alerts: Alert[] = [];
      const today = new Date();
      providers.forEach(p => {
          p.certifications.forEach(c => {
              const expiryDate = new Date(c.expiryDate);
              const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
              if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
                  alerts.push({
                      id: `alert-${p.id}-${c.id}`,
                      title: 'Credentialing Expiring',
                      description: `${p.firstName} ${p.lastName}'s ${c.name} cert expires in ${Math.ceil(daysUntilExpiry)} days.`,
                      priority: 'High',
                      timestamp: 'Today'
                  });
              }
          });
      });
      return alerts;
  }, [providers]);


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard kpis={dashboardKpis} alerts={dashboardAlerts} onNavigate={setCurrentView} />;
      case 'clients':
        return <ClientManagement clients={clients} onSelectClient={setSelectedProfile} onAddClient={() => setAddClientModalOpen(true)} />;
      case 'providers':
        return <ProviderManagement providers={providers} onSelectProvider={setSelectedProfile} onAddProvider={() => setAddProviderModalOpen(true)} />;
      case 'scheduling':
        return <CalendarPage events={events} clients={clients} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />;
      case 'billing':
        return <Billing claims={claims} onBatchSubmit={handleBatchSubmitClaims} onUpdateClaim={handleUpdateClaim} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SettingsPage themeSetting={themeSetting} setThemeSetting={setThemeSetting} user={currentUser!} onUpdateUser={handleUpdateUser} />;
      default:
        return <Dashboard kpis={dashboardKpis} alerts={dashboardAlerts} onNavigate={setCurrentView} />;
    }
  };

  if (!currentUser) {
     return authView === 'login' ? (
      <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500 mb-2 animate-pulse">OdayCare</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={() => setThemeSetting(theme === 'light' ? 'dark' : 'light')}
        user={currentUser}
        onLogout={handleLogout}
        onAddClient={() => setAddClientModalOpen(true)}
        onAddProvider={() => setAddProviderModalOpen(true)}
      >
        <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </div>
      </Layout>
      <ProfileDetailView 
        profile={selectedProfile} 
        onClose={() => setSelectedProfile(null)}
        onUpdateClient={handleUpdateClient}
        onUpdateProvider={handleUpdateProvider}
      />
      <AddClientModal isOpen={isAddClientModalOpen} onClose={() => setAddClientModalOpen(false)} onSave={handleAddClient} />
      <AddProviderModal isOpen={isAddProviderModalOpen} onClose={() => setAddProviderModalOpen(false)} onSave={handleAddProvider} />
    </>
  );
};

export default App;