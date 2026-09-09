import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StartupForm from '../components/StartupForm';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';

const CreateStartup = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const res = await api.post('/startups', formData);
      if (res.data.success) {
        navigate(`/startups/${res.data.startup._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create startup');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/my-startups" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">&larr; Back to My Startups</Link>
      </div>
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create a Startup</h1>
        <p className="text-slate-500 mb-8">Fill out the details below to launch your project and start recruiting a team.</p>
        <StartupForm onSubmit={handleSubmit} error={error} />
      </Card>
    </div>
  );
};

export default CreateStartup;
