import React from 'react';

const SearchBar = ({ search, setSearch, onSearch }) => (
  <form onSubmit={onSearch} className="flex gap-2">
    <input 
      type="text" 
      value={search} 
      onChange={(e) => setSearch(e.target.value)} 
      placeholder="Search startups..." 
      className="flex-grow px-4 py-2 border border-gray-300 rounded"
    />
    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Search</button>
  </form>
);

export default SearchBar;
