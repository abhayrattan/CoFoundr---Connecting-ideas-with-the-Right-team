import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        if (res.data.success) setTask(res.data.task);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        navigate('/tasks');
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <Loading />;
  if (!task) return <div>Task not found</div>;

  const isAssignee = task.assignedTo && task.assignedTo._id === user._id;
  // Assume creator is leader for simplicity of UI display
  const isLeader = task.createdBy._id === user._id; 

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-8 border rounded shadow">
      <Link to="/tasks" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Tasks</Link>
      
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <div className="flex space-x-2">
          {isLeader && <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded">{task.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
        <div><strong>Assigned To:</strong> {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</div>
        <div><strong>Priority:</strong> {task.priority}</div>
        <div><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</div>
        <div><strong>Status:</strong> {task.status}</div>
      </div>

      {(isAssignee || isLeader) && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Update Status</h3>
          <div className="flex space-x-3">
            <button onClick={() => handleStatusChange('Pending')} className={`px-4 py-2 rounded ${task.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Pending</button>
            <button onClick={() => handleStatusChange('In Progress')} className={`px-4 py-2 rounded ${task.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>In Progress</button>
            <button onClick={() => handleStatusChange('Completed')} className={`px-4 py-2 rounded ${task.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Completed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
