import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ErrorComponent from '../components/Error';
import { AuthContext } from '../context/AuthContext';

const CreateTask = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [myStartups, setMyStartups] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: ''
  });

  useEffect(() => {
    const init = async () => {
      try {
        const r = await api.get('/startups');
        const startups = r.data.startups.filter(s => s.createdBy._id === user._id);
        setMyStartups(startups);
        if (startups.length > 0) {
          fetchTeam(startups[0]._id);
        }
      } catch(e) {
        console.error(e);
      }
    }
    if (user) init();
  }, [user]);

  const fetchTeam = async (startupId) => {
    try {
      const tRes = await api.get(`/startups/${startupId}/team`);
      setSelectedTeam(tRes.data.team);
      setTeamMembers(tRes.data.team.members);
    } catch(e) {
      console.error(e);
    }
  };

  const handleStartupChange = (e) => {
    fetchTeam(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        ...formData,
        teamId: selectedTeam._id,
        startupId: selectedTeam.startupId
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  if (myStartups.length === 0) return <div className="text-center mt-10">You do not lead any startups to create tasks for.</div>;
  if (!selectedTeam) return <div className="text-center mt-10">Loading team...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create Task</h2>
      {error && <div className="mb-4"><ErrorComponent message={error} /></div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Select Startup</label>
          <select onChange={handleStartupChange} className="w-full border rounded px-3 py-2">
            {myStartups.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Assign To</label>
          <select value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="w-full border rounded px-3 py-2">
            <option value="">Unassigned</option>
            {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Priority</label>
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full border rounded px-3 py-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateTask;
