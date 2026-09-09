import React from 'react';

const SkillBadge = ({ skill }) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
    {skill}
  </span>
);

export default SkillBadge;
