import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { CheckCircle2, Eye, EyeOff, Save } from 'lucide-react';

export function Settings() {
  const { userData, changeAuthPassword } = useAuth();
  const { users: mockUsers, updateUserPasswordInDB: updateUserPassword, systemSettings, updateSystemSettings } = useData();
  const isAdmin = userData?.role === 'admin';

  const [localSettings, setLocalSettings] = useState({
    defaultMonthlyAmount: systemSettings?.defaultMonthlyAmount || 1000,
    targetMonths: systemSettings?.targetMonths || 19
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Admin Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showMyPassword, setShowMyPassword] = useState(false);
  
  const adminData = mockUsers.find(u => u.id === userData?.id);
  const myPassword = adminData?.password || 'Not Set';

  // For Admin viewing member passwords
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const handleSettingsSave = () => {
    updateSystemSettings({
      defaultMonthlyAmount: Number(localSettings.defaultMonthlyAmount),
      targetMonths: Number(localSettings.targetMonths)
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handlePasswordChange = async () => {
    if (newPassword && newPassword === confirmPassword) {
      try {
        await changeAuthPassword(newPassword); // Update actual Auth backend
        await updateUserPassword(userData.id, newPassword); // Update DB record
        setPasswordSaved(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSaved(false), 3000);
      } catch (err) {
        console.error("Failed to change password", err);
        alert(err.message || "Failed to change password. You may need to sign out and sign back in first.");
      }
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-1">Preferences</p>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 font-manjari">Settings</h2>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* General Adjustments - Admin Only */}
          {isAdmin && (
          <Card className="p-6 md:p-8 border-white/60 bg-white/60 shadow-sm rounded-3xl">
            <h3 className="font-manjari text-xl font-bold text-olive-900 mb-2">System Adjustments</h3>
            <p className="text-sm font-medium text-olive-500 mb-6">Set the default monthly collection amount and other globals.</p>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-olive-700 mb-2">Default Monthly Amount (₹)</label>
                  <input 
                    type="number" 
                    value={localSettings.defaultMonthlyAmount}
                    onChange={(e) => setLocalSettings({...localSettings, defaultMonthlyAmount: e.target.value})}
                    className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-olive-700 mb-2">Target Duration (Months)</label>
                  <input 
                    type="number" 
                    value={localSettings.targetMonths}
                    onChange={(e) => setLocalSettings({...localSettings, targetMonths: e.target.value})}
                    className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-olive-100/50 flex items-center gap-4">
                <Button onClick={handleSettingsSave} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md">
                  Save Adjustments
                </Button>
                {settingsSaved && <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Saved!</span>}
              </div>
            </div>
          </Card>
          )}

          {/* Admin Security - Admin Only */}
          {isAdmin && (
          <Card className="p-6 md:p-8 border-white/60 bg-white/60 shadow-sm rounded-3xl">
            <h3 className="font-manjari text-xl font-bold text-olive-900 mb-2">Admin Security</h3>
            <p className="text-sm font-medium text-olive-500 mb-6">Update your administrator password.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-olive-700 mb-2">Your Current Password</label>
                <div className="relative">
                  <input 
                    type={showMyPassword ? "text" : "password"} 
                    value={myPassword}
                    readOnly
                    className="block w-full rounded-xl border border-olive-200 bg-olive-50/50 px-4 py-3 text-olive-500 font-medium outline-none" 
                  />
                  <button
                    onClick={() => setShowMyPassword(!showMyPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-olive-400 hover:text-emerald-600"
                  >
                    {showMyPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-olive-100/50">
                <label className="block text-sm font-bold text-olive-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-olive-700 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                />
              </div>
              
              <div className="pt-4 border-t border-olive-100/50 flex items-center gap-4">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!newPassword || newPassword !== confirmPassword}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  Change Password
                </Button>
                {passwordSaved && <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Saved!</span>}
              </div>
            </div>
          </Card>
          )}

          {/* Member Credentials - Admin Only */}
          {isAdmin && (
            <Card className="p-6 md:p-8 border-white/60 bg-white/60 shadow-sm rounded-3xl lg:col-span-2">
              <h3 className="font-manjari text-xl font-bold text-olive-900 mb-2">Member Credentials</h3>
              <p className="text-sm font-medium text-olive-500 mb-6">Manage and view passwords for all registered members.</p>
              
              <div className="space-y-4">
                {mockUsers.map(user => (
                  <div key={user.id} className="bg-white/80 border border-olive-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-olive-900">{user.name}</p>
                      <p className="text-xs text-olive-500 font-medium">{user.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type={visiblePasswords[user.id] ? "text" : "password"}
                          value={user.password || (user.phone ? user.phone.replace(/\D/g, '').slice(-10) : 'Not Set')}
                          readOnly
                          className="w-48 bg-olive-50/50 border border-olive-200 rounded-lg pl-3 pr-10 py-2 text-sm font-medium outline-none text-olive-500"
                        />
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-olive-400 hover:text-emerald-600"
                        >
                          {visiblePasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      </motion.div>
    </div>
  );
}
