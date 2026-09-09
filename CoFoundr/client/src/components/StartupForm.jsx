import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

const StartupForm = ({ initialData, onSubmit, error }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '', description: '', domain: '', requiredSkills: '', teamSize: 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm border border-rose-100">{error}</div>}
      <Input label="Startup Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. NextGen AI" />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32" placeholder="Describe your vision..."></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Domain" required value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="e.g. EdTech" />
        <Input label="Team Size" type="number" min="2" max="20" required value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} />
      </div>
      <Input label="Required Skills (comma separated)" required value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} placeholder="e.g. React, Node, UI/UX" />
      <Button type="submit" className="w-full" size="lg">{initialData ? 'Update Startup' : 'Launch Startup'}</Button>
    </form>
  );
};

export default StartupForm;
