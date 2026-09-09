import React from 'react';

const CommunityGuidelines = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8">Community Guidelines</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 rounded-r-lg">
          <p className="text-indigo-800 font-medium m-0">CoFoundr is designed to help students and innovators collaborate professionally. These guidelines help maintain a safe and productive environment for everyone.</p>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Respect Other Members</h2>
        <p className="text-slate-600 mb-4">Treat all users with respect. We are a diverse community of students with different skill levels and backgrounds. Constructive feedback is encouraged; hostile behavior is not.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Professional Communication</h2>
        <p className="text-slate-600 mb-4">Keep team chat and task discussions focused, clear, and professional. Avoid spamming messages or pinging team members unnecessarily.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">No Fake Profiles or Spam</h2>
        <p className="text-slate-600 mb-4">Create genuine profiles that accurately represent your skills. Do not use CoFoundr to spam users, promote unrelated products, or scrape data.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Respect Intellectual Property</h2>
        <p className="text-slate-600 mb-4">Do not steal ideas, code, or assets from other startups on the platform. When collaborating, establish clear agreements with your team regarding ownership of the project.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Reporting Problems</h2>
        <p className="text-slate-600 mb-4">If you experience harassment, discover a fake profile, or encounter behavior that violates these guidelines, please use the Contact Us page to report the issue to the platform administrators.</p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
