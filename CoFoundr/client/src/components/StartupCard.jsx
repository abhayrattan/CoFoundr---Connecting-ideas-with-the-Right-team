import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import Card from './ui/Card';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StartupCard = ({ startup, onBookmarkUpdate }) => {
  const { user } = useContext(AuthContext);
  const [isBookmarked, setIsBookmarked] = useState(
    user?.savedStartups?.includes(startup._id) || false
  );

  let matchPercentage = null;
  let matchCount = 0;
  
  if (user && startup.requiredSkills && startup.requiredSkills.length > 0) {
    const userSkills = (user.skills || []).map(s => s.toLowerCase());
    const reqSkills = startup.requiredSkills.map(s => s.toLowerCase());
    
    matchCount = reqSkills.filter(s => userSkills.includes(s)).length;
    matchPercentage = Math.round((matchCount / reqSkills.length) * 100);
  }

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (isBookmarked) {
        await api.delete(`/startups/${startup._id}/bookmark`);
        setIsBookmarked(false);
      } else {
        await api.post(`/startups/${startup._id}/bookmark`);
        setIsBookmarked(true);
      }
      if (onBookmarkUpdate) onBookmarkUpdate();
    } catch (err) {
      console.error('Bookmark failed');
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group border-slate-200 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="pr-8">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {startup.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{startup.domain}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {user && (
            <button 
              onClick={handleBookmark} 
              className="absolute top-4 right-4 text-rose-500 hover:scale-110 transition-transform focus:outline-none"
            >
              {isBookmarked ? (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow">
        {startup.description}
      </p>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4 border-t border-slate-100 pt-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>Size: {startup.teamSize}</span>
          </div>
          <Badge variant={startup.status === 'recruiting' ? 'success' : 'default'} className="uppercase tracking-wider text-[10px]">
            {startup.status}
          </Badge>
        </div>

        {/* Skill Match UI */}
        <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
          {!user ? (
            <p className="text-xs text-slate-500 text-center">Login to see skill match</p>
          ) : startup.requiredSkills.length === 0 ? (
             <p className="text-xs text-slate-500 text-center">No specific skills required</p>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-700">Skill Match</span>
                <span className="text-xs font-bold text-indigo-600">{matchPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${matchPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">{matchCount} of {startup.requiredSkills.length} skills match</p>
            </div>
          )}
        </div>

        <Link 
          to={`/startups/${startup._id}`} 
          className="block w-full text-center bg-white hover:bg-indigo-50 text-indigo-600 font-medium py-2 rounded-lg text-sm transition-colors border border-indigo-200 shadow-sm"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default StartupCard;
