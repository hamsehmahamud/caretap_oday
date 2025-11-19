import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { XIcon } from './icons';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    const updatedUser = { ...user, name, email };
    if (password) {
      updatedUser.password = password;
    }
    
    onSave(updatedUser);
  };

  if (!isOpen) return null;

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Profile</h3>
            <button type="button" onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon />
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelClasses}>Full Name</label>
                <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input type="email" name="email" id="email" value={email} disabled className={`${inputClasses} bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed`} />
              </div>
               <div>
                <label htmlFor="password" className={labelClasses}>New Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="Leave blank to keep current password" />
              </div>
               <div>
                <label htmlFor="confirmPassword" className={labelClasses}>Confirm New Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} />
              </div>
               {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;