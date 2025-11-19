import React from 'react';
import { DenialReason } from '../../types';
import { mockDenialReasons } from '../../constants';

// Fix: Added dateRange prop to fix type error in Reports.tsx
const ClaimDenialAnalysisReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
    const totalDeniedAmount = mockDenialReasons.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalDeniedClaims = mockDenialReasons.reduce((sum, r) => sum + r.count, 0);
    const topReason = mockDenialReasons.length > 0 ? mockDenialReasons[0].reason : 'N/A';

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Claim Denial Analysis</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Identify trends and reasons for denied claims.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-red-50 dark:bg-red-500/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-600 dark:text-red-300">Total Denied Value</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1">${totalDeniedAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Denied Claims</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{totalDeniedClaims}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Denial Reason</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1 truncate">{topReason}</p>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Denial Reason</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Number of Claims</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockDenialReasons.map((item) => (
              <tr key={item.reason} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{item.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-semibold">${item.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden space-y-4">
        {mockDenialReasons.map(item => (
          <div key={item.reason} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <p className="font-bold text-gray-800 dark:text-gray-200">{item.reason}</p>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
               <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Number of Claims:</span>
                <span className="text-gray-800 dark:text-gray-200">{item.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount:</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">${item.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimDenialAnalysisReport;