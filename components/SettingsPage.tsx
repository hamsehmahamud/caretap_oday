import React, {useState} from 'react';
import { ThemeSetting, User } from '../types';
import { SunIcon, MoonIcon, DesktopComputerIcon, CheckCircleIcon, ExclamationCircleIcon } from './icons';
import EditProfileModal from './EditProfileModal';

interface SettingsPageProps {
  themeSetting: ThemeSetting;
  setThemeSetting: (theme: ThemeSetting) => void;
  user: User;
  onUpdateUser: (user: User) => Promise<void>;
}

// Reusable components for settings page
const SettingsSection: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
    <div className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);

const Toggle: React.FC<{label: string, enabled: boolean, setEnabled: (enabled: boolean) => void}> = ({label, enabled, setEnabled}) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <button onClick={() => setEnabled(!enabled)} className={`${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}>
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ themeSetting, setThemeSetting, user, onUpdateUser }) => {
    // mock states for notification toggles
    const [credAlerts, setCredAlerts] = React.useState(true);
    const [claimAlerts, setClaimAlerts] = React.useState(true);
    const [newClientAlerts, setNewClientAlerts] = React.useState(false);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    
    // Check for API Key in environment
    const apiKey = (window as any).process?.env?.API_KEY;
    const isApiKeyConnected = apiKey && apiKey.length > 0;

    const handleProfileUpdate = async (updatedUser: User) => {
        await onUpdateUser(updatedUser);
        setEditProfileModalOpen(false);
    };

    return (
        <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your application preferences and account settings.</p>
            </div>
            
            <SettingsSection title="System Status" description="Check the status of application connections and integrations.">
                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center">
                        {isApiKeyConnected ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">API Key Connection</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isApiKeyConnected ? 'Successfully connected to environment variables.' : 'API Key not found in environment variables.'}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isApiKeyConnected ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                        {isApiKeyConnected ? 'Connected' : 'Missing'}
                    </span>
                </div>
            </SettingsSection>

            <SettingsSection title="Appearance" description="Customize the look and feel of the application.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ThemeButton id="light" label="Light" icon={<SunIcon />} current={themeSetting} set={setThemeSetting} />
                    <ThemeButton id="dark" label="Dark" icon={<MoonIcon />} current={themeSetting} set={setThemeSetting} />
                    <ThemeButton id="system" label="System" icon={<DesktopComputerIcon />} current={themeSetting} set={setThemeSetting} />
                </div>
            </SettingsSection>
            
            <SettingsSection title="Notifications" description="Choose how you want to be notified.">
                <Toggle label="Credentialing Alerts" enabled={credAlerts} setEnabled={setCredAlerts} />
                <Toggle label="Claim Status Updates" enabled={claimAlerts} setEnabled={setClaimAlerts} />
                <Toggle label="New Client Assignments" enabled={newClientAlerts} setEnabled={setNewClientAlerts} />
            </SettingsSection>

            <SettingsSection title="Profile" description="Manage your personal information.">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <img className="h-16 w-16 rounded-full object-cover" src="https://picsum.photos/100" alt="User" />
                    <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={() => setEditProfileModalOpen(true)} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                        Edit Profile
                    </button>
                </div>
            </SettingsSection>

        </div>
        <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setEditProfileModalOpen(false)}
            user={user}
            onSave={handleProfileUpdate}
        />
        </>
    );
};

const ThemeButton: React.FC<{id: ThemeSetting, label: string, icon: React.ReactNode, current: ThemeSetting, set: (theme: ThemeSetting) => void}> = ({id, label, icon, current, set}) => (
    <button onClick={() => set(id)} className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${current === id ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
        <span className={`h-6 w-6 ${current === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{icon}</span>
        <span className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
    </button>
);

export default SettingsPage;