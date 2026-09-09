import React from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

const JoinRequestCard = ({ request, isOwner, onAccept, onReject }) => {
  const statusColors = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger'
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow border-slate-200">
      {isOwner ? (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-grow">
            <Avatar name={request.userId.name} size="md" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-900">{request.userId.name}</h4>
                <Badge variant={statusColors[request.status]} className="text-[10px] uppercase tracking-wider">{request.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3">{request.userId.email}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
                <p className="text-sm text-slate-700 italic relative z-10">"{request.message}"</p>
              </div>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <Button variant="success" size="sm" onClick={() => onAccept(request._id)} className="w-full">
                Accept
              </Button>
              <Button variant="danger" size="sm" onClick={() => onReject(request._id)} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border-none hover:text-rose-700">
                Reject
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                {request.startupId.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">
                  <Link to={`/startups/${request.startupId._id}`} className="hover:text-indigo-600 hover:underline transition-colors">{request.startupId.title}</Link>
                </h4>
                <span className="text-xs text-indigo-600 font-medium">{request.startupId.domain}</span>
              </div>
            </div>
            <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1 font-medium">Your Message:</p>
              <p className="text-sm text-slate-700">{request.message}</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end">
            <Badge variant={statusColors[request.status]} className="px-3 py-1 uppercase tracking-wider">{request.status}</Badge>
            <span className="text-[10px] text-slate-400 mt-2">Applied: {new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default JoinRequestCard;
