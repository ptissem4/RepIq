
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { XMarkIcon } from '../common/icons/XMarkIcon';

interface CreateOrgModalProps {
  onCreate: (name: string, licenseLimit: number) => void;
  onClose: () => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && limit > 0) {
      onCreate(name.trim(), limit);
      onClose();
    }
  };

  const inputStyles = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create New Organization</h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-300 mb-1">
                  Organization Name
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyles}
                  placeholder="e.g., Acme Inc."
                  required
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="licenseLimit" className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Licenses
                </label>
                <input
                  id="licenseLimit"
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className={inputStyles}
                  required
                  min="1"
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-dark-700 flex justify-end gap-4">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Create Organization</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateOrgModal;
