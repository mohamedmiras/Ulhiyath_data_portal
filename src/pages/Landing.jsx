import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Landing() {
  const navigate = useNavigate();

  const handlePortalSelect = (type) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-warm-white flex flex-col font-inter">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-warm-white -mb-[2px]">
        {/* Responsive Images */}
        <img 
          src="/images/desktop hero section image.png" 
          alt="മസ്ജിദ് ഇമാമുൽ ബുഖാരി" 
          fetchpriority="high"
          loading="eager"
          className="hidden md:block w-full h-full object-cover object-center scale-[1.05] border-0 outline-none brightness-90 contrast-75 saturate-50 blur-[1px]"
        />
        <img 
          src="/images/mobile hero section image.png" 
          alt="മസ്ജിദ് ഇമാമുൽ ബുഖാരി" 
          fetchpriority="high"
          loading="eager"
          className="block md:hidden w-full h-full object-cover object-center scale-[1.05] border-0 outline-none brightness-90 contrast-75 saturate-50 blur-[1px]"
        />
        
        {/* Dark overlay for text readability at the top */}
        <div className="absolute inset-0 bg-olive-900/30 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-olive-900/80 via-olive-900/30 to-transparent pointer-events-none"></div>
        
        {/* Content container - positioned at bottom left just above the white fade */}
        <div className="absolute inset-0 flex flex-col justify-end items-start pb-16 md:pb-24 p-6 md:p-16 z-10">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             className="w-full text-left"
           >
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold font-ayisha text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-[1.1] md:leading-[1.1] tracking-wide">
                a-kvPn-Zv C-am-ap-Â-<br />_p-Jm-cn-
              </h1>
              <p className="mt-2 text-2xl md:text-3xl lg:text-4xl text-yellow-200 font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-manjari">
                ഉള്ഹിയ്യത്ത് കമ്മിറ്റി
              </p>
              
              <p className="mt-2 text-sm md:text-base lg:text-lg text-white/80 font-medium font-manjari">
                മസ്ജിദു ഇമാമിൽ ബുഖാരി (റ), തെക്കേ തറമ്മൽ, കല്ലുമ്പുറം, അയഞ്ചേരി
              </p>
           </motion.div>
        </div>

        {/* Smooth fade to white at the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-warm-white to-transparent pointer-events-none"></div>
      </div>

      {/* Portal Selection Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-gold-200/20 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50" />

        <div className="max-w-4xl w-full text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-manjari font-bold text-olive-900">
            Welcome to the Committee Portal
          </h2>
          <p className="mt-2 text-olive-600">
            Please select your portal to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Individual Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button 
              onClick={() => handlePortalSelect('member')}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-[24px]"
            >
              <Card hover className="h-full bg-gradient-to-br from-white/90 to-warm-white border border-emerald-100/60 p-8 flex flex-col items-center text-center group cursor-pointer transition-all duration-300 shadow-soft hover:shadow-float">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-manjari text-olive-900 group-hover:text-emerald-700 transition-colors">Individual Portal</h3>
                <p className="mt-3 text-olive-600 leading-relaxed">
                  View your contribution records, payment history, and check your pending balances securely.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-emerald-50/50 text-emerald-700 font-semibold text-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  Enter Portal &rarr;
                </div>
              </Card>
            </button>
          </motion.div>

          {/* Admin Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => handlePortalSelect('admin')}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded-[24px]"
            >
              <Card hover className="h-full bg-gradient-to-br from-white/90 to-warm-white border border-gold-100/60 p-8 flex flex-col items-center text-center group cursor-pointer transition-all duration-300 shadow-soft hover:shadow-float">
                <div className="w-20 h-20 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-manjari text-olive-900 group-hover:text-gold-700 transition-colors">Admin Portal</h3>
                <p className="mt-3 text-olive-600 leading-relaxed">
                  Manage all member data, verify payments, bring changes, and track overall committee collections.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-gold-50/50 text-gold-700 font-semibold text-sm border border-gold-100 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                  Enter Portal &rarr;
                </div>
              </Card>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
