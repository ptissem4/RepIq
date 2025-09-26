import React from 'react';
import Button from './Button';
import Card from './Card';
import { XMarkIcon } from './icons/XMarkIcon';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, confirmText = "Delete", onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="p-4 bg-dark-700 flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={onConfirm} variant="danger">{confirmText}</Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;
