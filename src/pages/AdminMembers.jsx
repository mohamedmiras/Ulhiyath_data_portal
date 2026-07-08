import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, Download, MoreVertical, Plus, Check, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { firebaseConfig } from '../lib/firebase';

export function AdminMembers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    amount: '1000',
    joinDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [editFormData, setEditFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setEditFormData({
        name: editingMember.name || '',
        phone: editingMember.phone || '',
        location: editingMember.location || '',
        monthlyAmount: editingMember.monthlyAmount || 1000,
        joinDate: editingMember.joinDate || '',
        notes: editingMember.notes || '',
        baseTotalPaid: editingMember.baseTotalPaid || 0,
      });
    } else {
      setEditFormData(null);
    }
  }, [editingMember]);

  const handleUpdateMember = async () => {
    try {
      setIsSaving(true);
      await updateUser(editingMember.id, {
        name: editFormData.name,
        phone: editFormData.phone,
        location: editFormData.location,
        monthlyAmount: Number(editFormData.monthlyAmount),
        joinDate: editFormData.joinDate,
        notes: editFormData.notes,
        totalPaid: Number(editFormData.baseTotalPaid)
      });
      setEditingMember(null);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(memberToDelete.id);
      setMemberToDelete(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const [countryCode, setCountryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { users, systemSettings, addMember, updateUser, deleteUser } = useData();

  const members = users.filter(u => u.role !== 'admin').map(u => {
    const totalRequired = (systemSettings?.targetMonths || 19) * (systemSettings?.defaultMonthlyAmount || 1000);
    return {
      id: u.id,
      name: u.name || 'Unknown Member',
      location: u.location || 'N/A',
      amount: systemSettings?.defaultMonthlyAmount || 1000,
      date: 'N/A', // Last payment date
      status: (u.totalPaid || 0) >= totalRequired ? 'Approved' : 'Pending',
      paid: u.totalPaid || 0,
      due: Math.max(0, totalRequired - (u.totalPaid || 0))
    };
  });

  const handleCreateMember = async () => {
    try {
      if (!formData.name?.trim() || !formData.phone?.trim()) {
        setError('Name and Phone are required.');
        return;
      }
      setLoading(true);
      setError('');

      const fullPhone = `${countryCode}${formData.phone.replace(/^0+/, '')}`; // Remove leading zeros if any
      const email = `${fullPhone.replace('+', '')}@ulhiyath.com`; // safe email format without +
      const rawPhone = formData.phone.replace(/^0+/, ''); // Extract just the 10 digit number
      const password = 'password123'; // Default password is password123

      let uid = null;

      try {
        // Try creating the user via pure REST API to completely bypass Firebase Client SDK call stack loops
        const signUpRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        });
        
        const signUpData = await signUpRes.json();
        
        if (!signUpRes.ok) {
          if (signUpData.error && signUpData.error.message === 'EMAIL_EXISTS') {
            // If already exists (e.g. from a previous crash), fetch their UID by signing in
            const signInRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, returnSecureToken: true })
            });
            const signInData = await signInRes.json();
            if (!signInRes.ok) throw new Error(signInData.error?.message || 'Failed to recover account');
            uid = signInData.localId;
          } else {
            throw new Error(signUpData.error?.message || 'Failed to create account');
          }
        } else {
          uid = signUpData.localId;
        }
      } catch (authErr) {
        console.error("Auth REST Error:", authErr);
        throw new Error("Phone number already registered to a different user, or network error.");
      }

      if (uid) {
        if (typeof uid !== 'string') {
          uid = String(uid);
        }
        
        const memberData = {
          name: formData.name || '',
          phone: fullPhone || '',
          location: formData.location || '',
          monthlyAmount: Number(formData.amount) || 1000,
          joinDate: formData.joinDate || '',
          notes: formData.notes || '',
          role: 'member',
          password: password,
          totalPaid: 0,
          createdAt: new Date().toISOString()
        };

        const dbRes = await fetch(`https://ulhiyath-default-rtdb.firebaseio.com/users/${uid}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save member profile to database.");
        }
      }

      // Reset form and close
      setFormData({
        name: '', phone: '', location: '', amount: '1000', 
        joinDate: new Date().toISOString().split('T')[0], notes: ''
      });
      setShowAddForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create member');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
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
                 <Check className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold font-manjari text-olive-900 mb-2">Member Added!</h3>
              <p className="text-olive-500 font-medium mb-8">Their profile has been successfully created and saved.</p>
              <Button onClick={() => setShowSuccess(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold shadow-md shadow-emerald-500/20">
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-1">Directory</p>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 font-manjari">Committee Members</h2>
          </motion.div>
        </div>
        {!showAddForm && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 shadow-float hover:shadow-none transition-shadow rounded-2xl w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" size="lg">
              <Plus className="w-5 h-5" />
              Add Member
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showAddForm ? (
          <motion.div
            key="members-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-0 overflow-hidden border-white/60 bg-white/60 shadow-sm rounded-3xl">
              <div className="p-6 md:p-8 border-b border-olive-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <h3 className="font-manjari text-xl font-bold text-olive-900">Member Directory</h3>
                   <p className="text-sm font-medium text-olive-500 mt-1">Manage members and verify payments</p>
                 </div>
                 
                 <div className="flex items-center gap-3 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-olive-400" />
                      <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-olive-200/80 bg-white/80 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 focus:outline-none text-sm w-full transition-all font-medium" 
                      />
                   </div>
                   <Button variant="outline" className="px-3 rounded-xl border-olive-200 bg-white text-olive-600 hidden sm:flex">
                     <Filter className="w-4 h-4" />
                   </Button>
                   <Button variant="outline" className="px-3 rounded-xl border-olive-200 bg-white text-olive-600 hidden sm:flex">
                     <Download className="w-4 h-4" />
                   </Button>
                 </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-olive-500 bg-olive-50/50">
                    <tr>
                      <th className="px-8 py-4 font-bold uppercase tracking-wider text-[11px]">Member</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Total Due</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Total Paid</th>
                      <th className="px-8 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-olive-100/30">
                    <AnimatePresence>
                      {filteredMembers.map((member) => (
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={member.id} 
                          className="hover:bg-white/80 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-bold font-manjari shrink-0">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-olive-900 text-base">{member.name}</p>
                                <p className="text-xs text-olive-500 font-medium mt-0.5">{member.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-[#A64C3E] text-base">₹{member.due.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-5">
                            <Badge variant={member.status === 'Approved' ? 'success' : 'warning'} className="text-[11px] px-2.5 py-1">
                              {member.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-base font-bold text-emerald-700">₹{member.paid.toLocaleString()}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  const fullMember = users.find(u => u.id === member.id);
                                  setEditingMember(fullMember);
                                }}
                                title="Edit Member"
                                className="p-2 text-olive-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  const fullMember = users.find(u => u.id === member.id);
                                  setMemberToDelete(fullMember);
                                }}
                                title="Delete Member"
                                className="p-2 text-olive-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => navigate('/dashboard/admin/members/' + member.id)}
                                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-colors group-hover:shadow-md text-xs tracking-wide"
                              >
                                View Profile
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden p-4 space-y-4 bg-olive-50/20">
                <AnimatePresence>
                  {filteredMembers.map((member) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={member.id} 
                      className="bg-white rounded-2xl p-5 border border-olive-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-bold font-manjari shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-olive-900">{member.name}</p>
                            <p className="text-xs text-olive-500 font-medium">{member.location}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={member.status === 'Approved' ? 'success' : 'warning'} className="text-[10px]">
                            {member.status}
                          </Badge>
                          <div className="flex gap-1 -mr-2">
                            <button onClick={() => setEditingMember(users.find(u => u.id === member.id))} className="p-2 text-olive-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setMemberToDelete(users.find(u => u.id === member.id))} className="p-2 text-olive-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-olive-100/60">
                        <div>
                          <p className="text-xs text-[#A64C3E] font-semibold uppercase mb-1">Total Due</p>
                          <p className="font-bold text-[#A64C3E] text-lg">₹{member.due.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Total Paid</p>
                          <p className="font-bold text-emerald-700 text-lg">₹{member.paid.toLocaleString()}</p>
                        </div>
                      </div>

                      <Button 
                        onClick={() => navigate('/dashboard/admin/members/' + member.id)}
                        className="w-full rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-0 py-2.5 font-bold shadow-none"
                      >
                        View Profile
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="add-member-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl border-white/60 bg-white/60 shadow-sm rounded-3xl p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold font-manjari text-olive-900">Add New Member</h3>
                <p className="text-olive-500 mt-1">Register a new member to the committee.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-olive-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Mohammed Ali" 
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-olive-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex">
                      <select 
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="block rounded-l-xl border border-r-0 border-olive-200 bg-olive-50 px-2 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow text-olive-700 text-sm"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+971">+971 (AE)</option>
                        <option value="+966">+966 (SA)</option>
                        <option value="+974">+974 (QA)</option>
                        <option value="+965">+965 (KW)</option>
                        <option value="+968">+968 (OM)</option>
                        <option value="+973">+973 (BH)</option>
                      </select>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="block w-full rounded-r-xl border border-olive-200 bg-white/80 px-3 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-olive-700 mb-2">Location/Address</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Kallumpuram" 
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-olive-700 mb-2">Monthly Installment (₹)</label>
                    <input 
                      type="number" 
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-olive-700 mb-2">Join Date</label>
                  <input 
                    type="date" 
                    value={formData.joinDate}
                    onChange={e => setFormData({...formData, joinDate: e.target.value})}
                    className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-olive-700 mb-2">Notes / Remarks</label>
                  <textarea 
                    rows="4" 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 font-medium resize-none outline-none transition-shadow"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-olive-100/50 flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setError('');
                    }} 
                    className="rounded-xl border-olive-200 text-olive-700 hover:bg-white bg-white/50 py-3"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateMember}
                    isLoading={loading}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md py-3 px-8"
                  >
                    Create Member
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editingMember && editFormData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive-900/40 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold font-manjari text-olive-900">Edit Member</h3>
                  <p className="text-olive-500 text-sm mt-1">Update profile details for {editingMember.name}</p>
                </div>
                <button onClick={() => setEditingMember(null)} className="p-2 bg-olive-50 hover:bg-olive-100 text-olive-600 rounded-full transition-colors">
                  <Check className="w-5 h-5 opacity-0" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-olive-700 mb-1 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={editFormData.name}
                      onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-olive-700 mb-1 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      value={editFormData.phone}
                      onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-olive-700 mb-1 uppercase tracking-wider">Location/Address</label>
                    <input 
                      type="text" 
                      value={editFormData.location}
                      onChange={e => setEditFormData({...editFormData, location: e.target.value})}
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-olive-700 mb-1 uppercase tracking-wider">Join Date</label>
                    <input 
                      type="date" 
                      value={editFormData.joinDate}
                      onChange={e => setEditFormData({...editFormData, joinDate: e.target.value})}
                      className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1 uppercase tracking-wider">Monthly Installment (₹)</label>
                    <input 
                      type="number" 
                      value={editFormData.monthlyAmount}
                      onChange={e => setEditFormData({...editFormData, monthlyAmount: e.target.value})}
                      className="block w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1 uppercase tracking-wider">Base Total Paid (₹)</label>
                    <input 
                      type="number" 
                      value={editFormData.baseTotalPaid}
                      onChange={e => setEditFormData({...editFormData, baseTotalPaid: e.target.value})}
                      className="block w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none transition-shadow" 
                    />
                    <p className="text-[10px] text-emerald-600 font-medium mt-1">Starting balance (does not include approved screenshot uploads).</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-olive-700 mb-1 uppercase tracking-wider">Notes / Remarks</label>
                  <textarea 
                    rows="2" 
                    value={editFormData.notes}
                    onChange={e => setEditFormData({...editFormData, notes: e.target.value})}
                    className="block w-full rounded-xl border border-olive-200 bg-white/80 px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/50 font-medium resize-none outline-none transition-shadow"
                  ></textarea>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-olive-100">
                  <Button variant="outline" onClick={() => setEditingMember(null)} className="rounded-xl border-olive-200">Cancel</Button>
                  <Button isLoading={isSaving} onClick={handleUpdateMember} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6">Save Changes</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-olive-900/40 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold font-manjari text-olive-900 mb-2">Delete Member?</h3>
              <p className="text-olive-500 text-sm mb-6">Are you sure you want to permanently delete <strong>{memberToDelete.name}</strong> and all of their payment history? This action cannot be undone.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="outline" onClick={() => setMemberToDelete(null)} className="rounded-xl border-olive-200 w-full sm:w-auto">Cancel</Button>
                <Button isLoading={isDeleting} onClick={handleDeleteMember} className="rounded-xl bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto shadow-md">Yes, Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
