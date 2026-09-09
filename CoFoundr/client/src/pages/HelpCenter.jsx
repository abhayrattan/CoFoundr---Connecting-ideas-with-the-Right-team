import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const faqs = [
    { q: "How do I create a startup?", a: "Go to your Dashboard (as a leader) and click 'Create Startup'. Fill in your project details, required skills, and team size." },
    { q: "How do I join a team?", a: "Browse the Startups page, find a project that matches your skills, and click 'Join Team'. The leader will review your application." },
    { q: "How is Skill Match calculated?", a: "Skill match compares the skills listed in your profile against the required skills of a startup, showing you a direct percentage match." },
    { q: "How do I track my applications?", a: "Students can track all their join requests in the 'My Applications' tab on their dashboard." },
    { q: "How do I save a startup?", a: "Click the heart icon on any startup card to bookmark it. View your saved startups in the 'Saved Startups' tab." },
    { q: "How do I update my profile?", a: "Navigate to 'My Profile' from the sidebar or dashboard and click 'Edit Profile' to add new skills and experience." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">How can we help?</h1>
        <p className="text-xl text-slate-500">Find answers and guidance for using CoFoundr.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-500">
        Still need help? <Link to="/contact" className="text-indigo-600 font-medium hover:underline">Contact us</Link>
      </div>
    </div>
  );
};

export default HelpCenter;
