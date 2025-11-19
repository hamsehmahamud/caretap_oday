import React, { useState, useEffect } from 'react';
import { Client, Provider, Document, AuditLogEntry, DocumentStatus, Certification } from '../types';
// Fix: Added PlusIcon to the import list to resolve usage error.
import { XIcon, UploadIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon, UserCircleIcon, CalendarIcon, PhoneIcon, MailIcon, LocationMarkerIcon, BriefcaseIcon, PencilIcon, TrashIcon, PlusIcon } from './icons';

interface ProfileDetailViewProps {
  profile: Client | Provider | null;
  onClose: () => void;
  onUpdateClient: (client: Client) => void;
  onUpdateProvider: (provider: Provider) => void;
}

type Tab = 'details' | 'documents' | 'certifications' | 'audit';

const getDocumentStatusIcon = (status: DocumentStatus) => {
    switch (status) {
        case DocumentStatus.Verified: return <CheckCircleIcon className="text-green-500" />;
        case DocumentStatus.Pending: return <ClockIcon className="text-yellow-500" />;
        case DocumentStatus.Expired: return <ExclamationCircleIcon className="text-red-500" />;
    }
};

const DetailItem: React.FC<{icon: React.ReactNode, label: string, value: string | undefined}> = ({icon, label, value}) => (
    <div className="flex items-start py-3">
        <span className="text-gray-500 dark:text-gray-400 w-6 h-6 mr-4">{icon}</span>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || 'N/A'}</p>
        </div>
    </div>
);

const EditableDetailItem: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, name, value, onChange}) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <input 
            type="text" 
            name={name} 
            id={name} 
            value={value} 
            onChange={onChange} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
    </div>
);


