import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ExternalLink, CheckCircle2, XCircle, AlertCircle, Calendar, Clock, CreditCard, Receipt } from 'lucide-react';

export function AdminVerification() {
  const { payments, updatePaymentStatus, approveAll, users } = useData();
  
  // Only show payments that are pending verification
  const pendingPayments = payments.filter(p => p.status === 'Pending Verification');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-manjari text-3xl font-bold text-olive-900">Verification</h2>
          <p className="text-olive-500 font-medium mt-1">Review and approve pending member payments.</p>
        </div>
        
        {pendingPayments.length > 0 && (
          <Button onClick={approveAll} className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve All ({pendingPayments.length})
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {pendingPayments.length === 0 ? (
          <Card className="p-12 border-white/60 bg-white/60 shadow-sm rounded-3xl text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-olive-900 text-xl mb-2">All Caught Up!</h3>
            <p className="text-olive-500">There are no pending payments requiring verification at this time.</p>
          </Card>
        ) : (
          pendingPayments.map((payment, i) => {
            const member = users.find(u => u.id === payment.memberId);
            return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={payment.id} 
              className="bg-white rounded-2xl border border-olive-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow items-center"
            >
              {/* Member & Amount Info */}
              <div className="w-full md:w-1/4 shrink-0">
                <h4 className="font-bold text-olive-900 text-lg mb-1">{member ? member.name : payment.month}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-olive-600 bg-olive-50 px-2 py-1 rounded-md">ID: {payment.memberId || 'unknown'}</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">₹{payment.amount}</p>
                {member && <p className="text-xs text-olive-500 font-medium mt-1">For {payment.month}</p>}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-olive-100/50 pt-4 md:pt-0 md:pl-6 w-full">
                <div>
                  <p className="text-xs text-olive-400 font-semibold uppercase flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Date
                  </p>
                  <p className="text-sm font-medium text-olive-800">{payment.date}</p>
                </div>
                <div>
                  <p className="text-xs text-olive-400 font-semibold uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> Time
                  </p>
                  <p className="text-sm font-medium text-olive-800">{payment.time}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-olive-400 font-semibold uppercase flex items-center gap-1 mb-1">
                    <CreditCard className="w-3 h-3" /> Mode
                  </p>
                  <p className="text-sm font-medium text-olive-800">{payment.mode}</p>
                </div>
              </div>

              {/* Actions & Receipt */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-olive-100/50 pt-4 md:pt-0 md:pl-6">
                
                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => updatePaymentStatus(payment.id, 'Approved')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors border border-emerald-200 hover:border-transparent"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => updatePaymentStatus(payment.id, 'Resubmit Requested')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors border border-amber-200 hover:border-transparent"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> Resubmit
                  </button>
                  <button 
                    onClick={() => updatePaymentStatus(payment.id, 'Rejected')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors border border-red-200 hover:border-transparent"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>

                {/* Screenshot Thumbnail */}
                {payment.screenshot ? (
                  <a href={payment.screenshot} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group/img hover:bg-emerald-50 p-2 rounded-xl transition-colors shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-olive-50 border border-olive-100 overflow-hidden relative shadow-sm">
                      <img src={payment.screenshot} alt="Receipt" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-emerald-900/0 group-hover/img:bg-emerald-900/10 transition-colors flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Receipt</span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl shrink-0 opacity-50">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-olive-50 border border-olive-100 flex items-center justify-center">
                      <Receipt className="w-8 h-8 text-olive-300" />
                    </div>
                    <span className="text-[10px] font-bold text-olive-500 uppercase tracking-wider">No Receipt</span>
                  </div>
                )}
              </div>
            </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
