import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchTasks = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.status) query.append('status', filters.status);
      if (filters.priority) query.append('priority', filters.priority);
      
      const res = await api.get(`/tasks?${query.toString()}`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  if (loading) return <LoadingSpinner fullScreen />;

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const completionPercentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  const priorityColors = {
    Low: 'bg-slate-100 text-slate-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-rose-100 text-rose-700'
  };

  const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow mb-3">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-[10px] text-slate-400">
            {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{task.title}</h4>
      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-3">
        <div className="flex items-center space-x-2">
          {task.assignedTo ? (
            <>
              <Avatar name={task.assignedTo.name} size="sm" />
              <span className="text-xs text-slate-600 font-medium">{task.assignedTo.name.split(' ')[0]}</span>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">Unassigned</span>
          )}
        </div>
        <Link to={`/tasks/${task._id}`} className="text-indigo-600 hover:text-indigo-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Board</h1>
          <div className="flex items-center mt-1 space-x-4 text-sm text-slate-500">
            <span>{total} Total Tasks</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-emerald-600 font-medium">{completionPercentage}% Completed</span>
          </div>
        </div>
        <Link to="/tasks/create">
          <Button>Create Task</Button>
        </Link>
      </div>

      <div className="bg-white p-3 rounded-lg border border-slate-200 mb-6 flex gap-3 w-fit">
        <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="text-sm border-none bg-slate-50 rounded px-3 py-1.5 focus:ring-0 text-slate-700">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} className="text-sm border-none bg-slate-50 rounded px-3 py-1.5 focus:ring-0 text-slate-700">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {tasks.length === 0 && !filters.status && !filters.priority ? (
        <div className="mt-10">
          <EmptyState 
            icon="📋" 
            title="No tasks yet" 
            description="Create a task to start organizing your team's work." 
            action={<Link to="/tasks/create"><Button>Create Task</Button></Link>}
          />
        </div>
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-4">
          {/* Pending Column */}
          <div className="flex flex-col bg-slate-100/50 rounded-xl p-4 border border-slate-200/60 max-h-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-slate-700 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-2"></span>
                To Do
              </h3>
              <Badge variant="default">{pendingCount}</Badge>
            </div>
            <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
              {pendingTasks.map(t => <TaskCard key={t._id} task={t} />)}
              {pendingTasks.length === 0 && <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">No tasks</div>}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col bg-indigo-50/30 rounded-xl p-4 border border-indigo-100 max-h-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-indigo-900 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                In Progress
              </h3>
              <Badge variant="primary" className="bg-indigo-100">{inProgressCount}</Badge>
            </div>
            <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
              {inProgressTasks.map(t => <TaskCard key={t._id} task={t} />)}
              {inProgressTasks.length === 0 && <div className="text-center p-4 border-2 border-dashed border-indigo-100 rounded-xl text-indigo-300 text-sm">No tasks</div>}
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 max-h-full">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-emerald-900 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                Completed
              </h3>
              <Badge variant="success" className="bg-emerald-100">{completedCount}</Badge>
            </div>
            <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
              {completedTasks.map(t => <TaskCard key={t._id} task={t} />)}
              {completedTasks.length === 0 && <div className="text-center p-4 border-2 border-dashed border-emerald-100 rounded-xl text-emerald-300 text-sm">No tasks</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

