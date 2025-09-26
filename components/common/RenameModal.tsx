import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import { XMarkIcon } from './icons/XMarkIcon';

interface RenameModalProps {
  currentTitle: string;
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ currentTitle, onSave, onClose }) => {
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(newTitle.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Rename Session</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div>
            <label htmlFor="sessionTitle" className="block text-sm font-medium text-gray-300 mb-1">
              Session Title
            </label>
            <input
              id="sessionTitle"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              autoFocus
            />
          </div>
        </div>
        <div className="p-4 bg-dark-700 flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary">Save</Button>
        </div>
      </Card>
    </div>
  );
};

export default RenameModal;
