import React, { useState } from 'react';
import { mockTeamMembers } from '../constants';
import { CalendarEvent, TeamMember, Client } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons';
import AddEventModal from './AddEventModal';

interface CalendarPageProps {
    events: CalendarEvent[];
    clients: Client[];
    onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    onUpdateEvent: (event: CalendarEvent) => void;
    onDeleteEvent: (eventId: string) => void;
}


// Helper functions for date manipulation
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  d.setHours(0,0,0,0);
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

const CalendarPage: React.FC<CalendarPageProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const startOfWeek = getStartOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>, id?: string) => {
    if (id) {
        onUpdateEvent({ ...eventData, id });
    } else {
        onAddEvent(eventData);
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };
  
  const handleOpenAddModal = () => {
      setSelectedEvent(null);
      setModalOpen(true);
  };

  const handleOpenEditModal = (event: CalendarEvent) => {
      setSelectedEvent(event);
      setModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
      onDeleteEvent(eventId);
      setModalOpen(false);
      setSelectedEvent(null);
  };

  const getTeamMember = (id: string): TeamMember | undefined => {
    return mockTeamMembers.find(member => member.id === id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Scheduling</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage appointments and team schedules.</p>
            </div>
            <button onClick={handleOpenAddModal} className="flex items-center justify-center md:justify-start bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full md:w-auto mt-4 md:mt-0">
                <PlusIcon />
                <span className="ml-2">Add Appointment</span>
            </button>
        </div>

        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{formatDate(startOfWeek, { month: 'long', year: 'numeric' })}</h3>
            <div className="flex items-center space-x-2">
                <button onClick={handlePrevWeek} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon /></button>
                <button onClick={() => setCurrentDate(new Date())} className="text-sm font-semibold px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">Today</button>
                <button onClick={handleNextWeek} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon /></button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
            {days.map(day => (
                <div key={day.toISOString()} className="border-r border-b border-gray-200 dark:border-gray-700 p-2 min-h-[10rem] overflow-y-auto">
                    <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">{formatDate(day, { weekday: 'short' }).toUpperCase()}</p>
                    <p className={`text-center text-lg font-bold rounded-full mx-auto w-8 h-8 flex items-center justify-center ${day.toDateString() === new Date().toDateString() ? 'bg-blue-600 text-white' : 'text-gray-800 dark:text-gray-200'}`}>{formatDate(day, { day: 'numeric' })}</p>
                    <div className="mt-2 space-y-2">
                        {events
                            .filter(event => event.start.toDateString() === day.toDateString())
                            .sort((a,b) => a.start.getTime() - b.start.getTime())
                            .map(event => {
                                const teamMember = getTeamMember(event.teamMemberId);
                                return (
                                <button key={event.id} onClick={() => handleOpenEditModal(event)} className={`w-full text-left p-2 rounded-lg text-xs text-white ${teamMember?.color || 'bg-gray-400'} bg-opacity-80 dark:bg-opacity-100 hover:ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800`}>
                                    <p className="font-bold truncate">{event.title}</p>
                                    <p className="truncate">{event.clientName}</p>
                                    <p className="mt-1 text-white/80">{formatTime(event.start)} - {formatTime(event.end)}</p>
                                    {teamMember && <p className="mt-1 font-semibold truncate">{teamMember.name}</p>}
                                </button>
                            )})
                        }
                    </div>
                </div>
            ))}
        </div>
        
        <AddEventModal 
            isOpen={isModalOpen} 
            onClose={() => { setModalOpen(false); setSelectedEvent(null); }} 
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            event={selectedEvent}
        />
    </div>
  );
};

export default CalendarPage;