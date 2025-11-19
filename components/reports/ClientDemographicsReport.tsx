import React from 'react';
import { mockDemographics } from '../../constants';

const Bar: React.FC<{ label: string; value: number; percentage: number, color: string }> = ({ label, value, percentage, color }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label} ({value})</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

// Fix: Added dateRange prop to fix type error in Reports.tsx
const ClientDemographicsReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
    const totalClients = mockDemographics.ageGroups.reduce((sum, group) => sum + group.count, 0);
    const ageGroupColors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-blue-300'];
    const locationColors = ['bg-purple-600', 'bg-purple-500', 'bg-purple-400'];

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Client Demographics</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Breakdown of active clients by age, location, and services.</p>

      <div className="my-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Active Clients</p>
         <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{totalClients}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Age Breakdown</h4>
            <div className="space-y-4">
                {mockDemographics.ageGroups.map((group, index) => (
                    <Bar key={group.range} label={group.range} value={group.count} percentage={group.percentage} color={ageGroupColors[index % ageGroupColors.length]} />
                ))}
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Location Breakdown</h4>
            <div className="space-y-4">
                {mockDemographics.locations.map((loc, index) => (
                    <Bar key={loc.location} label={loc.location} value={loc.count} percentage={loc.percentage} color={locationColors[index % locationColors.length]}/>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDemographicsReport;