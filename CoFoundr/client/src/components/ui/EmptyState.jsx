import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EmptyState = ({ icon, title, description, action, actionText, actionLink, onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
      {icon && (
        <div className="mb-6 bg-indigo-50/50 p-4 rounded-full border border-indigo-100">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed text-sm">{description}</p>
      
      {action && <div>{action}</div>}
      
      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button size="lg" className="shadow-sm">{actionText}</Button>
        </Link>
      )}
      
      {actionText && onActionClick && !actionLink && (
        <Button size="lg" className="shadow-sm" onClick={onActionClick}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
