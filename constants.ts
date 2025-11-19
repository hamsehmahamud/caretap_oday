// Fix: Added Client and Provider to the import list.
import {
  Client,
  Provider,
  ClientStatus,
  ProviderStatus,
  DocumentStatus,
  ClaimStatus,
  Kpi, ActivityLog, Alert,
  NavItem,
  TeamMember, CalendarEvent,
  PayerRevenue, DemographicsData, ServiceUtilization, CredentialingStatus, DenialReason, Document, AuditLogEntry
} from './types';

import {
    HomeIcon,
    UsersIcon,
    IdentificationIcon,
    CalendarIcon,
    DocumentChartBarIcon,
    ChartPieIcon,
    CogIcon,
    BriefcaseIcon,
    FolderIcon,
} from './components/icons';

export const navItems: NavItem[] = [
    { id: 'dashboard', view: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    {
      id: 'directory',
      label: 'Directory',
      icon: FolderIcon,
      children: [
        { id: 'clients', view: 'clients', label: 'Clients', icon: UsersIcon },
        { id: 'providers', view: 'providers', label: 'Providers', icon: IdentificationIcon },
      ]
    },
    { id: 'scheduling', view: 'scheduling', label: 'Scheduling', icon: CalendarIcon },
    { id: 'billing', view: 'billing', label: 'Billing', icon: DocumentChartBarIcon },
    { id: 'reports', view: 'reports', label: 'Reports', icon: ChartPieIcon },
    { id: 'settings', view: 'settings', label: 'Settings', icon: CogIcon },
];

export const mockDocuments: Document[] = [
  { id: 'DOC-001', name: 'Identification.pdf', uploadDate: '2023-01-15', status: DocumentStatus.Verified },
  { id: 'DOC-002', name: 'Proof of Address.png', uploadDate: '2023-01-15', status: DocumentStatus.Verified },
  { id: 'DOC-003', name: 'Insurance Card.pdf', uploadDate: '2023-02-01', status: DocumentStatus.Pending },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: 'LOG-001', user: 'Admin User', action: 'CREATE', details: 'Profile created.', timestamp: '2023-01-10 09:30 AM' },
  { id: 'LOG-002', user: 'Jane Doe', action: 'UPDATE', details: 'Updated contact information.', timestamp: '2023-03-22 02:45 PM' },
];

// Fix: Explicitly typed mockClients as Client[] to prevent type widening of the 'type' property.
export const mockClients: Client[] = [
  {
    id: 'CL-001', type: 'client', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890',
    dateOfBirth: '1990-05-15', address: '123 Main St, Anytown, USA', status: ClientStatus.Active, payer: 'United Healthcare',
    careManager: 'Sarah Smith', admissionDate: '2023-01-10', documents: mockDocuments, auditLog: mockAuditLog,
  },
  {
    id: 'CL-002', type: 'client', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '098-765-4321',
    dateOfBirth: '1985-08-20', address: '456 Oak Ave, Anytown, USA', status: ClientStatus.Pending, payer: 'Aetna',
    careManager: 'Robert Jones', admissionDate: '2023-02-20', documents: [], auditLog: [mockAuditLog[0]],
  },
   {
    id: 'CL-003', type: 'client', firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@example.com', phone: '555-555-5555',
    dateOfBirth: '2001-11-30', address: '789 Pine Ln, Anytown, USA', status: ClientStatus.Inactive, payer: 'Cigna',
    careManager: 'Sarah Smith', admissionDate: '2022-11-15', documents: [], auditLog: [],
  },
];

// Fix: Explicitly typed mockProviders as Provider[] to prevent type widening of the 'type' property.
export const mockProviders: Provider[] = [
  {
    id: 'PR-001', type: 'provider', firstName: 'Alice', lastName: 'Williams', email: 'alice.w@provider.com', phone: '321-654-0987',
    specialty: 'Behavioral Therapist', status: ProviderStatus.Active, hireDate: '2022-06-01', documents: mockDocuments, auditLog: mockAuditLog,
    certifications: [
        { id: 'CERT-01', name: 'BCBA', issueDate: '2022-05-01', expiryDate: '2024-12-31', status: 'Active' }
    ]
  },
  {
    id: 'PR-002', type: 'provider', firstName: 'Bob', lastName: 'Brown', email: 'bob.b@provider.com', phone: '654-321-7890',
    specialty: 'Speech Therapist', status: ProviderStatus.OnHold, hireDate: '2021-09-15', documents: [], auditLog: [mockAuditLog[0]],
    certifications: []
  },
];


export const mockActivities: ActivityLog[] = [
    { id: 'ACT-001', user: 'Admin User', description: 'Added new client: John Doe.', timestamp: '2 hours ago' },
    { id: 'ACT-002', user: 'Sarah Smith', description: 'Submitted claim #CLM-12345 for John Doe.', timestamp: '3 hours ago' },
    { id: 'ACT-003', user: 'Admin User', description: 'Updated provider profile for Alice Williams.', timestamp: 'Yesterday' },
    { id: 'ACT-004', user: 'Robert Jones', description: 'Verified documents for Jane Smith.', timestamp: 'Yesterday' },
];

// Fix: Exported mockAlerts constant to resolve import error in Header.tsx.
export const mockAlerts: Alert[] = [
    {
        id: 'alert-001',
        title: 'Credentialing Expiring',
        description: `Alice Williams's BCBA cert expires in 25 days.`,
        priority: 'High',
        timestamp: 'Today'
    },
    {
        id: 'alert-002',
        title: 'Claim Denied',
        description: `Claim #CLM-58922 for Peter Jones was denied.`,
        priority: 'Medium',
        timestamp: 'Yesterday'
    }
];

