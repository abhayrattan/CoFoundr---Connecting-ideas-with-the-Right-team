import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StartupCard from '../components/StartupCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const MyStartups = () => {
  const { user } = useContext(AuthContext);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStartups = async () => {
      try {
        const res = await api.get('/startups');
        if (res.data.success) {
          const mine = res.data.startups.filter(s => s.createdBy._id === user._id);
          setStartups(mine);
        }
      } catch (err) {}
      setLoading(false);
    };

    if (user) fetchMyStartups();
  }, [user]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Startups</h1>
          <p className="text-slate-500 mt-1">Manage the projects you lead.</p>
        </div>
        <Link to="/startups/create">
          <Button>Create Startup</Button>
        </Link>
      </div>
      
      {startups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map(startup => (
            <StartupCard key={startup._id} startup={startup} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="🚀" 
          title="No startups yet" 
          description="You haven't launched any startups. Create one to start building your team." 
          action={<Link to="/startups/create"><Button>Launch a Startup</Button></Link>}
        />
      )}
    </div>
  );
};

export default MyStartups;
