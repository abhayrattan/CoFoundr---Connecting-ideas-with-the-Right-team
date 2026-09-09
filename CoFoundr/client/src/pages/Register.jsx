import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right side visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-premium relative overflow-hidden flex-col justify-center px-12">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-purple-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <Link to="/" className="inline-block mb-12">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white text-2xl border border-white/20 shadow-glow-purple">C</div>
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Start Your Journey Today
          </h1>
          <p className="text-lg text-indigo-100/80 mb-12">
            Join 1,250+ students already building the next generation of innovative startups.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="glass-dark p-4 rounded-xl border border-indigo-400/20">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-bold text-white text-sm">Launch Startups</h3>
             </div>
             <div className="glass-dark p-4 rounded-xl border border-purple-400/20">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-bold text-white text-sm">Find Co-Founders</h3>
             </div>
          </div>
        </div>
      </div>

      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 bg-white">
        <div className="w-full max-w-md py-12">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in here</Link>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100 flex items-start">
                <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            <div className="space-y-5">
              <Input 
                label="Full Name"
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="John Doe"
              />
              <Input 
                label="Email address"
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="you@university.edu"
              />
              <Input 
                label="Password"
                type="password" 
                required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="••••••••"
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">I want to join as a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-xl p-3 cursor-pointer transition-all ${formData.role === 'student' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={() => setFormData({...formData, role: 'student'})} className="sr-only" />
                    <span className="block text-sm font-bold text-slate-900">Student</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Looking for teams</span>
                  </label>
                  <label className={`border rounded-xl p-3 cursor-pointer transition-all ${formData.role === 'leader' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <input type="radio" name="role" value="leader" checked={formData.role === 'leader'} onChange={() => setFormData({...formData, role: 'leader'})} className="sr-only" />
                    <span className="block text-sm font-bold text-slate-900">Leader</span>
                    <span className="block text-xs text-slate-500 mt-0.5">Creating a startup</span>
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Create Account
            </Button>
            
            <p className="text-xs text-center text-slate-500 mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
