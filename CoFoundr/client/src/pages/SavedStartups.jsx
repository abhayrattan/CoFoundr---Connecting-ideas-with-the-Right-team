import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StartupCard from '../components/StartupCard';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SavedStartups = () => {
  const { user } = useContext(AuthContext);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/startups/bookmarked');
      if (res.data.success) {
        setStartups(res.data.startups);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Saved Startups</h1>
      
      {startups.length === 0 ? (
        <EmptyState 
          title="No saved startups yet"
          description="Bookmark startups you're interested in and come back later."
          actionText="Explore Startups"
          actionLink="/startups"
          icon={<svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {startups.map(startup => (
            <StartupCard 
              key={startup._id} 
              startup={startup} 
              onBookmarkUpdate={fetchBookmarks} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStartups;
