import { FC } from 'react';

export type ViewType = 'dashboard' | 'clients' | 'providers' | 'scheduling' | 'billing' | 'reports' | 'settings';
export type Theme = 'light' | 'dark';
export type ThemeSetting = Theme | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should be handled securely on a backend
  role: string;
}

export enum ClientStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

export enum ProviderStatus {
  Active = 'Active',
  OnHold = 'On Hold',
  Inactive = 'Inactive',
}

export enum DocumentStatus {
  Verified = 'Verified',
  Pending = 'Pending',
  Expired = 'Expired',
}

export enum ClaimStatus {
    Paid = 'Paid',
    Submitted = 'Submitted',
    Denied = 'Denied',
    ReadyToBill = 'Ready to Bill',
    Draft = 'Draft',
}

export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  status: DocumentStatus;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  details: string;
  timestamp: string;
}

export interface BaseProfile {
  id: string;
  type: 'client' | 'provider';
  firstName: string;
  lastName:string;
  email: string;
  phone: string;
  documents: Document[];
  auditLog: AuditLogEntry[];
}

export interface Client extends BaseProfile {
  type: 'client';
  dateOfBirth: string;
  address: string;
  status: ClientStatus;
  payer: string;
  careManager: string;
  admissionDate: string;
}

export interface Certification {
    id: string;
    name: string;
    issueDate: string;
    expiryDate: string;
    status: 'Active' | 'Expired';
}

export interface Provider extends BaseProfile {
  type: 'provider';
  specialty: string;
  status: ProviderStatus;
  hireDate: string;
  certifications: Certification[];
}

export interface Claim {
    id: string;
    clientName: string;
    payer: string;
    serviceFrom: string;
    serviceTo: string;
    amount: number;
    status: ClaimStatus;
}

export interface Kpi {
    label: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon: FC<any>;
}

export interface ActivityLog {
    id: string;
    user: string;
    description: string;
    timestamp: string;
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    timestamp: string;
}

export interface NavItem {
    id: string;
    label: string;
    icon: FC<any>;
    view?: ViewType;
    children?: NavItem[];
}

export interface TeamMember {
    id: string;
    name: string;
    avatarUrl?: string;
    initials: string;
    color: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    clientName: string;
    start: Date;
    end: Date;
    teamMemberId: string;
}

// Types for Reports
export interface PayerRevenue {
  payer: string;
  totalRevenue: number;
  claimCount: number;
  paidPercentage: number;
}

export interface DemographicsData {
  ageGroups: { range: string; count: number; percentage: number }[];
  locations: { location: string; count: number; percentage: number }[];
}

export interface ServiceUtilization {
  period: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export type CredentialingStatusType = 'Active' | 'Expiring Soon' | 'Expired';
export interface CredentialingStatus {
  providerName: string;
  credentialName: string;
  status: CredentialingStatusType;
  expiryDate: string;
}

export interface DenialReason {
  reason: string;
  count: number;
  totalAmount: number;
}