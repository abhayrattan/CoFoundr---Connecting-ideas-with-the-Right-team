import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-premium relative overflow-hidden flex-col justify-center px-12">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-purple-600/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <Link to="/" className="inline-block mb-12">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-white text-2xl border border-white/20 shadow-glow">C</div>
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Connecting Ideas with the Right Team
          </h1>
          <p className="text-lg text-indigo-100/80 mb-12">
            Log in to continue building your startup, managing tasks, and collaborating with top student talent.
          </p>
          
          <div className="glass-dark p-6 rounded-2xl border border-indigo-400/20">
             <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-full"></div>
                <div>
                  <p className="text-white font-semibold">"CoFoundr helped me find the perfect technical co-founder."</p>
                  <p className="text-indigo-200 text-sm">Alex M., Founder of EduTech</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign up for free</Link>
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
