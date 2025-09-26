
import React, { useState } from 'react';
import { Organization, User } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeftIcon } from '../common/icons/ArrowLeftIcon';
import BillingManagementModal from './BillingManagementModal';

interface OrganizationDetailsViewProps {
  organization: Organization;
  users: User[];
  onBack: () => void;
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
}

const OrganizationDetailsView: React.FC<OrganizationDetailsViewProps> = ({ organization, users, onBack, setOrganizations }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [orgData, setOrgData] = useState(organization);

  const handleSave = () => {
    setOrganizations(prev => prev.map(o => o.id === orgData.id ? orgData : o));
    setIsEditing(false);
  };

  const handleBillingSave = (updatedOrg: Organization) => {
    setOrgData(updatedOrg);
    setOrganizations(prev => prev.map(o => o.id === updatedOrg.id ? updatedOrg : o));
    setIsBillingModalOpen(false);
  }

  const getStatusBadge = (status?: 'Active' | 'Past Due' | 'Canceled') => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Past Due': return 'bg-yellow-500/20 text-yellow-400';
      case 'Canceled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="secondary" className="!px-3">
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{organization.name}</h1>
          <p className="text-gray-400">Organization Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Organization Info</h3>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(false)} variant="secondary" className="!text-xs !py-1 !px-3">Cancel</Button>
                        <Button onClick={handleSave} variant="primary" className="!text-xs !py-1 !px-3">Save</Button>
                    </div>
                ) : (
                    <Button onClick={() => setIsEditing(true)} variant="secondary" className="!text-xs !py-1 !px-3">Edit</Button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-400">Organization Name</p>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={orgData.name} 
                            onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 py-1 text-white text-sm"
                        />
                    ) : (
                        <p className="font-semibold text-white">{orgData.name}</p>
                    )}
                </div>
                <div>
                    <p className="text-gray-400">License Limit</p>
                    {isEditing ? (
                         <input 
                            type="number" 
                            value={orgData.licenseLimit} 
                            onChange={(e) => setOrgData({...orgData, licenseLimit: parseInt(e.target.value, 10) || 0})}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-2 py-1 text-white text-sm"
                        />
                    ) : (
                        <p className="font-semibold text-white">{orgData.licenseLimit} Seats</p>
                    )}
                </div>
            </div>
          </Card>
          
           <Card className="overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">Team Members ({users.length})</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-dark-700 sticky top-0">
                        <tr>
                            <th className="p-4 font-semibold text-sm text-gray-300">Name</th>
                            <th className="p-4 font-semibold text-sm text-gray-300">Role</th>
                            <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-4">
                                    <p className="font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </td>
                                <td className="p-4 capitalize text-gray-300">{user.role}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{user.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Billing Management</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-gray-400">Billing Status</p>
                        <p className={`font-semibold inline-block px-2 py-0.5 rounded-full text-xs ${getStatusBadge(orgData.billingStatus)}`}>{orgData.billingStatus}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Monthly Amount</p>
                        <p className="font-semibold text-white">${orgData.monthlyAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Next Billing Date</p>
                        <p className="font-semibold text-white">{orgData.nextBillingDate}</p>
                    </div>
                </div>
                <Button onClick={() => setIsBillingModalOpen(true)} variant="primary" className="w-full justify-center mt-6">Manage Billing</Button>
            </Card>
        </div>
      </div>
      
      {isBillingModalOpen && (
        <BillingManagementModal 
            organization={orgData}
            onSave={handleBillingSave}
            onClose={() => setIsBillingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrganizationDetailsView;
