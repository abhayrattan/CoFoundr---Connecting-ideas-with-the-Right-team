import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const Chat = () => {
  const { teamId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const [chatRes, teamRes] = await Promise.all([
          api.get(`/chat/${teamId}`),
          api.get(`/teams/${teamId}`).catch(() => ({ data: { team: null } }))
        ]);
        
        if (chatRes.data.success) {
          setMessages(chatRes.data.messages);
        }
        
        if (teamRes && teamRes.data && teamRes.data.team) {
          setTeamDetails(teamRes.data.team);
          setTeamMembers(teamRes.data.team.members || []);
        } else {
          // If we can't fetch the team directly (due to routing missing), try to derive members from messages
          const uniqueSenders = new Map();
          chatRes.data.messages.forEach(m => {
            if (!uniqueSenders.has(m.senderId._id)) {
              uniqueSenders.set(m.senderId._id, m.senderId);
            }
          });
          setTeamMembers(Array.from(uniqueSenders.values()));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    initChat();

    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinTeamRoom', teamId);
    });

    newSocket.on('receiveMessage', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [teamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    socket.emit('sendMessage', { teamId, content: newMessage });
    setNewMessage('');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const groupMessages = () => {
    let grouped = [];
    messages.forEach(msg => {
      if (grouped.length === 0) {
        grouped.push({ ...msg, isSequence: false });
      } else {
        const lastMsg = grouped[grouped.length - 1];
        const isSameSender = lastMsg.senderId._id === msg.senderId._id;
        const timeDiff = new Date(msg.createdAt) - new Date(lastMsg.createdAt);
        const isSameTimeBlock = timeDiff < 60000 * 5;

        if (isSameSender && isSameTimeBlock) {
          grouped.push({ ...msg, isSequence: true });
        } else {
          grouped.push({ ...msg, isSequence: false });
        }
      }
    });
    return grouped;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* LEFT: Team Information Sidebar */}
      <div className="w-72 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col flex-shrink-0">
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <h2 className="font-bold text-slate-800">Team Details</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Members ({teamMembers.length})</h3>
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member._id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar name={member.name} size="sm" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 leading-tight">{member.name}</p>
                    {member._id === user._id && <span className="text-[10px] text-slate-500">You</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
             <Link to="/tasks">
               <button className="w-full bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 text-sm font-medium py-2 rounded-lg transition-colors shadow-sm">
                 View Team Tasks
               </button>
             </Link>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <div className="h-16 border-b border-slate-200 flex items-center px-6 bg-white shrink-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xl">
              #
            </div>
            <div>
              <h2 className="font-bold text-slate-800">General Chat</h2>
              <p className="text-xs text-slate-500">Real-time collaboration</p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 bg-slate-50/50 flex flex-col">
          {messages.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-lg font-bold text-slate-800 mb-1">No messages yet</p><p className="text-sm">Start the conversation with your team.</p>
            </div>
          )}
          
          <div className="space-y-1 mt-auto">
            {groupMessages().map((m, i) => {
              const isMine = m.senderId._id === user._id;
              
              if (m.isSequence) {
                return (
                  <div key={m._id || i} className={`flex px-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2 text-[15px] leading-relaxed transition-all ${isMine ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-sm ml-12' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm mr-12'}`}>
                      {m.content}
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={m._id || i} className={`flex mt-6 px-4 animate-[fadeIn_0.3s_ease-out] ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && (
                    <div className="flex-shrink-0 mr-3 mt-auto mb-1">
                      <Avatar name={m.senderId.name} size="sm" className="shadow-sm" />
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline space-x-2 mb-1 px-1">
                      <span className="text-sm font-bold text-slate-700">{isMine ? 'You' : m.senderId.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`px-4 py-2.5 text-[15px] leading-relaxed shadow-sm transition-all ${isMine ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
        
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 z-10">
          <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Message your team..." 
              className="w-full pl-4 pr-16 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-[15px]"
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

