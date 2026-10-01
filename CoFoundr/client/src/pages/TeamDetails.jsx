import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const TeamDetails = () => {
  const { id } = useParams(); // startupId
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigningRole, setAssigningRole] = useState(null);
  const [roleInput, setRoleInput] = useState('');

  const fetchTeam = async () => {
    try {
      const res = await api.get(`/startups/${id}/team`);
      if (res.data.success) {
        setTeam(res.data.team);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const handleAssignRole = async (userId) => {
    try {
      await api.put(`/teams/${team._id}/roles`, { userId, role: roleInput });
      setAssigningRole(null);
      setRoleInput('');
      fetchTeam();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign role');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!team) return <div className="text-center mt-20 text-slate-500">Team not found</div>;

  const isLeader = user && team.leaderId._id === user._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={`/startups/${id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Startup
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Team Workspace
          </h1>
          <div className="flex items-center mt-2 text-sm text-slate-500 space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {team.members.length} Members
            </span>
            <span className="flex items-center text-indigo-600 font-medium">
              Leader: {team.leaderId.name}
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link to={`/teams/${team._id}/chat`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto shadow-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              Open Team Chat
            </Button>
          </Link>
          <Link to="/tasks" className="w-full sm:w-auto">
             <Button variant="secondary" className="w-full sm:w-auto flex items-center justify-center gap-2">
                Tasks
             </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.members.map(member => {
          const roleObj = team.teamRoles.find(r => r.user._id === member._id);
          const role = roleObj ? roleObj.role : 'Member';
          const isLeaderMember = member._id === team.leaderId._id;
          
          return (
            <Card key={member._id} className="flex flex-col relative group transition-all hover:shadow-md border-slate-200">
              {isLeaderMember && (
                <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center shadow-sm">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  LEADER
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <Avatar name={member.name} size="lg" className="ring-4 ring-slate-50" />
                <div>
                  <Link to={`/profile/${member._id}`} className="hover:underline text-indigo-600">
                    <h3 className="font-bold text-lg leading-tight">{member.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mb-1">{member.email}</p>
                  <Badge variant="purple" className="mt-1 text-[10px]">{role}</Badge>
                </div>
              </div>
              
              <div className="flex-grow">
                {member.skills && member.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">+{member.skills.length - 4}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills listed</p>
                )}
              </div>
              
              {isLeader && !isLeaderMember && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {assigningRole === member._id ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={roleInput} 
                        onChange={(e) => setRoleInput(e.target.value)} 
                        placeholder="e.g. Backend Dev" 
                        className="text-xs px-2 py-1.5 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none w-full"
                        autoFocus
                      />
                      <button onClick={() => handleAssignRole(member._id)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded transition-colors" title="Save">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button onClick={() => setAssigningRole(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-1.5 rounded transition-colors" title="Cancel">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setAssigningRole(member._id); setRoleInput(role); }} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center transition-colors">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Change Role
                    </button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDetails;
