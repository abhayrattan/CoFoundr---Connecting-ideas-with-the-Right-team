import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StartupForm from '../components/StartupForm';
import Loading from '../components/Loading';
import ErrorComponent from '../components/Error';

const EditStartup = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await api.get(`/startups/${id}`);
        if (res.data.success) {
          setInitialData(res.data.startup);
        }
      } catch (err) {
        setError('Failed to load startup');
      }
      setLoading(false);
    };
    fetchStartup();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const res = await api.put(`/startups/${id}`, formData);
      if (res.data.success) {
        navigate(`/startups/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update startup');
    }
  };

  if (loading) return <Loading />;
  if (error || !initialData) return <ErrorComponent message={error || 'Startup not found'} />;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Startup</h1>
      <StartupForm initialData={initialData} onSubmit={handleSubmit} error={error} />
    </div>
  );
};

export default EditStartup;
