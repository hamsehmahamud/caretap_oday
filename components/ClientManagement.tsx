import React, { useState, useMemo } from 'react';
import { Client, ClientStatus } from '../types';
import { SearchIcon, PlusIcon } from './icons';

interface ClientManagementProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

const getStatusClass = (status: ClientStatus) => {
  switch (status) {
    case ClientStatus.Active:
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case ClientStatus.Inactive:
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case ClientStatus.Pending:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, onSelectClient, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Client Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage all client profiles and records.</p>
        </div>
        <button onClick={onAddClient} className="flex items-center justify-center md:justify-start bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full md:w-auto">
          <PlusIcon />
          <span className="ml-2">Add New Client</span>
        </button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name or ID..."
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admission Date</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.firstName} {client.lastName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.payer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.admissionDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onSelectClient(client)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{client.firstName} {client.lastName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{client.id}</p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>
                {client.status}
              </span>
            </div>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Payer:</span>
                <span className="text-gray-800 dark:text-gray-200">{client.payer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Admission:</span>
                <span className="text-gray-800 dark:text-gray-200">{client.admissionDate}</span>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={() => onSelectClient(client)} className="w-full text-center py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/30">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManagement;