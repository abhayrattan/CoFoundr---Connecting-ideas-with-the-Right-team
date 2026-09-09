import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';

const MyTeams = () => {
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">My Teams</h1>
      {teams.length === 0 ? (
        <EmptyState 
          title="You are not part of any teams"
          description="Apply to startups to join a team and start collaborating."
          actionText="Find Startups"
          actionLink="/startups"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map(team => (
            <Card key={team._id} className="hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{team.startupId?.title || 'Unknown Startup'}</h3>
              <p className="text-sm text-slate-500 mb-6">Leader: {team.leaderId?.name}</p>
              <div className="flex gap-3">
                <Link to={`/startups/${team.startupId?._id}/team`} className="flex-1 bg-indigo-50 text-indigo-600 text-center py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">Team Details</Link>
                <Link to={`/teams/${team._id}/chat`} className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2 rounded-lg font-medium hover:border-indigo-500 hover:text-indigo-600 transition-colors">Open Chat</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeams;
