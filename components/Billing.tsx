import React, { useState, useMemo } from 'react';
import { Claim, ClaimStatus } from '../types';
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon } from './icons';
import ClaimDetailModal from './ClaimDetailModal';

const getStatusClass = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.Paid:
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case ClaimStatus.Submitted:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case ClaimStatus.Denied:
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case ClaimStatus.ReadyToBill:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    case ClaimStatus.Draft:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
  }
};

interface BillingProps {
    claims: Claim[];
    onBatchSubmit: () => void;
    onUpdateClaim: (claim: Claim) => void;
}

const Billing: React.FC<BillingProps> = ({ claims, onBatchSubmit, onUpdateClaim }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<ClaimStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleViewClaim = (claim: Claim) => {
        setSelectedClaim(claim);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditClaim = (claim: Claim) => {
        if (claim.status === ClaimStatus.Draft) {
            setSelectedClaim(claim);
            setIsEditMode(true);
            setIsModalOpen(true);
        } else {
            alert("Only claims in 'Draft' status can be edited.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClaim(null);
    };

    const handleSaveClaim = (updatedClaim: Claim) => {
        onUpdateClaim(updatedClaim);
        handleCloseModal();
    };

    const filteredClaims = useMemo(() => {
        let claimsData = claims;

        if (activeTab !== 'All') {
            claimsData = claimsData.filter(claim => claim.status === activeTab);
        }

        if (searchTerm) {
            claimsData = claimsData.filter(claim =>
                claim.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                claim.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return claimsData;
    }, [claims, searchTerm, activeTab]);
    
    const billingKpis = useMemo(() => {
        const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        return [
            { label: 'Ready to Bill', value: formatCurrency(claims.filter(c => c.status === ClaimStatus.ReadyToBill).reduce((sum, c) => sum + c.amount, 0)) },
            { label: 'Submitted', value: formatCurrency(claims.filter(c => c.status === ClaimStatus.Submitted).reduce((sum, c) => sum + c.amount, 0)) },
            { label: 'Paid (Total)', value: formatCurrency(claims.filter(c => c.status === ClaimStatus.Paid).reduce((sum, c) => sum + c.amount, 0)) },
            { label: 'Denied', value: formatCurrency(claims.filter(c => c.status === ClaimStatus.Denied).reduce((sum, c) => sum + c.amount, 0)) },
        ];
    }, [claims]);


    const tabs: (ClaimStatus | 'All')[] = ['All', ClaimStatus.ReadyToBill, ClaimStatus.Submitted, ClaimStatus.Paid, ClaimStatus.Denied, ClaimStatus.Draft];
    
  return (
    <>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b pb-6 border-gray-200 dark:border-gray-700 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Billing & Claims Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Automate claim generation, manage denials, and track revenue cycles.</p>
        </div>
        <button onClick={onBatchSubmit} className="flex items-center justify-center md:justify-start bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full md:w-auto">
          <PlusIcon />
          <span className="ml-2">Create New Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {billingKpis.map(kpi => (
            <div key={kpi.label} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{kpi.value}</p>
            </div>
        ))}
      </div>
      
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                    {tab}
                </button>
            ))}
          </nav>
        </div>

      <div className="my-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by client name or claim ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claim ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service Dates</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{claim.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{claim.clientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{claim.payer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{claim.serviceFrom} to {claim.serviceTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-semibold">${claim.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => handleViewClaim(claim)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><EyeIcon /></button>
                  <button onClick={() => handleEditClaim(claim)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><PencilIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredClaims.map(claim => (
          <div key={claim.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{claim.clientName}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{claim.id}</p>
              </div>
               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(claim.status)}`}>
                  {claim.status}
                </span>
            </div>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
               <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Amount:</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold">${claim.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Payer:</span>
                <span className="text-gray-800 dark:text-gray-200">{claim.payer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Service Dates:</span>
                <span className="text-gray-800 dark:text-gray-200">{claim.serviceFrom} to {claim.serviceTo}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => handleViewClaim(claim)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><EyeIcon /></button>
                <button onClick={() => handleEditClaim(claim)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><PencilIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {selectedClaim && (
        <ClaimDetailModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            onSave={handleSaveClaim}
            claim={selectedClaim}
            isEditMode={isEditMode}
        />
    )}
    </>
  );
};

export default Billing;