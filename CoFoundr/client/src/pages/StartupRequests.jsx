import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import JoinRequestCard from '../components/JoinRequestCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const StartupRequests = () => {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/startups/${id}/join-requests`);
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await api.put(`/join-requests/${requestId}`, { status });
      fetchRequests(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={`/startups/${id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Startup
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Applicants</h1>
      <p className="text-slate-500 mb-8">Review and manage users who want to join your team.</p>
      
      <div>
        {requests.length > 0 ? requests.map(req => (
          <JoinRequestCard 
            key={req._id} 
            request={req} 
            isOwner={true} 
            onAccept={(reqId) => handleStatusUpdate(reqId, 'accepted')} 
            onReject={(reqId) => handleStatusUpdate(reqId, 'rejected')} 
          />
        )) : (
          <EmptyState 
            icon="👥" 
            title="No applicants yet" 
            description="When users request to join your startup, they will appear here." 
          />
        )}
      </div>
    </div>
  );
};

export default StartupRequests;

