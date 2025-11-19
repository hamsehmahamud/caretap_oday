import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { XIcon, TrashIcon } from './icons';
import { mockClients, mockTeamMembers } from '../constants';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>, id?: string) => void;
  onDelete?: (eventId: string) => void;
  event?: CalendarEvent | null;
}

type EventFormData = Omit<CalendarEvent, 'id' | 'start' | 'end'> & {
    date: string;
    startTime: string;
    endTime: string;
};

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave, onDelete, event }) => {
  const getInitialFormData = () => {
    if (event) {
        return {
            title: event.title,
            clientName: event.clientName,
            teamMemberId: event.teamMemberId,
            date: event.start.toISOString().split('T')[0],
            startTime: event.start.toTimeString().substring(0,5),
            endTime: event.end.toTimeString().substring(0,5),
        }
    }
    const defaultClient = mockClients.length > 0 ? `${mockClients[0].firstName} ${mockClients[0].lastName}` : '';
    const defaultTeamMember = mockTeamMembers.length > 0 ? mockTeamMembers[0].id : '';
    return {
      title: '',
      clientName: defaultClient,
      teamMemberId: defaultTeamMember,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
    };
  };

  const [formData, setFormData] = useState<EventFormData>(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
  }, [isOpen, event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    
    if (end <= start) {
        alert("End time must be after start time.");
        return;
    }

    const { date, startTime, endTime, ...rest } = formData;

    onSave({ ...rest, start, end }, event?.id);
  };

  const handleDelete = () => {
      if (event && onDelete && window.confirm('Are you sure you want to delete this appointment?')) {
          onDelete(event.id);
      }
  }

  if (!isOpen) {
    return null;
  }
  
  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg transform transition-all" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{event ? 'Edit' : 'Add New'} Appointment</h3>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <div className="grid grid-cols-1 gap-y-4">
              <div>
                <label htmlFor="title" className={labelClasses}>Appointment Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="e.g., Therapy Session" />
              </div>
              <div>
                <label htmlFor="clientName" className={labelClasses}>Client</label>
                <select id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} className={inputClasses}>
                  {mockClients.map(client => (
                    <option key={client.id} value={`${client.firstName} ${client.lastName}`}>{client.firstName} {client.lastName}</option>
                  ))}
                </select>
              </div>
               <div>
                <label htmlFor="teamMemberId" className={labelClasses}>Provider</label>
                <select id="teamMemberId" name="teamMemberId" value={formData.teamMemberId} onChange={handleChange} className={inputClasses}>
                  {mockTeamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className={labelClasses}>Date</label>
                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className={inputClasses} />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label htmlFor="startTime" className={labelClasses}>Start Time</label>
                  <input type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="endTime" className={labelClasses}>End Time</label>
                  <input type="time" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} required className={inputClasses} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
             {event && onDelete && (
                 <button type="button" onClick={handleDelete} className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20">
                     <TrashIcon className="mr-2" /> Delete
                 </button>
             )}
            </div>
            <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Appointment
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;