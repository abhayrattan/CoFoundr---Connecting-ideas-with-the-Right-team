import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
        <p className="text-slate-500 mb-8 italic">Last updated: August 2026</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-slate-600 mb-4">We collect information you provide directly to us when you create an account, update your profile, or interact with the platform.</p>

        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">Account & Profile Information</h3>
        <p className="text-slate-600 mb-4">This includes your name, email address, password, role (student or leader), bio, skills, experience, and links to your professional portfolios (GitHub, LinkedIn).</p>

        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">Project Information & Messages</h3>
        <p className="text-slate-600 mb-4">We store startup details, task data, team roles, and chat messages generated while using the platform.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. How We Use Information</h2>
        <ul className="list-disc pl-5 text-slate-600 mb-4 space-y-2">
          <li>To match students with relevant startup opportunities using our Skill Match algorithm.</li>
          <li>To facilitate communication and task management within teams.</li>
          <li>To maintain and improve the security and functionality of the CoFoundr platform.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Data Security & Sharing</h2>
        <p className="text-slate-600 mb-4">As an academic project platform, we prioritize securing your data using industry-standard protocols like JWT and bcrypt. We do not sell your personal data to third parties. Information is only shared within your matched startup teams to facilitate collaboration.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. User Choices & Retention</h2>
        <p className="text-slate-600 mb-4">You may update your profile information at any time. Accounts and associated data are retained as long as your account is active. Team leaders have the ability to delete startups, which removes associated join requests and team data.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Contact Information</h2>
        <p className="text-slate-600 mb-4">If you have any questions about this Privacy Policy, please use our Contact Us page.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
