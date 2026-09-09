import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ResumeUpload from '../components/ResumeUpload';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ bio: '', skills: '', experience: '', github: '', linkedin: '', portfolio: '', availability: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/profile').then(res => {
      if (res.data.success && res.data.user) {
        const u = res.data.user;
        setFormData({
          bio: u.bio || '',
          skills: u.skills ? u.skills.join(', ') : '',
          experience: u.experience || '',
          github: u.github || '',
          linkedin: u.linkedin || '',
          portfolio: u.portfolio || '',
          availability: u.availability || ''
        });
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
        <p className="text-slate-500 mb-8">Update your information to stand out to startups and teammates.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 h-24"></textarea>
          </div>
          
          <Input label="Skills (comma separated)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, Design" />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
            <textarea value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 h-24"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
            <Input label="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
            <Input label="Portfolio URL" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} />
            <Input label="Availability" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} placeholder="e.g. 10 hrs/week" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => navigate('/profile')}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
      <ResumeUpload />
    </div>
  );
};

export default EditProfile;

