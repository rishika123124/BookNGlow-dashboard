'use client';

import { useState, useEffect } from 'react';

export default function AdminSalonsDebug() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      console.log('=== DEBUG FETCH SALONS ===');
      setLoading(true);
      const response = await fetch('/api/admin/salons?limit=5');
      const result = await response.json();
      console.log('Debug API Response:', result);

      if (result.success) {
        setSalons(result.data || []);
        console.log('Debug Salons loaded:', result.data?.length || 0);
        
        // Log each salon with all fields
        result.data?.forEach((salon, index) => {
          console.log(`=== SALON ${index + 1} ===`);
          console.log('_id:', salon._id);
          console.log('salonName:', salon.salonName);
          console.log('name:', salon.name);
          console.log('city:', salon.city);
          console.log('state:', salon.state);
          console.log('phone:', salon.phone);
          console.log('gender:', salon.gender);
          console.log('status:', salon.status);
          console.log('isActive:', salon.isActive);
          console.log('createdAt:', salon.createdAt);
          console.log('---');
        });
      } else {
        console.error('Debug API Error:', result.message);
      }
    } catch (error) {
      console.error('Debug fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading salons debug...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Salon Management Debug</h1>
        
        <div className="mb-4">
          <p className="text-gray-400">Total Salons: {salons.length}</p>
        </div>

        {salons.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No salons found</p>
            <button 
              onClick={fetchSalons}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Raw Salon Data</h2>
              <div className="space-y-2">
                {salons.map((salon, index) => (
                  <div key={salon._id} className="border border-slate-600 p-4 rounded">
                    <h3 className="text-lg font-medium mb-2">Salon {index + 1}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>ID:</strong> {salon._id}
                      </div>
                      <div>
                        <strong>salonName:</strong> {salon.salonName || 'undefined'}
                      </div>
                      <div>
                        <strong>name:</strong> {salon.name || 'undefined'}
                      </div>
                      <div>
                        <strong>city:</strong> {salon.city || 'undefined'}
                      </div>
                      <div>
                        <strong>state:</strong> {salon.state || 'undefined'}
                      </div>
                      <div>
                        <strong>phone:</strong> {salon.phone || 'undefined'}
                      </div>
                      <div>
                        <strong>gender:</strong> {salon.gender || 'undefined'}
                      </div>
                      <div>
                        <strong>status:</strong> {salon.status || 'undefined'}
                      </div>
                      <div>
                        <strong>isActive:</strong> {salon.isActive?.toString() || 'undefined'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">What Should Display</h2>
              <div className="space-y-2 text-sm">
                {salons.map((salon, index) => (
                  <div key={salon._id} className="border border-slate-600 p-4 rounded">
                    <h3 className="text-lg font-medium mb-2">Salon {index + 1} - Table View</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Salon Name:</strong> {salon.salonName || salon.name || 'undefined'}
                      </div>
                      <div>
                        <strong>Location:</strong> {salon.city && salon.state ? `${salon.city}, ${salon.state}` : 'undefined'}
                      </div>
                      <div>
                        <strong>Contact:</strong> {salon.phone || 'undefined'}
                      </div>
                      <div>
                        <strong>Type:</strong> {salon.gender || 'Unisex'}
                      </div>
                      <div>
                        <strong>Status:</strong> {salon.status || 'undefined'}
                      </div>
                      <div>
                        <strong>Action:</strong> 
                        {salon.status === 'active' ? (
                          <span className="text-red-400">Block Button</span>
                        ) : salon.status === 'blocked' ? (
                          <span className="text-green-400">Unblock Button</span>
                        ) : (
                          <span className="text-yellow-400">Other Actions</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
