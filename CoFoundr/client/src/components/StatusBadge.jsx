import React from 'react';

const StatusBadge = ({ status }) => {
  let color = 'bg-green-100 text-green-800';
  if (status === 'full') color = 'bg-yellow-100 text-yellow-800';
  if (status === 'completed') color = 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`${color} text-xs font-semibold px-2.5 py-0.5 rounded capitalize`}>
      {status}
    </span>
  );
};

export default StatusBadge;