export const mockClaims = [
    { id: 'CLM-58920', clientName: 'John Doe', payer: 'United Healthcare', serviceFrom: '2023-04-01', serviceTo: '2023-04-07', amount: 450.00, status: ClaimStatus.Paid },
    { id: 'CLM-58921', clientName: 'Jane Smith', payer: 'Aetna', serviceFrom: '2023-04-01', serviceTo: '2023-04-07', amount: 300.00, status: ClaimStatus.Submitted },
    { id: 'CLM-58922', clientName: 'Peter Jones', payer: 'Cigna', serviceFrom: '2023-03-20', serviceTo: '2023-03-26', amount: 600.50, status: ClaimStatus.Denied },
    { id: 'CLM-58923', clientName: 'John Doe', payer: 'United Healthcare', serviceFrom: '2023-04-08', serviceTo: '2023-04-14', amount: 450.00, status: ClaimStatus.ReadyToBill },
    { id: 'CLM-58924', clientName: 'Jane Smith', payer: 'Aetna', serviceFrom: '2023-04-08', serviceTo: '2023-04-14', amount: 300.00, status: ClaimStatus.Draft },
];

export const mockTeamMembers: TeamMember[] = [
    { id: 'PR-001', name: 'Alice Williams', initials: 'AW', color: 'bg-blue-500', avatarUrl: 'https://picsum.photos/id/1027/100' },
    { id: 'PR-002', name: 'Bob Brown', initials: 'BB', color: 'bg-green-500', avatarUrl: 'https://picsum.photos/id/1005/100' },
    { id: 'PR-003', name: 'Charlie Davis', initials: 'CD', color: 'bg-yellow-500', avatarUrl: 'https://picsum.photos/id/1011/100' },
];

const today = new Date();
const getEventDate = (dayOffset: number, hour: number, minute: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date;
};

export const mockEvents: CalendarEvent[] = [
    { id: 'EVT-001', title: 'Therapy Session', clientName: 'John Doe', start: getEventDate(0, 9, 0), end: getEventDate(0, 10, 0), teamMemberId: 'PR-001' },
    { id: 'EVT-002', title: 'Initial Assessment', clientName: 'Jane Smith', start: getEventDate(0, 11, 0), end: getEventDate(0, 12, 30), teamMemberId: 'PR-002' },
    { id: 'EVT-003', title: 'Speech Therapy', clientName: 'Peter Jones', start: getEventDate(1, 14, 0), end: getEventDate(1, 15, 0), teamMemberId: 'PR-002' },
];


// Mock Data for Reports
export const mockPayerRevenue: PayerRevenue[] = [
  { payer: 'United Healthcare', totalRevenue: 125400.50, claimCount: 250, paidPercentage: 95.5 },
  { payer: 'Aetna', totalRevenue: 98600.00, claimCount: 180, paidPercentage: 92.1 },
  { payer: 'Cigna', totalRevenue: 75230.75, claimCount: 150, paidPercentage: 88.7 },
  { payer: 'Blue Cross', totalRevenue: 55100.00, claimCount: 110, paidPercentage: 98.2 },
  { payer: 'Medicaid', totalRevenue: 150320.00, claimCount: 350, paidPercentage: 90.3 },
];

export const mockDemographics: DemographicsData = {
  ageGroups: [
    { range: '0-18', count: 45, percentage: 36.3 },
    { range: '19-35', count: 32, percentage: 25.8 },
    { range: '36-50', count: 28, percentage: 22.6 },
    { range: '51+', count: 19, percentage: 15.3 },
  ],
  locations: [
    { location: 'Anytown', count: 78, percentage: 62.9 },
    { location: 'Springfield', count: 31, percentage: 25.0 },
    { location: 'Other', count: 15, percentage: 12.1 },
  ],
};

export const mockServiceUtilization: ServiceUtilization[] = [
  { period: 'This Week', scheduled: 150, completed: 135, cancelled: 10, noShow: 5 },
  { period: 'Last Week', scheduled: 145, completed: 132, cancelled: 8, noShow: 5 },
  { period: 'This Month', scheduled: 620, completed: 580, cancelled: 25, noShow: 15 },
  { period: 'Last Month', scheduled: 610, completed: 575, cancelled: 22, noShow: 13 },
];

export const mockCredentialingStatus: CredentialingStatus[] = [
  { providerName: 'Alice Williams', credentialName: 'BCBA', status: 'Active', expiryDate: '2025-05-01' },
  { providerName: 'Bob Brown', credentialName: 'SLP License', status: 'Active', expiryDate: '2024-09-15' },
  { providerName: 'Charlie Davis', credentialName: 'CPR Certification', status: 'Expiring Soon', expiryDate: '2023-11-30' },
  { providerName: 'Diana Miller', credentialName: 'State License', status: 'Expired', expiryDate: '2023-09-01' },
  { providerName: 'Ethan Wilson', credentialName: 'BCBA', status: 'Active', expiryDate: '2026-01-20' },
];

export const mockDenialReasons: DenialReason[] = [
  { reason: 'Service not covered', count: 22, totalAmount: 5500.00 },
  { reason: 'Incorrect coding', count: 18, totalAmount: 3250.50 },
  { reason: 'Patient info mismatch', count: 15, totalAmount: 2800.00 },
  { reason: 'Authorization expired', count: 10, totalAmount: 4100.75 },
  { reason: 'Other', count: 5, totalAmount: 950.00 },
];