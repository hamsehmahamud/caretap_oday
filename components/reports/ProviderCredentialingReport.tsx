import React from 'react';
import { CredentialingStatus, CredentialingStatusType } from '../../types';
import { mockCredentialingStatus } from '../../constants';

const getStatusClass = (status: CredentialingStatusType) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Expiring Soon':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'Expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  }
};

// Fix: Added dateRange prop to fix type error in Reports.tsx
const ProviderCredentialingReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
    const expiringSoonCount = mockCredentialingStatus.filter(c => c.status === 'Expiring Soon').length;
    const expiredCount = mockCredentialingStatus.filter(c => c.status === 'Expired').length;

  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Provider Credentialing</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Audit provider licenses and certification statuses.</p>
      
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div className="bg-yellow-50 dark:bg-yellow-500/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-300">Expiring Soon</p>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mt-1">{expiringSoonCount}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-600 dark:text-red-300">Expired</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1">{expiredCount}</p>
        </div>
      </div>

       {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Provider Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credential</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiry Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockCredentialingStatus.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{item.providerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.credentialName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {mockCredentialingStatus.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
             <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">{item.providerName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.credentialName}</p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                {item.status}
              </span>
            </div>
             <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Expiry Date:</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.expiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderCredentialingReport;