import React from 'react';

const FilterPanel = ({ filters, setFilters, onApply }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 p-4 rounded border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Domain</label>
        <input type="text" name="domain" value={filters.domain} onChange={handleChange} className="px-3 py-2 border rounded w-full" placeholder="e.g. EdTech" />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Skills (comma separated)</label>
        <input type="text" name="skills" value={filters.skills} onChange={handleChange} className="px-3 py-2 border rounded w-full" placeholder="e.g. React, Node" />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Status</label>
        <select name="status" value={filters.status} onChange={handleChange} className="px-3 py-2 border rounded w-full">
          <option value="">All</option>
          <option value="recruiting">Recruiting</option>
          <option value="full">Full</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button onClick={onApply} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 h-10">Apply Filters</button>
    </div>
  );
};

export default FilterPanel;
