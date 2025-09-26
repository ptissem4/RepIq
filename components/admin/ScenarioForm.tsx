import React, { useState } from 'react';
import { Scenario } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import ScenarioPreview from './ScenarioPreview';

interface ScenarioFormProps {
  scenario: Scenario | null;
  onSave: (scenario: Scenario) => void;
  onClose: () => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ scenario, onSave, onClose }) => {
  const [formData, setFormData] = useState<Scenario>(
    scenario || {
      id: '',
      title: '',
      description: '',
      systemInstruction: '',
      lang: 'en-US',
      category: '',
      prospect: { name: '', role: '', avatarUrl: '' },
      details: { duration: '', difficulty: 'Medium', personality: '' },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          // @ts-ignore
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          details: { ...prev.details, [name]: value }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputFieldClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 border-b border-dark-700 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">
                    {scenario ? 'Edit Scenario' : 'Create New Scenario'}
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Fields Column */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputFieldClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={inputFieldClasses}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className={inputFieldClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                                    <select name="lang" value={formData.lang} onChange={handleChange} className={inputFieldClasses}>
                                    <option value="en-US">English (US)</option>
                                    <option value="fr-FR">French</option>
                                    <option value="es-ES">Spanish</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 border-t border-dark-700 pt-6">
                             <h3 className="text-lg font-semibold text-white">Scenario Details</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                                    <select name="difficulty" value={formData.details.difficulty} onChange={handleDetailsChange} className={inputFieldClasses}>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                                    <input type="text" name="duration" value={formData.details.duration} onChange={handleDetailsChange} required className={inputFieldClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Personality Trait</label>
                                    <input type="text" name="personality" value={formData.details.personality} onChange={handleDetailsChange} required className={inputFieldClasses} />
                                </div>
                            </div>
                        </div>

                        {/* Prospect Info */}
                        <div className="space-y-4 border-t border-dark-700 pt-6">
                            <h3 className="text-lg font-semibold text-white">Prospect Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input type="text" name="prospect.name" value={formData.prospect.name} onChange={handleChange} required className={inputFieldClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                    <input type="text" name="prospect.role" value={formData.prospect.role} onChange={handleChange} required className={inputFieldClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Avatar URL</label>
                                    <input type="text" name="prospect.avatarUrl" value={formData.prospect.avatarUrl} onChange={handleChange} required className={inputFieldClasses} />
                                </div>
                            </div>
                        </div>
                        
                        {/* System Instruction */}
                        <div className="border-t border-dark-700 pt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-1">System Instruction (AI Prompt)</label>
                            <textarea name="systemInstruction" value={formData.systemInstruction} onChange={handleChange} required rows={8} className={inputFieldClasses}></textarea>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div>
                        <ScenarioPreview scenario={formData} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-dark-700 flex justify-end gap-4 flex-shrink-0 border-t border-dark-700">
                <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Save Scenario</Button>
            </div>
        </form>
      </Card>
    </div>
  );
};

export default ScenarioForm;
