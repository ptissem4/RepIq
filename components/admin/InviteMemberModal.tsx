import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { XMarkIcon } from '../common/icons/XMarkIcon';

interface InviteMemberModalProps {
  onInvite: (name: string, email: string) => void;
  onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onInvite, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onInvite(name.trim(), email.trim());
    }
  };

  const inputStyles = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Invite New Team Member</h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="memberName" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="memberName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyles}
                  placeholder="John Doe"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="memberEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputStyles}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-dark-700 flex justify-end gap-4">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Send Invitation</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InviteMemberModal;
