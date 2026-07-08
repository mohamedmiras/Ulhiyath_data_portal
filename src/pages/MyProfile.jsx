import React from 'react';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { User, Phone, MapPin, Calendar } from 'lucide-react';

export function MyProfile() {
  const { userData } = useAuth();
  const { users } = useData();
  const memberData = users.find(u => u.id === userData?.id) || userData;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-1">Account</p>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 font-manjari">My Profile</h2>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 md:p-8 border-white/60 bg-white/60 shadow-sm rounded-3xl">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-olive-100/50">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
               <User className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-olive-900">{memberData?.name || 'Member'}</h3>
              <p className="text-olive-500 font-medium">{memberData?.role === 'admin' ? 'Administrator' : 'Committee Member'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-olive-900 mb-4 text-lg">Personal Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 p-4 rounded-2xl border border-olive-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-full bg-olive-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-olive-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-olive-400 uppercase tracking-wider mb-1">Phone / Username</p>
                  <p className="font-medium text-olive-900">{memberData?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-olive-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-full bg-olive-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-olive-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-olive-400 uppercase tracking-wider mb-1">Location / Mahalu</p>
                  <p className="font-medium text-olive-900">{memberData?.location || 'Not provided'}</p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-2xl border border-olive-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-full bg-olive-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-olive-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-olive-400 uppercase tracking-wider mb-1">Join Date</p>
                  <p className="font-medium text-olive-900">{memberData?.joinDate || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gold-50/50 p-4 rounded-xl border border-gold-100 text-sm font-medium text-gold-800 text-center">
              To request a change to your personal details, please contact the Committee Administrator.
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