const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ profile, onClose, onUpdateClient, onUpdateProvider }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(profile);

  useEffect(() => {
    setEditableProfile(profile);
    setIsEditing(false); // Reset editing state when profile changes
    setActiveTab('details');
  }, [profile]);
  
  if (!profile || !editableProfile) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditableProfile(prev => prev ? {...prev, [name]: value} : null);
  };
  
  const handleSave = () => {
    if (editableProfile.type === 'client') {
        onUpdateClient(editableProfile as Client);
    } else {
        onUpdateProvider(editableProfile as Provider);
    }
    setIsEditing(false);
  };

  const handleDocumentUpload = () => {
      const fileName = window.prompt("Enter the name for the new document:", "document.pdf");
      if (fileName && fileName.trim() !== '') {
        const newDoc: Document = { id: `DOC-${Date.now()}`, name: fileName.trim(), uploadDate: new Date().toLocaleDateString(), status: DocumentStatus.Pending };
        const updatedProfile = {...editableProfile, documents: [...editableProfile.documents, newDoc]};
        setEditableProfile(updatedProfile);
        if (updatedProfile.type === 'client') onUpdateClient(updatedProfile as Client); else onUpdateProvider(updatedProfile as Provider);
      }
  };
  
  const handleDocumentDelete = (docId: string) => {
      if (window.confirm('Are you sure you want to delete this document?')) {
        const updatedDocs = editableProfile.documents.filter(d => d.id !== docId);
        const updatedProfile = {...editableProfile, documents: updatedDocs};
        setEditableProfile(updatedProfile);
        if (updatedProfile.type === 'client') onUpdateClient(updatedProfile as Client); else onUpdateProvider(updatedProfile as Provider);
      }
  };
  
  const handleCertAdd = () => {
      const newCert: Certification = {id: `CERT-${Date.now()}`, name: 'New Certification', issueDate: new Date().toISOString().split('T')[0], expiryDate: '', status: 'Active'};
      const updatedCerts = [...(editableProfile as Provider).certifications, newCert];
      const updatedProfile = {...editableProfile, certifications: updatedCerts};
      setEditableProfile(updatedProfile);
      onUpdateProvider(updatedProfile as Provider);
  };

  const handleCertDelete = (certId: string) => {
    const updatedCerts = (editableProfile as Provider).certifications.filter(c => c.id !== certId);
    const updatedProfile = {...editableProfile, certifications: updatedCerts};
    setEditableProfile(updatedProfile);
    onUpdateProvider(updatedProfile as Provider);
  };


  const isClient = profile.type === 'client';

  const renderDetails = () => (
    isEditing ? (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <EditableDetailItem label="First Name" name="firstName" value={editableProfile.firstName} onChange={handleInputChange} />
                <EditableDetailItem label="Last Name" name="lastName" value={editableProfile.lastName} onChange={handleInputChange} />
            </div>
            <EditableDetailItem label="Email" name="email" value={editableProfile.email} onChange={handleInputChange} />
            <EditableDetailItem label="Phone" name="phone" value={editableProfile.phone} onChange={handleInputChange} />
            {isClient && <EditableDetailItem label="Address" name="address" value={(editableProfile as Client).address} onChange={handleInputChange} />}
            {!isClient && <EditableDetailItem label="Specialty" name="specialty" value={(editableProfile as Provider).specialty} onChange={handleInputChange} />}
        </div>
    ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <DetailItem icon={<UserCircleIcon />} label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
            <DetailItem icon={<MailIcon />} label="Email" value={profile.email} />
            <DetailItem icon={<PhoneIcon />} label="Phone" value={profile.phone} />
            {isClient && <DetailItem icon={<LocationMarkerIcon />} label="Address" value={(profile as Client).address} />}
            {isClient && <DetailItem icon={<CalendarIcon />} label="Admission Date" value={(profile as Client).admissionDate} />}
            {!isClient && <DetailItem icon={<BriefcaseIcon />} label="Specialty" value={(profile as Provider).specialty} />}
            {!isClient && <DetailItem icon={<CalendarIcon />} label="Hire Date" value={(profile as Provider).hireDate} />}
        </div>
    )
  );
  
  const renderDocuments = (documents: Document[]) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Uploaded Documents</h4>
            <button onClick={handleDocumentUpload} className="flex items-center text-sm bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/30">
                <UploadIcon /> <span className="ml-2">Upload</span>
            </button>
        </div>
        <ul className="space-y-3">
            {documents.length > 0 ? documents.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group">
                    <div className="flex items-center">
                        <DocumentTextIcon />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{doc.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {doc.uploadDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs font-medium">
                        {getDocumentStatusIcon(doc.status)}
                        <span className="ml-1.5 dark:text-gray-300">{doc.status}</span>
                         <button onClick={() => handleDocumentDelete(doc.id)} className="ml-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                    </div>
                </li>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No documents uploaded.</p>}
        </ul>
    </div>
  );
  
  const renderCertifications = (certifications: Certification[]) => (
     <div>
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Certifications</h4>
            <button onClick={handleCertAdd} className="flex items-center text-sm bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/30">
                <PlusIcon /> <span className="ml-2">Add</span>
            </button>
        </div>
        <ul className="space-y-3">
            {certifications.length > 0 ? certifications.map(cert => (
                 <li key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{cert.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Expires: {cert.expiryDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cert.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{cert.status}</span>
                        <button onClick={() => handleCertDelete(cert.id)} className="ml-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                    </div>
                </li>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No certifications found.</p>}
        </ul>
    </div>
  );
  
  const renderAuditLog = (log: AuditLogEntry[]) => (
     <div className="flow-root">
        <ul className="-mb-8">
            {log.length > 0 ? [...log].reverse().map((entry, idx) => (
                <li key={entry.id}>
                    <div className="relative pb-8">
                        {idx !== log.length - 1 && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>}
                        <div className="relative flex space-x-3">
                            <div>
                                <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                                   <UserCircleIcon className="text-gray-500 dark:text-gray-400" />
                                </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{entry.user}</span> {entry.action.toLowerCase()}: {entry.details}
                                    </p>
                                </div>
                                <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    <time>{entry.timestamp}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No audit history found.</p>}
        </ul>
     </div>
  );

  const tabs: {id: Tab, label: string, show: boolean}[] = [
      {id: 'details', label: 'Details', show: true},
      {id: 'documents', label: 'Documents', show: true},
      {id: 'certifications', label: 'Certifications', show: !isClient},
      {id: 'audit', label: 'Audit Trail', show: true},
  ];

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[40%] lg:w-1/3 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${profile ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
             <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.firstName} {profile.lastName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{isClient ? 'Client Profile' : 'Provider Profile'}</p>
             </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon />
            </button>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex px-6 space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.filter(t => t.show).map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}>{tab.label}</button>
            ))}
          </nav>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && renderDetails()}
            {activeTab === 'documents' && renderDocuments(profile.documents)}
            {activeTab === 'certifications' && !isClient && renderCertifications((profile as Provider).certifications)}
            {activeTab === 'audit' && renderAuditLog(profile.auditLog)}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
             {activeTab === 'details' && (
                isEditing ? (
                    <>
                        <button onClick={() => { setIsEditing(false); setEditableProfile(profile); }} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save Changes</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"><PencilIcon /> <span className="ml-2">Edit Details</span></button>
                )
             )}
        </div>

      </div>
    </div>
  );
};

export default ProfileDetailView;