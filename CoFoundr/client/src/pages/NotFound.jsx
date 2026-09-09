import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center font-extrabold text-4xl mb-6 shadow-sm border border-slate-200 transform rotate-12">
        404
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Oops! Page not found.</h1>
      <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto">
        The page you're looking for doesn't exist or may have moved. Let's get you back on track.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto px-8">Back to Home</Button>
        </Link>
        <Link to="/startups">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">Explore Startups</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
