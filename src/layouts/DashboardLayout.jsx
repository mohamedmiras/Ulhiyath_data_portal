import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Users, CreditCard, Settings, LogOut, Menu, X, CheckSquare, Sparkles, Bell, ArrowLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  const isAdmin = userData?.role === 'admin';

  const navItems = [
    { name: 'Dashboard', malayalam: 'ഡാഷ്ബോർഡ്', path: '/dashboard', icon: Home, show: true },
    { name: 'My Payments', malayalam: 'എൻ്റെ പേയ്മെന്റുകൾ', path: '/dashboard/payments', icon: CreditCard, show: !isAdmin },
    { name: 'Members', malayalam: 'അംഗങ്ങൾ', path: '/dashboard/admin/members', icon: Users, show: isAdmin },
    { name: 'Verification', malayalam: 'പരിശോധന', path: '/dashboard/admin/verification', icon: CheckSquare, show: isAdmin },
    { name: 'Settings', malayalam: 'സജ്ജീകരണങ്ങൾ', path: '/dashboard/settings', icon: Settings, show: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pageTitle = navItems.find(item => item.path === location.pathname)?.name || 'Dashboard';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-warm-white selection:bg-emerald-200 selection:text-emerald-900 flex flex-col relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-200/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-200/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
        
        {/* Simple Header for Member */}
        <header className="px-4 md:px-8 h-20 flex items-center justify-between glass-header shadow-sm z-10 sticky top-0 backdrop-blur-xl bg-white/70">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-gold-300 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <span className="font-manjari font-bold text-xl relative z-10">ഉ</span>
            </div>
            <div>
              <h1 className="font-malayalam font-bold text-lg text-olive-900 leading-none">ഇമാമുൽ ബുഖാരി</h1>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
             <button
              onClick={() => navigate(location.pathname === '/dashboard/profile' ? '/dashboard' : '/dashboard/profile')}
              className="flex items-center gap-2 px-3 py-2 text-olive-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 rounded-xl transition-colors text-sm font-bold border border-olive-200 shadow-sm"
             >
                {location.pathname === '/dashboard/profile' ? <Home className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {location.pathname === '/dashboard/profile' ? 'Dashboard' : 'My Profile'}
                </span>
             </button>
             <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white rounded-xl transition-colors text-sm font-bold border border-red-100 shadow-sm"
             >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
             </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-5xl mx-auto w-full relative z-0">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex selection:bg-emerald-200 selection:text-emerald-900 bg-warm-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-gradient-to-b from-emerald-700 to-emerald-800 text-white z-20 sticky top-0 h-screen shadow-2xl border-r border-emerald-600/30">
        <div className="p-4 pb-2 relative">
          <Link to="/" className="absolute top-3 right-4 text-emerald-300/50 hover:text-emerald-100 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <Link to="/" className="flex items-center gap-3 group mt-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-50 shadow-inner border border-white/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-emerald-300/50 opacity-80" />
              <span className="font-manjari font-bold text-xl relative z-10">ഉ</span>
            </div>
            <div>
              <h1 className="font-malayalam font-bold text-base text-white leading-tight group-hover:text-emerald-200 transition-colors">മസ്ജിദ് ഇമാമുൽ<br/>ബുഖാരി</h1>
              <p className="text-[10px] text-emerald-300/70 font-medium tracking-wide font-malayalam mt-0.5">ഉള്ഹിയ്യത്ത് കമ്മിറ്റി</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto hide-scrollbar">
          <p className="px-4 text-[10px] font-bold text-emerald-300/50 uppercase tracking-widest mb-1 mt-2">Menu</p>
          {navItems.filter(i => i.show).map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex flex-col px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-white/15 shadow-sm border border-white/20 backdrop-blur-md"
                    : "hover:bg-white/10 border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-emerald-200/70 group-hover:text-white")} />
                  <span className={cn("font-medium transition-colors text-sm", isActive ? "text-white font-bold tracking-wide" : "text-emerald-50/80 group-hover:text-white")} style={{letterSpacing: isActive ? '0.01em' : 'normal'}}>
                    {item.name}
                  </span>
                </div>
                <span className={cn("text-[10px] ml-8 transition-colors text-malayalam relative z-10", isActive ? "text-emerald-200" : "text-emerald-300/40 group-hover:text-emerald-300/60")}>
                  {item.malayalam}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Area */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-center">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center text-emerald-100 font-manjari font-bold shadow-inner shrink-0">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userData?.name || 'User'}</p>
              <p className="text-[9px] font-semibold text-emerald-300 uppercase tracking-wider">{userData?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Sticky Header */}
        <header className={cn(
          "sticky top-0 z-10 transition-all duration-300 px-4 md:px-8 h-16 flex items-center justify-between lg:justify-end",
          scrolled ? "glass-header shadow-sm" : "bg-transparent"
        )}>
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-olive-600 hover:bg-white/50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-manjari font-bold text-lg text-olive-900">{pageTitle}</h1>
          </div>

          {/* Desktop Header Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold border border-red-100 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-olive-200">
               <span className="text-sm font-semibold text-olive-700">{pageTitle}</span>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-olive-900/20 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-gradient-to-b from-emerald-700 to-emerald-800 text-white z-50 shadow-2xl flex flex-col lg:hidden border-r border-emerald-600/30"
              >
                <div className="p-6 pb-2 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-50 font-manjari font-bold shadow-inner border border-white/20">
                      ഉ
                    </div>
                    <span className="font-malayalam font-bold text-white text-sm">ഇമാമുൽ ബുഖാരി</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-emerald-300/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto hide-scrollbar">
                  {navItems.filter(i => i.show).map((item) => {
                    const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex flex-col px-4 py-3 rounded-2xl transition-all",
                          isActive
                            ? "bg-white/15 shadow-sm border border-white/20 backdrop-blur-md"
                            : "hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-emerald-200/70")} />
                          <span className={cn("font-medium text-sm", isActive ? "text-white font-bold tracking-wide" : "text-emerald-50/80")}>{item.name}</span>
                        </div>
                        <span className={cn("text-[10px] ml-8 text-malayalam", isActive ? "text-emerald-200" : "text-emerald-300/40")}>
                          {item.malayalam}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-white/10 bg-transparent">
                   <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-100 font-manjari font-bold">
                      {userData?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{userData?.name || 'User'}</p>
                      <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">{userData?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-emerald-100 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-colors text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 relative">
          {/* Background Decorative Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-200/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-200/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-140px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
