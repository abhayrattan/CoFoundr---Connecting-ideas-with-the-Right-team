import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/startups/${id}`);
        if (res.data.success) {
          setStartup(res.data.startup);
        }
        
        // Fetch team members if we can
        try {
          const teamRes = await api.get(`/startups/${id}/team`);
          if (teamRes.data.success) {
            setTeamMembers(teamRes.data.team.members || []);
          }
        } catch(e) {
          // It's okay if we can't fetch team members yet (e.g. not a member/leader)
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/startups/${id}/join`, { message: joinMessage });
      setRequestSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this startup?')) {
      try {
        await api.delete(`/startups/${id}`);
        navigate('/my-startups');
      } catch(err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!startup) return <div className="text-center mt-20 text-slate-500">Startup not found</div>;

  const isOwner = user && startup.createdBy?._id === user._id;
  const isMember = teamMembers.some(m => m._id === user?._id);
  
  const statusColors = {
    recruiting: 'success',
    full: 'warning',
    completed: 'primary'
  };

  const openPositions = Math.max(0, startup.teamSize - (teamMembers.length || 1));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/startups" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Startups
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-premium rounded-3xl p-8 md:p-10 text-white shadow-glow-purple mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="relative z-10">
           <div className="flex flex-wrap items-center gap-3 mb-4">
             <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30 backdrop-blur-md font-bold uppercase tracking-wider text-[10px]">{startup.domain}</Badge>
             <Badge variant={statusColors[startup.status]} className="uppercase tracking-wider text-[10px] font-bold shadow-sm">{startup.status}</Badge>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{startup.title}</h1>
           
           <div className="flex flex-wrap items-center gap-6 text-sm text-indigo-100/80">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Founded by {startup.createdBy?.name || 'Unknown'}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date(startup.createdAt).toLocaleDateString()}
              </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left, 2 columns wide) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center border-b border-slate-100 pb-3">
              <span className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
              About the Startup
            </h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px]">{startup.description}</p>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center border-b border-slate-100 pb-3">
              <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></span>
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {startup.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="default" className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 font-medium border-slate-200 shadow-sm">{skill}</Badge>
              ))}
            </div>
          </Card>

          {(isOwner || isMember) && teamMembers.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center border-b border-slate-100 pb-3">
                <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></span>
                Team Members
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {teamMembers.map(member => (
                   <div key={member._id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <Avatar name={member.name} size="md" />
                     <div>
                       <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                       <p className="text-[11px] text-slate-500">{member._id === startup.createdBy?._id ? 'Founder' : 'Member'}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar (Action Card) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-md border-t-4 border-t-indigo-500 sticky top-24">
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Target Size</p>
                 <p className="text-2xl font-extrabold text-slate-900">{startup.teamSize}</p>
               </div>
               <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
                 <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">Open Roles</p>
                 <p className="text-2xl font-extrabold text-indigo-700">{openPositions}</p>
               </div>
            </div>

            {isOwner ? (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link to={`/startups/${id}/edit`}>
                  <Button className="w-full mb-3" variant="secondary">Edit Startup Details</Button>
                </Link>
                <Link to={`/startups/${id}/requests`}>
                  <Button className="w-full mb-3 shadow-sm">Manage Applications</Button>
                </Link>
                <Link to={`/teams/${id}`}>
                  <Button className="w-full mb-3 bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200">Open Team Workspace</Button>
                </Link>
                <Button className="w-full text-rose-600 bg-rose-50 hover:bg-rose-100 border-none" onClick={handleDelete}>Delete Startup</Button>
              </div>
            ) : isMember ? (
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-semibold mb-4 border border-emerald-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  You are a member of this startup
                </div>
                <Link to={`/teams/${id}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200" size="lg">Open Team Workspace</Button>
                </Link>
              </div>
            ) : requestSent ? (
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl text-sm font-semibold border border-indigo-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                  Application pending review
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Interested in joining?</h4>
                <form onSubmit={handleJoin} className="space-y-4">
                  <textarea 
                    value={joinMessage} 
                    onChange={e => setJoinMessage(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none bg-slate-50"
                    placeholder="Tell the founder why you're a great fit..."
                    rows="3"
                  ></textarea>
                  <Button type="submit" className="w-full" size="lg">Submit Application</Button>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
