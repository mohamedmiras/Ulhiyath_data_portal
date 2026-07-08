import React from 'react';
import { Card } from '../components/ui/Card';
import { Users, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

export function AdminDashboard() {
  const { users, payments, systemSettings } = useData();

  const totalMembers = users.filter(u => u.role !== 'admin').length;
  const totalCollection = users.filter(u => u.role !== 'admin').reduce((acc, u) => acc + (u.totalPaid || 0), 0);
  const pendingVerifications = payments.filter(p => p.status === 'Pending Verification').length;
  
  const totalRequired = (systemSettings?.targetMonths || 19) * (systemSettings?.defaultMonthlyAmount || 1000);
  const fullyPaidMembers = users.filter(u => u.role !== 'admin' && (u.totalPaid || 0) >= totalRequired).length;

  const stats = [
    { label: 'Total Members', value: totalMembers.toString(), icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-100/50', trend: 'Active users' },
    { label: 'Total Collection', value: `₹${totalCollection.toLocaleString()}`, icon: TrendingUp, color: 'text-gold-700', bg: 'bg-gold-100/50', trend: 'From all members' },
    { label: 'Pending Verifications', value: pendingVerifications.toString(), icon: AlertCircle, color: 'text-[#A64C3E]', bg: 'bg-[#FDF2F0]', trend: 'Requires action' },
    { label: 'Fully Paid Members', value: fullyPaidMembers.toString(), icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100/50', trend: totalMembers > 0 ? `${Math.round((fullyPaidMembers/totalMembers)*100)}% of total` : '0% of total' },
  ];

  const chartData = [
    { name: 'Jan', amount: 80000 },
    { name: 'Feb', amount: 95000 },
    { name: 'Mar', amount: 110000 },
    { name: 'Apr', amount: 105000 },
    { name: 'May', amount: 130000 },
    { name: 'Jun', amount: 142000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
        <div className="space-y-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-olive-500 font-bold tracking-wider uppercase text-xs mb-1">Admin Overview</p>
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 font-manjari">Committee Dashboard</h2>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} hover className="flex flex-col h-full bg-white/60 border-white shadow-sm hover:shadow-md p-6 group rounded-3xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-olive-900 font-manjari tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-olive-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-olive-100/50">
                  <p className="text-xs font-medium text-olive-600">{stat.trend}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <Card className="p-6 md:p-8 border-white/60 bg-gradient-to-br from-white to-warm-white shadow-sm rounded-3xl">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="font-manjari text-xl font-bold text-olive-900">Collection Trends</h3>
               <p className="text-sm font-medium text-olive-500 mt-1">Monthly payment collections overview</p>
             </div>
             <select className="bg-white/50 border border-olive-200 text-olive-700 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 font-medium">
               <option>2026</option>
               <option>2025</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EDE0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#88AB73', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#88AB73', fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: '1px solid #E6EDE0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#064e3b', fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Collection']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
