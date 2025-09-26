
import React, { useState } from 'react';
import { Organization } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { XMarkIcon } from '../common/icons/XMarkIcon';

interface BillingManagementModalProps {
  organization: Organization;
  onSave: (organization: Organization) => void;
  onClose: () => void;
}

const BillingManagementModal: React.FC<BillingManagementModalProps> = ({ organization, onSave, onClose }) => {
  const [formData, setFormData] = useState<Organization>(organization);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyles = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Manage Billing for {organization.name}</h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-300 mb-1">
                  Monthly Recurring Amount ($)
                </label>
                <input
                  id="monthlyAmount"
                  type="number"
                  value={formData.monthlyAmount || ''}
                  onChange={(e) => setFormData({...formData, monthlyAmount: parseFloat(e.target.value)})}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <label htmlFor="billingStatus" className="block text-sm font-medium text-gray-300 mb-1">
                  Billing Status
                </label>
                <select
                  id="billingStatus"
                  value={formData.billingStatus || 'Active'}
                  onChange={(e) => setFormData({...formData, billingStatus: e.target.value as any})}
                  className={inputStyles}
                >
                  <option value="Active">Active</option>
                  <option value="Past Due">Past Due</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 bg-dark-700 flex justify-end gap-4">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Save Billing Info</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BillingManagementModal;
