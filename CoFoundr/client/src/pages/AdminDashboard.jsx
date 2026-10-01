import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (err) {
        setError('Failed to load admin data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to change user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm font-semibold">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm font-semibold">Total Startups</h3>
            <p className="text-3xl font-bold">{stats.totalStartups}</p>
          </div>
          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
            <h3 className="text-gray-500 text-sm font-semibold">Startups by Status</h3>
            <div className="flex space-x-4 mt-2">
              {stats.startupsByStatus.map(s => (
                <div key={s._id} className="text-center">
                  <div className="text-xl font-bold">{s.count}</div>
                  <div className="text-xs uppercase text-gray-400">{s._id}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
            <h3 className="text-gray-500 text-sm font-semibold">Most Common Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {stats.commonSkills.map(s => (
                <span key={s._id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {s._id} ({s.count})
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
            <h3 className="text-gray-500 text-sm font-semibold">Signups Over Time (Monthly)</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {stats.signupsOverTime.map(s => (
                <div key={`${s._id.year}-${s._id.month}`} className="text-center">
                  <div className="text-xl font-bold">{s.count}</div>
                  <div className="text-xs text-gray-400">{s._id.month}/{s._id.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Section */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Manage Users</h2>
        </div>
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    className="border rounded p-1 text-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="leader">Leader</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
