import React from 'react';
import { mockActivities } from '../constants';
import { Kpi, ActivityLog, Alert } from '../types';
import { ArrowRightIcon, TrendingUpIcon, TrendingDownIcon, UserCircleIcon, ExclamationCircleIcon } from './icons';

interface DashboardProps {
    kpis: Kpi[];
    alerts: Alert[];
    onNavigate: (view: 'reports') => void;
}

const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
    const changeColor = kpi.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{kpi.value}</p>
                {kpi.change && (
                    <div className={`flex items-center text-sm mt-2 ${changeColor}`}>
                        {kpi.changeType === 'increase' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        <span className="ml-1 font-semibold">{kpi.change}</span>
                    </div>
                )}
            </div>
            <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 p-3 rounded-full">
                <kpi.icon className="h-6 w-6" />
            </div>
        </div>
    );
};

const ActivityItem: React.FC<{ activity: ActivityLog }> = ({ activity }) => (
    <div className="flex items-start space-x-4 py-3">
        <div className="flex-shrink-0">
            <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{activity.user}</span> - {activity.timestamp}
            </p>
        </div>
    </div>
);


const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const priorityClass = alert.priority === 'High' ? 'bg-red-100 dark:bg-red-500/20' : 'bg-yellow-100 dark:bg-yellow-500/20';
    const iconColor = alert.priority === 'High' ? 'text-red-500' : 'text-yellow-500';
    
    return (
        <div className={`flex items-start space-x-4 p-4 rounded-lg ${priorityClass}`}>
            <div className={`flex-shrink-0 ${iconColor}`}>
                <ExclamationCircleIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{alert.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.timestamp}</p>
            </div>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ kpis, alerts, onNavigate }) => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Good morning, Admin!</h1>
                <p className="text-md text-gray-500 dark:text-gray-400">Here's a summary of your agency's operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(kpi => <KpiCard key={kpi.label} kpi={kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Activity</h3>
                        <button onClick={() => onNavigate('reports')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                            View All <ArrowRightIcon className="ml-1" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {mockActivities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Alerts & Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        {alerts.length > 0 ? alerts.map(alert => <AlertItem key={alert.id} alert={alert} />) : <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No alerts right now.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;