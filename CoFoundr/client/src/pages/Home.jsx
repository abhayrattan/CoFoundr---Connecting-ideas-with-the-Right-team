import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import AnimatedCounter from '../components/ui/AnimatedCounter';

const Home = ({ healthStatus }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ 
    startups: 0, 
    teams: 0, 
    tasks: 0, 
    unread: 0,
    applications: 0,
    saved: 0,
    pendingReqs: 0
  });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const endpoints = ['/startups', '/tasks', '/notifications'];
          if (user.role === 'student') {
            endpoints.push('/join-requests/my');
            endpoints.push('/startups/bookmarked');
          } else {
            // For leaders, we could fetch all their startups' requests, but let's keep it simple
            endpoints.push('/startups'); // dummy to keep index
            endpoints.push('/startups'); 
          }
          
          const results = await Promise.all(endpoints.map(e => api.get(e)));
          
          let myTeamsCount = results[0].data.startups.filter(s => s.createdBy._id === user._id).length;
          
          setStats({
            startups: results[0].data.startups.length,
            teams: myTeamsCount,
            tasks: results[1].data.tasks?.length || 0,
            unread: results[2].data.notifications.filter(n => !n.isRead).length,
            applications: user.role === 'student' ? results[3].data.requests.length : 0,
            saved: user.role === 'student' ? results[4].data.startups.length : 0,
            pendingReqs: 0 // Simplification for leader pending requests 
          });
        } catch (e) {
          console.error('Error fetching dashboard stats');
        }
      };
      fetchStats();
    }
  }, [user]);

  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-2">Here's a quick overview of your CoFoundr activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {user.role === 'student' ? (
            <>
              <Card className="flex items-center p-6 border-l-4 border-indigo-500 shadow-sm">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">My Applications</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.applications}</p>
                </div>
              </Card>
              <Card className="flex items-center p-6 border-l-4 border-purple-500 shadow-sm">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Saved Startups</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.saved}</p>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="flex items-center p-6 border-l-4 border-indigo-500 shadow-sm">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">My Startups</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.teams}</p>
                </div>
              </Card>
              <Card className="flex items-center p-6 border-l-4 border-purple-500 shadow-sm">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Platform Startups</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.startups}</p>
                </div>
              </Card>
            </>
          )}

          <Card className="flex items-center p-6 border-l-4 border-emerald-500 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{stats.tasks}</p>
            </div>
          </Card>
          
          <Card className="flex items-center p-6 border-l-4 border-rose-500 shadow-sm">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unread Alerts</p>
              <p className="text-2xl font-bold text-slate-900">{stats.unread}</p>
            </div>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {user.role === 'leader' && (
            <Link to="/startups/create" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-center">
              <div className="mx-auto w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="font-bold text-slate-900">Create Startup</h3>
              <p className="text-xs text-slate-500 mt-1">Start a new project</p>
            </Link>
          )}

          <Link to="/startups" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-center">
            <div className="mx-auto w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="font-bold text-slate-900">Explore Startups</h3>
            <p className="text-xs text-slate-500 mt-1">Discover opportunities</p>
          </Link>

          <Link to="/tasks" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-center">
            <div className="mx-auto w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="font-bold text-slate-900">View Tasks</h3>
            <p className="text-xs text-slate-500 mt-1">Manage your work</p>
          </Link>

          <Link to="/profile" className="group p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-center">
            <div className="mx-auto w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 className="font-bold text-slate-900">My Profile</h3>
            <p className="text-xs text-slate-500 mt-1">Update your skills</p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-premium relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full glass border-indigo-500/30 text-indigo-200 text-xs font-semibold tracking-wide uppercase mb-6 shadow-glow">
                🚀 Build. Collaborate. Create Impact.
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Connecting Ideas <br className="hidden md:block" />
                with the <span className="text-gradient">Right Team</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                CoFoundr helps students and innovators find the perfect co-founders, build dream teams, and turn ideas into impactful startups.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl transition-all shadow-glow">
                    Get Started for Free &rarr;
                  </button>
                </Link>
                <Link to="/startups" className="w-full sm:w-auto">
                  <button className="w-full glass text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl transition-all border border-slate-600 hover:border-slate-400">
                    Explore Startups
                  </button>
                </Link>
              </div>

              {/* Trust Section */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-white text-xs font-bold z-10">C</div>
                  ))}
                </div>
                <div className="text-sm text-slate-400">
                  <div className="text-amber-400 tracking-widest text-xs mb-0.5">★★★★★</div>
                  Trusted by 1,250+ students
                </div>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main large glowing card */}
                <div className="absolute inset-0 glass-dark rounded-3xl border border-indigo-500/30 shadow-glow-purple transform rotate-3 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 mix-blend-overlay"></div>
                   <div className="text-white/20 p-12 text-center">
                     <svg className="w-32 h-32 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     <p className="text-2xl font-bold opacity-70">Collaborate & Build</p>
                   </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-8 glass-dark px-4 py-3 rounded-xl border border-indigo-400/30 shadow-lg animate-[bounce_6s_ease-in-out_infinite] z-20 flex items-center space-x-3">
                  <div className="bg-amber-400/20 p-2 rounded-lg text-amber-300">💡</div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Smart Skill Match</p>
                    <p className="text-sm text-white font-bold">Find the Perfect Co-Founder</p>
                  </div>
                </div>

                <div className="absolute top-1/4 -right-10 glass-dark px-4 py-3 rounded-xl border border-purple-400/30 shadow-lg animate-[bounce_7s_ease-in-out_infinite_0.5s] z-20 flex items-center space-x-3">
                  <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-300">👥</div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Team Matched</p>
                    <p className="text-sm text-white font-bold">4 Perfect Matches</p>
                  </div>
                </div>

                <div className="absolute bottom-1/4 -left-12 glass-dark px-4 py-3 rounded-xl border border-emerald-400/30 shadow-lg animate-[bounce_8s_ease-in-out_infinite_1s] z-20 flex items-center space-x-3">
                  <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-300">✅</div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Task Completed</p>
                    <p className="text-sm text-white font-bold">Design Landing Page</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 right-0 glass-dark px-4 py-3 rounded-xl border border-blue-400/30 shadow-lg animate-[bounce_6s_ease-in-out_infinite_1.5s] z-20 flex items-center space-x-3">
                  <div className="bg-blue-400/20 p-2 rounded-lg text-blue-300">💬</div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">Message Received</p>
                    <p className="text-sm text-white font-bold">Team: UI/UX Updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-y border-slate-200 py-10 relative z-20 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter endValue="1250" suffix="+" duration={1800} />
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter endValue="350" suffix="+" duration={1800} />
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">Startups Created</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter endValue="980" suffix="+" duration={1800} />
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">Teams Formed</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter endValue="4200" suffix="+" duration={1800} />
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">Tasks Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Why Choose CoFoundr?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Build Together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Find Co-Founders</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Discover students with complementary skills and shared visions to form the perfect startup team.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Build Startups</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Create and manage multiple startup projects in one centralized, professional workspace.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Manage Tasks</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Organize work efficiently with integrated Kanban boards, assignments, and real-time status updates.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Team Chat</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Communicate instantly with your team using real-time WebSockets and smart notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
