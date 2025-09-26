
import React, { useState } from 'react';
import { Organization } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import CreateOrgModal from './CreateOrgModal';

interface OrganizationManagementProps {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  onImpersonate: (organization: Organization) => void;
  onCreateOrg: (name: string, licenseLimit: number) => void;
  onViewDetails: (organization: Organization) => void;
}

const OrganizationManagement: React.FC<OrganizationManagementProps> = ({ organizations, setOrganizations, onImpersonate, onCreateOrg, onViewDetails }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const clientOrgs = organizations.filter(o => o.id !== 'org_0'); // Exclude the admin's own org

  return (
    <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white">Organization Management</h1>
                <p className="text-gray-400 mt-1">Create new client organizations and view their dashboards.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
                Create New Organization
            </Button>
        </div>
        
        <Card className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-dark-700">
                <tr>
                  <th className="p-4 font-semibold text-sm text-gray-300">Organization Name</th>
                  <th className="p-4 font-semibold text-sm text-gray-300">License Limit</th>
                  <th className="p-4 font-semibold text-sm text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {clientOrgs.map(org => (
                  <tr key={org.id} className="hover:bg-dark-800 transition-colors">
                    <td 
                        className="p-4 text-white font-medium cursor-pointer hover:underline"
                        onClick={() => onViewDetails(org)}
                    >
                        {org.name}
                    </td>
                    <td className="p-4 text-gray-300">{org.licenseLimit}</td>
                    <td className="p-4">
                      <Button onClick={() => onImpersonate(org)} variant="secondary" className="!text-xs !py-1 !px-3">
                          View Dashboard
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </Card>

        {isCreateModalOpen && (
            <CreateOrgModal 
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={onCreateOrg}
            />
        )}
    </div>
  );
};

export default OrganizationManagement;