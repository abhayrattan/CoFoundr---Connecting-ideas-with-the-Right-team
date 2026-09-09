import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8">Terms of Service</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
        <p className="text-slate-500 mb-8 italic">Last updated: August 2026</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-slate-600 mb-4">By accessing or using CoFoundr, you agree to be bound by these Terms of Service. This platform is designed as an academic and collaborative tool for students and innovators.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. User Accounts & Responsibilities</h2>
        <p className="text-slate-600 mb-4">You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Startup Content & Team Collaboration</h2>
        <p className="text-slate-600 mb-4">Users creating startups ("Leaders") are responsible for the content and management of their projects. All team members must collaborate professionally. CoFoundr does not claim ownership over the intellectual property created within these startups.</p>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Prohibited Activities</h2>
        <ul className="list-disc pl-5 text-slate-600 mb-4 space-y-2">
          <li>Harassing, abusing, or harming another person or group.</li>
          <li>Impersonating any person or entity.</li>
          <li>Using the platform for any illegal or unauthorized purpose.</li>
          <li>Spamming or posting malicious links/files in team chat.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. Disclaimer & Account Termination</h2>
        <p className="text-slate-600 mb-4">CoFoundr is provided "as is" without warranties of any kind. We reserve the right to suspend or terminate accounts that violate these Terms or Community Guidelines at any time without notice.</p>
        
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Changes to Terms</h2>
        <p className="text-slate-600 mb-4">We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
