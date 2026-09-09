import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';

const ChatSelect = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams/my');
        if (res.data.success) {
          setTeams(res.data.teams);
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchTeams();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  // If user only has one team, go straight to chat
  if (teams.length === 1) {
    return <Navigate to={`/teams/${teams[0]._id}/chat`} replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Select Team Chat</h1>
      {teams.length === 0 ? (
        <EmptyState 
          title="No chats available"
          description="You must be part of a team to access chat."
          actionText="Explore Startups"
          actionLink="/startups"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <Link key={team._id} to={`/teams/${team._id}/chat`}>
              <Card className="hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                    {(team.startupId?.title || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{team.startupId?.title || 'Unknown Startup'}</h3>
                    <p className="text-sm text-slate-500">Tap to open chat</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSelect;
