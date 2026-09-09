import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JoinRequestCard from '../components/JoinRequestCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/join-requests/my');
        if (res.data.success) {
          setRequests(res.data.requests);
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchRequests();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Applications</h1>
      <p className="text-slate-500 mb-8 text-sm">Track the status of your startup join requests.</p>

      <div className="space-y-4">
        {requests.length > 0 ? requests.map(req => (
          <JoinRequestCard key={req._id} request={req} isOwner={false} />
        )) : (
          <EmptyState 
            icon={<svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            title="No applications yet" 
            description="Explore startups and find a team that matches your skills." 
            actionText="Explore Startups"
            actionLink="/startups"
          />
        )}
      </div>
    </div>
  );
};

export default MyRequests;
