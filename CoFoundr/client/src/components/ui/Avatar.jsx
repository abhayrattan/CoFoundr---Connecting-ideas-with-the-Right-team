import React from 'react';

const Avatar = ({ name = '', size = 'md', className = '' }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
    xl: "h-24 w-24 text-3xl"
  };

  // Generate a consistent color based on string
  const colors = [
    'bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 
    'bg-amber-600', 'bg-purple-600', 'bg-rose-600', 'bg-cyan-600'
  ];
  const colorIndex = name.length > 0 ? name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div className={`inline-flex items-center justify-center rounded-full text-white font-semibold ${bgColor} ${sizes[size]} ${className}`}>
      {getInitials(name) || '?'}
    </div>
  );
};

export default Avatar;
