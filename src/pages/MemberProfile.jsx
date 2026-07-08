import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Clock, Image as ImageIcon, MapPin, Phone, Calendar, CreditCard, Trash2, ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { users, payments, deletePayment, systemSettings } = useData();
  const [activeTab, setActiveTab] = useState('history');

  const dbUser = users.find(u => u.id === id);

  if (!dbUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-olive-500 font-bold">Loading member profile...</p>
      </div>
    );
  }

  const monthsActive = systemSettings.targetMonths || 19;
  const targetAmount = (dbUser.monthlyAmount || systemSettings.defaultMonthlyAmount || 1000) * monthsActive;
  const due = targetAmount - (dbUser.totalPaid || 0);

  const member = {
    id: dbUser.id,
    name: dbUser.name || 'Unknown',
    phone: dbUser.phone || '',
    location: dbUser.location || '',
    monthlyInstallment: dbUser.monthlyAmount || systemSettings.defaultMonthlyAmount || 1000,
    joinDate: dbUser.joinDate || 'Jan 2026',
    status: due > 0 ? 'Pending' : 'Approved',
    totalPaid: dbUser.totalPaid || 0,
    due: due > 0 ? due : 0,
    notes: dbUser.notes || ''
  };

  const memberPayments = payments.filter(p => p.memberId === id);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard/admin/members')}
          className="p-2 rounded-xl hover:bg-white/60 text-olive-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-0.5">Member Profile</p>
          <h2 className="text-2xl md:text-3xl font-bold text-olive-900 font-manjari">{member.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Member Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="p-6 border-white/60 bg-white/60 shadow-sm rounded-3xl">
            <div className="flex flex-col items-center text-center pb-6 border-b border-olive-100/50">
              <div className="w-20 h-20 rounded-2xl bg-olive-100 flex items-center justify-center text-olive-700 font-bold font-manjari text-3xl mb-4 shadow-inner">
                {member.name.charAt(0)}
              </div>
              <h3 className="font-bold text-xl text-olive-900 mb-1">{member.name}</h3>
              <Badge variant={member.status === 'Approved' ? 'success' : 'warning'} className="mt-2">
                {member.status}
              </Badge>
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-olive-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-olive-500 uppercase">Phone</p>
                  <p className="text-sm font-medium text-olive-900">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-olive-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-olive-500 uppercase">Location</p>
                  <p className="text-sm font-medium text-olive-900">{member.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-olive-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-olive-500 uppercase">Joined</p>
                  <p className="text-sm font-medium text-olive-900">{member.joinDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-olive-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-olive-500 uppercase">Monthly Commitment</p>
                  <p className="text-sm font-medium text-olive-900">₹{member.monthlyInstallment}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-6 border border-white/20 bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md rounded-3xl text-white">
            <h4 className="font-bold mb-4 opacity-90">Account Balance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100 text-sm">Total Paid</span>
                <span className="font-bold text-lg">₹{member.totalPaid}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-emerald-400/30">
                <span className="text-emerald-100 text-sm">Current Due</span>
                <span className="font-bold text-lg">₹{member.due}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Payment History & Screenshots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-0 overflow-hidden border-white/60 bg-white/60 shadow-sm rounded-3xl h-full">
            <div className="p-6 md:p-8 border-b border-olive-100/50">
              <h3 className="font-manjari text-xl font-bold text-olive-900">Payment History</h3>
              <p className="text-sm font-medium text-olive-500 mt-1">Review monthly payments and screenshots</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-8 relative">
                {memberPayments.length === 0 ? (
                  <p className="text-center text-olive-500 py-8 font-medium">No payments recorded yet.</p>
                ) : memberPayments.map((payment, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    key={payment.id} 
                    className="bg-white rounded-2xl border border-olive-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-olive-900 text-lg">{payment.month}</h4>
                          <p className="text-sm font-semibold text-emerald-600">₹{payment.amount}</p>
                        </div>
                        <Badge variant={payment.status === 'Approved' ? 'success' : 'warning'} className="text-[10px]">
                          {payment.status}
                        </Badge>
                      </div>

                      <div className="flex gap-4">
                        {payment.screenshot && (
                          <a href={payment.screenshot} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group/img hover:bg-emerald-50 p-2 rounded-xl transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-olive-50 border border-olive-100 overflow-hidden relative shadow-sm">
                              <img src={payment.screenshot} alt="Receipt" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-emerald-900/0 group-hover/img:bg-emerald-900/10 transition-colors flex items-center justify-center">
                                <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover/img:opacity-100" />
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Receipt</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 pl-4 border-l border-olive-100/50">
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] text-olive-400 font-bold uppercase tracking-wider">Paid on</p>
                        <p className="text-sm text-olive-800 font-medium">{payment.date}</p>
                        <p className="text-xs text-olive-500">{payment.time}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => deletePayment(payment.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors" title="Delete Payment">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-full transition-colors hidden sm:block" title="Download Details">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
