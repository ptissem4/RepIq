import React, { useState } from 'react';
import { Scenario } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import ScenarioForm from './ScenarioForm';

interface ScenarioManagementProps {
  scenarios: Scenario[];
  setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
}

const ScenarioManagement: React.FC<ScenarioManagementProps> = ({ scenarios, setScenarios }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);

  const handleCreateNew = () => {
    setEditingScenario(null);
    setIsFormOpen(true);
  };

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setIsFormOpen(true);
  };

  const handleDelete = (scenarioId: string) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    }
  };

  const handleSave = (scenario: Scenario) => {
    if (editingScenario) {
      // Update existing scenario
      setScenarios(prev => prev.map(s => (s.id === scenario.id ? scenario : s)));
    } else {
      // Add new scenario
      setScenarios(prev => [...prev, { ...scenario, id: `s${Date.now()}` }]);
    }
    setIsFormOpen(false);
    setEditingScenario(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white">Scenario Management</h1>
            <p className="text-gray-400 mt-1">Create, edit, and manage training scenarios.</p>
        </div>
        <Button onClick={handleCreateNew} variant="primary">
            Create New Scenario
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-dark-700">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-300">Title</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Category</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Difficulty</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Prospect</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {scenarios.map(scenario => (
              <tr key={scenario.id} className="hover:bg-dark-800 transition-colors">
                <td className="p-4 text-white font-medium">{scenario.title}</td>
                <td className="p-4 text-gray-400">{scenario.category}</td>
                <td className="p-4 text-gray-400">{scenario.details.difficulty}</td>
                <td className="p-4 text-gray-400">{scenario.prospect.name}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(scenario)} variant="secondary" className="!px-3 !py-1 text-xs">Edit</Button>
                    <Button onClick={() => handleDelete(scenario.id)} variant="danger" className="!px-3 !py-1 text-xs">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isFormOpen && (
        <ScenarioForm
          scenario={editingScenario}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ScenarioManagement;