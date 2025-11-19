import React, { useState, useEffect } from 'react';
import { Claim, ClaimStatus } from '../types';
import { XIcon } from './icons';

interface ClaimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (claim: Claim) => void;
  claim: Claim;
  isEditMode: boolean;
}

const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ isOpen, onClose, onSave, claim, isEditMode }) => {
  const [formData, setFormData] = useState<Claim>(claim);

  useEffect(() => {
    setFormData(claim);
  }, [claim, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'amount' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const readOnlyValueClasses = "mt-1 text-sm text-gray-800 dark:text-gray-200 font-medium min-h-[42px] flex items-center";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{isEditMode ? 'Edit' : 'View'} Claim Details</h3>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className={labelClasses}>Claim ID</label>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formData.id}</p>
              </div>
               <div>
                <label className={labelClasses}>Client</label>
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 font-medium">{formData.clientName}</p>
              </div>
               <div>
                <label htmlFor="payer" className={labelClasses}>Payer</label>
                 {isEditMode ? (
                    <input type="text" name="payer" id="payer" value={formData.payer} onChange={handleChange} required className={inputClasses} />
                 ) : (
                    <p className={readOnlyValueClasses}>{formData.payer}</p>
                 )}
              </div>
              <div>
                <label htmlFor="amount" className={labelClasses}>Amount</label>
                 {isEditMode ? (
                    <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required className={inputClasses} />
                 ) : (
                    <p className={readOnlyValueClasses}>${formData.amount.toFixed(2)}</p>
                 )}
              </div>
              <div>
                <label htmlFor="serviceFrom" className={labelClasses}>Service From</label>
                 {isEditMode ? (
                    <input type="date" name="serviceFrom" id="serviceFrom" value={formData.serviceFrom} onChange={handleChange} required className={inputClasses} />
                 ) : (
                    <p className={readOnlyValueClasses}>{formData.serviceFrom}</p>
                 )}
              </div>
              <div>
                <label htmlFor="serviceTo" className={labelClasses}>Service To</label>
                 {isEditMode ? (
                    <input type="date" name="serviceTo" id="serviceTo" value={formData.serviceTo} onChange={handleChange} required className={inputClasses} />
                 ) : (
                    <p className={readOnlyValueClasses}>{formData.serviceTo}</p>
                 )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="status" className={labelClasses}>Status</label>
                 {isEditMode ? (
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                        {Object.values(ClaimStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                 ) : (
                    <p className={readOnlyValueClasses}>{formData.status}</p>
                 )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isEditMode ? 'Cancel' : 'Close'}
            </button>
            {isEditMode && (
              <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimDetailModal;