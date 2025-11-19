import React, { useState, useEffect } from 'react';
import { Client, ClientStatus } from '../types';
import { XIcon } from './icons';

type ClientFormData = Omit<Client, 'id' | 'type' | 'documents' | 'auditLog'>;

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: ClientFormData) => void;
}

const initialFormData: ClientFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  address: '',
  phone: '',
  email: '',
  status: ClientStatus.Pending,
  payer: '',
  careManager: '',
  admissionDate: new Date().toISOString().split('T')[0],
};

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Add New Client</h3>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="firstName" className={labelClasses}>First Name</label>
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className={labelClasses}>Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
                <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="admissionDate" className={labelClasses}>Admission Date</label>
                <input type="date" name="admissionDate" id="admissionDate" value={formData.admissionDate} onChange={handleChange} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="payer" className={labelClasses}>Payer / Insurance</label>
                <input type="text" name="payer" id="payer" value={formData.payer} onChange={handleChange} required className={inputClasses} />
              </div>
               <div>
                <label htmlFor="careManager" className={labelClasses}>Care Manager</label>
                <input type="text" name="careManager" id="careManager" value={formData.careManager} onChange={handleChange} required className={inputClasses} />
              </div>
               <div>
                <label htmlFor="status" className={labelClasses}>Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                  {Object.values(ClientStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;