'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardDebug() {
  const [message, setMessage] = useState('Loading...');
  
  useEffect(() => {
    setMessage('Admin Dashboard Debug - Working!');
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard Debug</h1>
      <p className="text-xl">{message}</p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Debug Information:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>React is working: ✅</li>
          <li>useState is working: ✅</li>
          <li>useEffect is working: ✅</li>
          <li>Styling is working: ✅</li>
          <li>Component is rendering: ✅</li>
        </ul>
      </div>
    </div>
  );
}
