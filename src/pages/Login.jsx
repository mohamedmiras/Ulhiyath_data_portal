import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  
  // Removed auto-fill for production

  const navigate = useNavigate();

  const isAdmin = type === 'admin';
  const theme = {
    bg: 'bg-[#FAFAFA]', // Both use white background now
    logo: isAdmin ? 'bg-gradient-to-br from-gold-500 to-gold-700 shadow-gold-500/30' : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30',
    title: 'text-gray-900',
    subtitle: 'text-gray-600',
    card: isAdmin ? 'bg-[#FDF8E8] border-gold-200 shadow-xl' : 'glass',
    label: 'text-gray-700',
    input: isAdmin ? 'bg-white border-gold-200 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:ring-gold-500' : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500',
    link: isAdmin ? 'text-gold-600 hover:text-gold-800' : 'text-emerald-600 hover:text-emerald-500',
    button: isAdmin ? 'bg-gold-600 hover:bg-gold-500 text-white w-full' : 'w-full',
    backBtn: isAdmin ? 'bg-white/80 text-gold-700 border-gold-200 hover:bg-white hover:text-gold-900' : 'bg-white/80 text-olive-700 border-olive-200 hover:bg-white hover:text-emerald-700',
    icon: isAdmin ? 'text-gray-400 hover:text-gold-600' : 'text-gray-400 hover:text-emerald-600',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Incorrect username or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${theme.bg}`}>
      {/* Decorative background elements */}
      {!isAdmin && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/10 blur-[100px]" />
        </>
      )}
      {isAdmin && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-500/10 blur-[100px]" />
        </>
      )}
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm border ${theme.backBtn}`}
        >
          ← Back
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg font-manjari ${theme.logo}`}
        >
          ഉ
        </motion.div>
        
        {isAdmin && (
          <div className="mt-4 flex justify-center">
            <span className="bg-gold-500/20 text-gold-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        )}

        <h2 className={`mt-6 text-center text-3xl font-bold tracking-wide font-ayisha ${theme.title}`}>
          a-kvPn-Zv C-am-ap-Â- _p-Jm-cn-
        </h2>
        <p className={`mt-2 text-center text-sm font-manjari ${theme.subtitle}`}>
          ഉള്ഹിയ്യത്ത് കമ്മിറ്റി
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className={`px-4 py-8 sm:px-10 ${theme.card}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className={`block text-sm font-medium ${theme.label}`}>
                {isAdmin ? 'Username or Email' : 'Username or Phone Number'}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full appearance-none rounded-xl px-3 py-2 shadow-sm focus:outline-none sm:text-sm ${theme.input}`}
                  placeholder={isAdmin ? "Enter your username or email" : "Enter username or phone number"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${theme.label}`}>Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Please contact the Committee Admin to reset your password.'); }} className={`text-sm font-medium ${theme.link}`}>
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full appearance-none rounded-xl pl-3 pr-10 py-2 shadow-sm focus:outline-none sm:text-sm ${theme.input}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme.icon}`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className={isAdmin ? theme.button : "w-full"} 
                isLoading={loading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
