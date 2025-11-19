import React from 'react';
import { ServiceUtilization } from '../../types';
import { mockServiceUtilization } from '../../constants';

const ReportKpiCard: React.FC<{ label: string; value: string; subValue: string }> = ({ label, value, subValue }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-500">{subValue}</p>
  </div>
);

// Fix: Added dateRange prop to fix type error in Reports.tsx
const ServiceUtilizationReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
  const thisMonthData = mockServiceUtilization.find(s => s.period === 'This Month');
  const completionRate = thisMonthData ? ((thisMonthData.completed / thisMonthData.scheduled) * 100).toFixed(1) : '0';
  const noShowRate = thisMonthData ? ((thisMonthData.noShow / thisMonthData.scheduled) * 100).toFixed(1) : '0';

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Service Utilization</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track appointments, cancellations, and no-shows.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <ReportKpiCard label="Total Scheduled" value={thisMonthData?.scheduled.toLocaleString() || '0'} subValue="This Month" />
        <ReportKpiCard label="Completion Rate" value={`${completionRate}%`} subValue="This Month" />
        <ReportKpiCard label="No-Show Rate" value={`${noShowRate}%`} subValue="This Month" />
      </div>

       {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Scheduled</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Completed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cancelled</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No-Shows</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockServiceUtilization.map((item) => (
              <tr key={item.period} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{item.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.scheduled}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">{item.completed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400 font-semibold">{item.cancelled}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-semibold">{item.noShow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {mockServiceUtilization.map(item => (
          <div key={item.period} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <p className="font-bold text-gray-800 dark:text-gray-200">{item.period}</p>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
               <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Scheduled:</span>
                <span className="text-gray-800 dark:text-gray-200">{item.scheduled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Completed:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{item.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Cancelled:</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{item.cancelled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">No-Shows:</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">{item.noShow}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceUtilizationReport;