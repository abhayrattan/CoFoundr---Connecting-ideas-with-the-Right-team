import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';

const SKILLS_LIST = [
  "Java", "JavaScript", "React", "Node.js", "Express.js", 
  "MongoDB", "Python", "C++", "AI/ML", "UI/UX", 
  "Figma", "Marketing", "Business", "Content Writing", 
  "Finance", "Product Management", "Cybersecurity", "Cloud", "DevOps"
];

const Onboarding = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 8) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleSave = async () => {
    if (selectedSkills.length < 5) return;
    setLoading(true);
    try {
      const res = await api.put('/users/profile', {
        skills: selectedSkills,
        onboardingCompleted: true
      });
      if (res.data.success) {
        setUser({ ...user, onboardingCompleted: true });
        navigate('/');
      }
    } catch (err) {
      console.error('Onboarding failed', err);
    }
    setLoading(false);
  };

  const isValid = selectedSkills.length >= 5 && selectedSkills.length <= 8;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Let's build your profile</h1>
        <p className="text-slate-500 mt-3 text-lg">Choose 5–8 skills that represent what you can contribute to a startup.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {SKILLS_LIST.map(skill => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'} border`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6">
          <p className="text-sm font-semibold text-slate-500 mb-4 sm:mb-0">
            <span className={isValid ? 'text-emerald-600' : 'text-indigo-600'}>{selectedSkills.length}</span> / 8 selected
          </p>
          <Button onClick={handleSave} disabled={!isValid} isLoading={loading} size="lg">
            Save Profile & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
