import React from 'react';
import { PayerRevenue } from '../../types';
import { mockPayerRevenue } from '../../constants';

const ReportKpiCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
  </div>
);

// Fix: Added dateRange prop to fix type error in Reports.tsx
const RevenueByPayerReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
  const totalRevenue = mockPayerRevenue.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalClaims = mockPayerRevenue.reduce((sum, p) => sum + p.claimCount, 0);

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Revenue by Payer</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyze revenue streams from different insurance payers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <ReportKpiCard label="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
        <ReportKpiCard label="Total Claims" value={totalClaims.toLocaleString()} />
        <ReportKpiCard label="Avg. Per Payer" value={`$${(totalRevenue / mockPayerRevenue.length).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Revenue</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claim Count</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockPayerRevenue.map((payer) => (
              <tr key={payer.payer} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{payer.payer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-semibold">${payer.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payer.claimCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payer.paidPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {mockPayerRevenue.map(payer => (
          <div key={payer.payer} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <p className="font-bold text-gray-800 dark:text-gray-200">{payer.payer}</p>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Total Revenue:</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">${payer.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Claim Count:</span>
                <span className="text-gray-800 dark:text-gray-200">{payer.claimCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Paid Rate:</span>
                <span className="text-gray-800 dark:text-gray-200">{payer.paidPercentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueByPayerReport;