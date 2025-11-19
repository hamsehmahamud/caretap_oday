import { mockClients, mockProviders, mockClaims, mockEvents } from './constants';
import { Client, Provider, Claim, ClaimStatus, User, CalendarEvent } from './types';

const DB_KEY = 'odayCareDb';

interface AppDatabase {
  clients: Client[];
  providers: Provider[];
  claims: Claim[];
  users: User[];
  events: CalendarEvent[];
}

// Initialize the database in localStorage if it doesn't exist
export const initializeDatabase = (): void => {
  if (!localStorage.getItem(DB_KEY)) {
    const initialDb: AppDatabase = {
      clients: mockClients,
      providers: mockProviders,
      claims: mockClaims,
      users: [
        {
          id: 'user-001',
          name: 'Admin User',
          email: 'admin@odaycare.com',
          password: 'password123', // In a real app, this would be hashed
          role: 'Administrator',
        }
      ],
      events: mockEvents,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
  } else {
    // Ensure existing databases have the new events field
    const db = JSON.parse(localStorage.getItem(DB_KEY)!);
    if (!db.events) {
      db.events = mockEvents;
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  }
};

const readDatabase = (): AppDatabase => {
  const dbString = localStorage.getItem(DB_KEY);
  if (!dbString) {
    initializeDatabase();
    return JSON.parse(localStorage.getItem(DB_KEY)!);
  }
  return JSON.parse(dbString);
};

const writeDatabase = (db: AppDatabase): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// --- API Functions ---

const FAKE_LATENCY = 200;
const withLatency = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), FAKE_LATENCY));

// Client Functions
export const getClients = async (): Promise<Client[]> => withLatency(readDatabase().clients);
export const addClient = async (client: Client): Promise<Client> => {
  const db = readDatabase();
  db.clients.unshift(client);
  writeDatabase(db);
  return withLatency(client);
};
export const updateClient = async (updatedClient: Client): Promise<Client> => {
    const db = readDatabase();
    db.clients = db.clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    writeDatabase(db);
    return withLatency(updatedClient);
};
export const deleteClient = async (clientId: string): Promise<void> => {
    const db = readDatabase();
    db.clients = db.clients.filter(c => c.id !== clientId);
    writeDatabase(db);
    return withLatency(undefined);
}

// Provider Functions
export const getProviders = async (): Promise<Provider[]> => withLatency(readDatabase().providers);
export const addProvider = async (provider: Provider): Promise<Provider> => {
  const db = readDatabase();
  db.providers.unshift(provider);
  writeDatabase(db);
  return withLatency(provider);
};
export const updateProvider = async (updatedProvider: Provider): Promise<Provider> => {
    const db = readDatabase();
    db.providers = db.providers.map(p => p.id === updatedProvider.id ? updatedProvider : p);
    writeDatabase(db);
    return withLatency(updatedProvider);
};
export const deleteProvider = async (providerId: string): Promise<void> => {
    const db = readDatabase();
    db.providers = db.providers.filter(p => p.id !== providerId);
    writeDatabase(db);
    return withLatency(undefined);
};

// Claim Functions
export const getClaims = async (): Promise<Claim[]> => withLatency(readDatabase().claims);
export const updateClaim = async (updatedClaim: Claim): Promise<Claim> => {
    const db = readDatabase();
    db.claims = db.claims.map(c => c.id === updatedClaim.id ? updatedClaim : c);
    writeDatabase(db);
    return withLatency(updatedClaim);
};
export const batchUpdateClaimStatus = async (claimIds: string[], newStatus: ClaimStatus): Promise<void> => {
    const db = readDatabase();
    db.claims = db.claims.map(claim => 
        claimIds.includes(claim.id) ? { ...claim, status: newStatus } : claim
    );
    writeDatabase(db);
    return withLatency(undefined);
};

// Event Functions
export const getEvents = async (): Promise<CalendarEvent[]> => {
    const db = readDatabase();
    // Dates are stored as strings, so we need to convert them back to Date objects
    return withLatency(db.events.map(e => ({...e, start: new Date(e.start), end: new Date(e.end)})));
};
export const addEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
    const db = readDatabase();
    db.events.push(event);
    writeDatabase(db);
    return withLatency(event);
};
export const updateEvent = async (updatedEvent: CalendarEvent): Promise<CalendarEvent> => {
    const db = readDatabase();
    db.events = db.events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    writeDatabase(db);
    return withLatency(updatedEvent);
};
export const deleteEvent = async (eventId: string): Promise<void> => {
    const db = readDatabase();
    db.events = db.events.filter(e => e.id !== eventId);
    writeDatabase(db);
    return withLatency(undefined);
};

// User Functions
export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const db = readDatabase();
    if (db.users.find(u => u.email === user.email)) {
        throw new Error('User with this email already exists.');
    }
    const newUser: User = { ...user, id: `user-${Date.now()}` };
    db.users.push(newUser);
    writeDatabase(db);
    return withLatency(newUser);
};
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const user = readDatabase().users.find(u => u.email === email);
    return withLatency(user);
};
export const updateUser = async (updatedUser: User): Promise<User> => {
    const db = readDatabase();
    db.users = db.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    writeDatabase(db);
    return withLatency(updatedUser);
};