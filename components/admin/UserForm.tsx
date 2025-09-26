
import React, { useState } from 'react';
import { User } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface UserFormProps {
  user: User;
  viewer: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, viewer, onSave, onClose }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputFieldClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Edit User: {user.name}
            </h2>

            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputFieldClasses} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputFieldClasses} />
              </div>
              {viewer.role === 'super-admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Plan</label>
                  <select name="plan" value={formData.plan} onChange={handleChange} className={inputFieldClasses}>
                      <option value="Trial">Trial</option>
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputFieldClasses}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Trial">Trial</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 bg-dark-700 flex justify-end gap-4">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
