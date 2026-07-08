import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Clock, CheckCircle2, AlertCircle, CalendarDays, Receipt, Download, CreditCard as CardIcon, X as XIcon, Trash2, Edit2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearOptions = [2025, 2026, 2027, 2028, 2029, 2030];
const currentDate = new Date();
const currentYear = Math.max(2025, Math.min(2030, currentDate.getFullYear()));
const currentMonth = monthNames[currentDate.getMonth()];

export function MemberDashboard() {
  const { userData } = useAuth();
  
  const { payments, addPayment, updatePayment, systemSettings, users } = useData();
  
  // Find the exact up-to-date user object with computed dynamic totals
  const dbUser = users.find(u => u.id === userData?.id) || userData;
  const myPayments = payments.filter(p => p.memberId === userData?.id);
  
  // Mock Data or Real Data fallback
  const member = {
    name: dbUser?.name || 'Mohammed Ali',
    phone: dbUser?.phone || '+91 9876543210',
    joinedMonth: dbUser?.joinedMonth || '2025-01',
    totalPaid: dbUser?.totalPaid ?? 0,
  };

  const monthlyDues = systemSettings?.defaultMonthlyAmount || 1000;
  const monthsElapsed = systemSettings?.targetMonths || 19; 
  const totalRequired = monthsElapsed * monthlyDues;
  
  const pendingBalance = Math.max(0, totalRequired - member.totalPaid);
  const extraBalance = Math.max(0, member.totalPaid - totalRequired);
  const progressPercentage = Math.min(100, Math.round((member.totalPaid / totalRequired) * 100)) || 0;

  let status = 'Completed';
  let badgeVariant = 'success';
  
  if (pendingBalance > 0) {
    status = 'Pending Dues';
    badgeVariant = 'danger';
  } else if (extraBalance > 0) {
    status = 'Advance Paid';
    badgeVariant = 'success';
  }

  const [uploadOpen, setUploadOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewingScreenshot, setViewingScreenshot] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [formData, setFormData] = useState({ amount: monthlyDues.toString(), month: currentMonth, year: currentYear.toString(), mode: 'UPI' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress to base64
          setPreviewUrl(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const paymentData = {
      memberId: userData?.id || 'unknown',
      amount: parseInt(formData.amount),
      month: `${formData.month} ${formData.year}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      mode: formData.mode,
      status: 'Pending Verification',
      screenshot: previewUrl
    };
    
    if (editingPaymentId) {
      updatePayment(editingPaymentId, paymentData);
    } else {
      addPayment(paymentData);
    }
    
    setUploadOpen(false);
    setPreviewUrl(null);
    setEditingPaymentId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-10">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-olive-900/40 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold font-manjari text-olive-900 mb-2">Payment Recorded!</h3>
              <p className="text-olive-500 font-medium mb-8">Your payment receipt has been uploaded and is pending verification.</p>
              <Button onClick={() => setShowSuccess(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold shadow-md shadow-emerald-500/20">
                View Receipt
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-1">Account Summary</p>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 font-manjari flex items-center gap-3">
              {member.name}
              <Badge variant={badgeVariant} className="text-xs">{status}</Badge>
            </h2>
            <p className="text-olive-600/90 text-sm mt-2 text-malayalam font-medium">നിങ്ങളുടെ ഉള്ഹിയ്യത്ത് വിഹിതം വിവരങ്ങൾ</p>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Button onClick={() => {
            setEditingPaymentId(null);
            setFormData({ amount: monthlyDues.toString(), month: currentMonth, year: currentYear.toString(), mode: 'UPI' });
            setPreviewUrl(null);
            setUploadOpen(true);
          }} className="flex items-center gap-2 shadow-float hover:shadow-none transition-shadow rounded-2xl w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" size="lg">
            <Upload className="w-5 h-5" />
            Upload Payment
          </Button>
        </motion.div>
      </div>

      {/* Progress & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Progress Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-white to-warm-white border-white p-8 relative overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-float transition-shadow" hover={false}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-200/50 transition-colors" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-100">
                  <CardIcon className="w-4 h-4" />
                  Total Contribution
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-olive-500">Target ({monthsElapsed} Months)</p>
                  <p className="text-lg font-bold text-olive-900">₹{totalRequired.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-5xl md:text-6xl font-bold text-olive-900 tracking-tight font-manjari mt-2">
                ₹{member.totalPaid.toLocaleString()}
              </p>
            </div>

            <div className="mt-10">
              <ProgressBar 
                progress={progressPercentage} 
                label="Payment Progress" 
                valueLabel={`${progressPercentage}% Completed`} 
                className="mt-4"
              />
            </div>
          </div>
        </Card>

        {/* Secondary Stats */}
        <div className="space-y-6 flex flex-col">
          <Card className={`flex-1 flex flex-col justify-center p-6 border-white/60 relative overflow-hidden ${pendingBalance > 0 ? 'bg-gradient-to-br from-[#FFF5F4] to-[#FDF0EE]' : 'bg-gradient-to-br from-emerald-50/50 to-white'}`}>
             <div className="absolute top-4 right-4 opacity-10">
               {pendingBalance > 0 ? <AlertCircle className="w-16 h-16 text-[#A64C3E]" /> : <CheckCircle2 className="w-16 h-16 text-emerald-600" />}
             </div>
             <span className="text-xs font-bold uppercase tracking-wider text-olive-500 mb-2">Pending Balance</span>
             <p className={`text-4xl font-bold ${pendingBalance > 0 ? 'text-[#A64C3E]' : 'text-emerald-700'}`}>
               ₹{pendingBalance.toLocaleString()}
             </p>
             {pendingBalance > 0 && <p className="text-xs text-[#A64C3E]/80 mt-2 font-medium">Clear dues to avoid arrears.</p>}
          </Card>
          
          <Card className="flex-1 flex flex-col justify-center p-6 bg-gold-50/40 border-gold-100/50">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 mb-2">Monthly Installment</span>
            <p className="text-3xl font-bold text-gold-900">₹{monthlyDues.toLocaleString()}</p>
            <div className="mt-3 flex items-center gap-1.5 text-gold-600/80 text-xs font-medium bg-gold-100/50 w-fit px-2 py-1 rounded-md">
              <CalendarDays className="w-3.5 h-3.5" />
              Due 1st of every month
            </div>
          </Card>
        </div>

      </div>

      {/* Payment Timeline */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-manjari text-2xl font-bold text-olive-900">Payment History</h3>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 rounded-xl text-olive-600 border-olive-200">
            <Download className="w-4 h-4" />
            Download Statement
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border-white/80 glass-card">
          <div className="relative p-6 md:p-10">
            {/* Vertical Line */}
            <div className="absolute left-[39px] md:left-[51px] top-10 bottom-10 w-0.5 bg-olive-100/60 rounded-full" />
            
            <div className="space-y-8 relative">
               {myPayments.map((payment, i) => {
                 const isApproved = payment.status === 'Approved';
                 return (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1, duration: 0.4 }}
                     key={payment.id} 
                     className="flex items-start gap-4 md:gap-6 group"
                   >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 border-[3px] border-warm-white transition-colors duration-300 ${isApproved ? 'bg-emerald-500 text-white shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : 'bg-gold-400 text-white shadow-[0_0_0_4px_rgba(251,191,36,0.1)]'}`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 bg-white/60 hover:bg-white border border-olive-100/40 rounded-2xl p-4 md:p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group-hover:shadow-md">
                         <div>
                           <div className="flex items-center gap-3 mb-1.5">
                             <p className="text-lg md:text-xl font-bold text-olive-900">₹{payment.amount.toLocaleString()}</p>
                             <Badge variant={isApproved ? 'success' : 'warning'} className="text-[10px] md:text-xs py-0.5">
                               {payment.status}
                             </Badge>
                           </div>
                           <p className="text-sm font-semibold text-olive-600">For {payment.month}</p>
                         </div>
                         <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1">
                           <div className="text-left sm:text-right">
                             <p className="text-[11px] text-olive-400 font-bold uppercase tracking-wider">Paid on</p>
                             <p className="text-sm text-olive-800 font-medium">{payment.date} {payment.time && `at ${payment.time}`}</p>
                           </div>
                           <div className="flex items-center gap-2">
                             {payment.screenshot && (
                                <button 
                                  onClick={() => setViewingScreenshot(payment.screenshot)} 
                                  title="View Screenshot" 
                                  className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                             )}
                             {!isApproved && (
                               <button 
                                 title="Edit Payment"
                                 onClick={() => {
                                   setEditingPaymentId(payment.id);
                                   const [m, y] = payment.month.split(' ');
                                   setFormData({ amount: payment.amount.toString(), month: m, year: y, mode: payment.mode || 'UPI' });
                                   setPreviewUrl(payment.screenshot || null);
                                   setUploadOpen(true);
                                 }} 
                                 className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                               >
                                 <Edit2 className="w-4 h-4" />
                               </button>
                             )}
                             <button className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full hover:bg-emerald-50 transition-colors sm:hidden">
                               <Download className="w-4 h-4" />
                             </button>
                           </div>
                         </div>
                      </div>
                   </motion.div>
                 );
               })}
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={uploadOpen} onClose={() => { setUploadOpen(false); setEditingPaymentId(null); }} title={editingPaymentId ? "Edit Payment" : "Submit New Payment"}>
        <div className="space-y-6">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex gap-3">
             <Receipt className="w-6 h-6 text-emerald-600 shrink-0" />
             <p className="text-sm text-emerald-800 font-medium">Please upload a clear screenshot of your transaction along with the exact amount paid.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-olive-700 mb-2">Amount Paid (₹)</label>
              <input type="number" onWheel={(e) => e.target.blur()} value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="block w-full rounded-xl border border-olive-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-olive-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-olive-700 mb-2">Month</label>
                <select value={formData.month} onChange={(e) => setFormData({...formData, month: e.target.value})} className="block w-full rounded-xl border border-olive-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-olive-900">
                  {monthNames.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-olive-700 mb-2">Year</label>
                <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="block w-full rounded-xl border border-olive-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-olive-900">
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-olive-700 mb-2">Payment Mode</label>
              <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})} className="block w-full rounded-xl border border-olive-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-olive-900">
                <option>UPI / GPay</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-olive-700 mb-2">Payment Screenshot</label>
              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-olive-200 group">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-white" />
                  <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-olive-200 border-dashed rounded-2xl hover:bg-olive-50/50 transition-colors cursor-pointer group">
                  <div className="space-y-2 text-center">
                    <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex text-sm text-olive-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-bold text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1 font-medium">or drag and drop</p>
                    </div>
                    <p className="text-xs text-olive-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-olive-100 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setUploadOpen(false); setPreviewUrl(null); setEditingPaymentId(null); }} className="rounded-xl border-olive-200 text-olive-700 hover:bg-olive-50">Cancel</Button>
            <Button onClick={handleSubmit} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all">{editingPaymentId ? "Save Changes" : "Submit Receipt"}</Button>
          </div>
        </div>
      </Modal>

      {/* View Screenshot Modal */}
      <Modal isOpen={!!viewingScreenshot} onClose={() => setViewingScreenshot(null)} title="Payment Screenshot">
        <div className="space-y-4">
          {viewingScreenshot && (
            <div className="bg-white rounded-2xl overflow-hidden border border-olive-100 flex items-center justify-center p-2">
              <img src={viewingScreenshot} alt="Payment Receipt" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-olive-100">
            <Button onClick={() => setViewingScreenshot(null)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Close</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
