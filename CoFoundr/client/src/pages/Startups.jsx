import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StartupCard from '../components/StartupCard';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const Startups = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', domain: '', status: '' });

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/startups?${query}`);
      if (res.data.success) {
        setStartups(res.data.startups);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStartups();
  };

  const clearFilters = () => {
    setFilters({ search: '', domain: '', status: '' });
    // setTimeout to allow state update before fetching
    setTimeout(() => {
       const form = document.getElementById('search-form');
       if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Startups</h1>
          <p className="text-slate-500 mt-1">Discover innovative projects and find your perfect team.</p>
        </div>
        <Link to="/startups/create">
          <Button size="lg" className="shadow-sm">Create Startup</Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <form id="search-form" onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search ideas, titles..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
          
          <select 
            name="domain"
            value={filters.domain}
            onChange={handleFilterChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Domains</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="E-commerce">E-commerce</option>
          </select>

          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="recruiting">Recruiting</option>
            <option value="full">Team Full</option>
            <option value="completed">Completed</option>
          </select>

          <Button type="submit" className="shrink-0 shadow-sm px-6">Search</Button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        startups.length === 0 ? (
          <EmptyState 
            icon={<svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            title="No startups found" 
            description="Try changing your search or filters." 
            action={<Button onClick={clearFilters} variant="secondary">Clear Filters</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {startups.map(startup => (
              <StartupCard key={startup._id} startup={startup} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Startups;
