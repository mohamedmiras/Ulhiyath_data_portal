import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, set, push, update, remove } from 'firebase/database';
import { db } from '../lib/firebase';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemSettings, setSystemSettings] = useState({ defaultMonthlyAmount: 1000, targetMonths: 19 });

  useEffect(() => {
    // Listen to payments
    const paymentsRef = ref(db, 'payments');
    const unsubPayments = onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paymentsArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        // Sort descending (assuming Firebase push keys which are chronological)
        setPayments(paymentsArray.reverse());
      } else {
        setPayments([]);
      }
    });

    // Listen to users
    const usersRef = ref(db, 'users');
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    // Listen to system settings
    const sysRef = ref(db, 'systemSettings');
    const unsubSys = onValue(sysRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSystemSettings(data);
      }
    });

    return () => {
      unsubPayments();
      unsubUsers();
      unsubSys();
    };
  }, []);

  const addPayment = async (payment) => {
    const paymentsRef = ref(db, 'payments');
    const newPaymentRef = push(paymentsRef);
    await set(newPaymentRef, payment);
  };

  const updatePayment = async (id, paymentData) => {
    await update(ref(db, `payments/${id}`), paymentData);
  };

  const deletePayment = async (id) => {
    await remove(ref(db, `payments/${id}`));
  };

  const updatePaymentStatus = async (id, status) => {
    await update(ref(db, `payments/${id}`), { status });
  };

  const approveAll = async () => {
    const updates = {};
    payments.forEach(p => {
      if (p.status === 'Pending Verification') {
        updates[`payments/${p.id}/status`] = 'Approved';
      }
    });
    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
    }
  };

  const updateSystemSettings = async (newSettings) => {
    await update(ref(db, 'systemSettings'), newSettings);
  };

  const updateUserPasswordInDB = async (uid, newPassword) => {
    await update(ref(db, `users/${uid}`), { password: newPassword });
  };

  const addMember = async (uid, memberData) => {
    await set(ref(db, `users/${uid}`), memberData);
  };

  const updateUser = async (uid, memberData) => {
    await update(ref(db, `users/${uid}`), memberData);
  };

  const deleteUser = async (uid) => {
    // Collect all payment IDs that belong to this member
    const updates = {};
    payments.forEach(p => {
      if (p.memberId === uid) {
        updates[`payments/${p.id}`] = null;
      }
    });
    // Remove the user profile
    updates[`users/${uid}`] = null;
    
    // Perform bulk delete
    await update(ref(db), updates);
  };

  const usersWithComputedTotals = users.map(u => {
    const userPayments = payments.filter(p => p.memberId === u.id && p.status === 'Approved');
    const appTotalPaid = userPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    return {
      ...u,
      totalPaid: (u.totalPaid || 0) + appTotalPaid,
      baseTotalPaid: u.totalPaid || 0
    };
  });

  return (
    <DataContext.Provider value={{
      payments, addPayment, updatePayment, deletePayment, updatePaymentStatus, approveAll,
      users: usersWithComputedTotals, updateUserPasswordInDB, addMember, updateUser, deleteUser,
      systemSettings, updateSystemSettings
    }}>
      {children}
    </DataContext.Provider>
  );
}
