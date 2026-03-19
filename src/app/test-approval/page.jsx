'use client';

import { useState, useEffect } from 'react';

export default function TestApprovalPage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      console.log('=== FETCHING SALONS FROM API ===');
      const response = await fetch('/api/admin/salons');
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        setSalons(result.data);
        const pending = result.data.filter(s => s.status === 'pending');
        console.log('Total Salons:', result.data.length);
        console.log('Pending Salons:', pending.length);
        console.log('Pending List:', pending.map(s => s.salonName));
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Admin Approval API</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Admin Approval API</h1>
        <div className="text-red-400">Error: {error}</div>
        <button 
          onClick={fetchSalons}
          className="mt-4 px-4 py-2 bg-blue-600 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Testing Admin Approval API</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API Response</h2>
        <div className="bg-slate-800 p-4 rounded">
          <p>Total Salons: {salons.length}</p>
          <p>Pending Salons: {salons.filter(s => s.status === 'pending').length}</p>
          <p>Approved Salons: {salons.filter(s => s.status === 'approved').length}</p>
          <p>Rejected Salons: {salons.filter(s => s.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Salons ({salons.filter(s => s.status === 'pending').length})</h2>
        <div className="space-y-2">
          {salons.filter(s => s.status === 'pending').map((salon, index) => (
            <div key={salon._id} className="bg-slate-800 p-4 rounded">
              <h3 className="font-semibold">{salon.salonName}</h3>
              <p className="text-sm text-gray-400">Owner: {salon.ownerName}</p>
              <p className="text-sm text-gray-400">Email: {salon.email}</p>
              <p className="text-sm text-gray-400">Gender: {salon.gender}</p>
              <p className="text-sm text-gray-400">Status: {salon.status}</p>
              <p className="text-sm text-gray-400">Active: {salon.isActive ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Salons</h2>
        <div className="space-y-2">
          {salons.map((salon, index) => (
            <div key={salon._id} className="bg-slate-800 p-4 rounded">
              <h3 className="font-semibold">{salon.salonName}</h3>
              <p className="text-sm text-gray-400">Status: {salon.status}</p>
              <p className="text-sm text-gray-400">Gender: {salon.gender}</p>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={fetchSalons}
        className="mt-8 px-6 py-3 bg-green-600 rounded font-semibold"
      >
        Refresh Data
      </button>
    </div>
  );
}
