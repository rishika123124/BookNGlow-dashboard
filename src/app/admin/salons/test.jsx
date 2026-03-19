'use client';

import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Calendar } from 'lucide-react';

export default function AdminSalonsTest() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      console.log('=== TEST FETCH SALONS ===');
      setLoading(true);
      const response = await fetch('/api/admin/salons?limit=10');
      const result = await response.json();
      console.log('Test Salons API Response:', result);

      if (result.success) {
        setSalons(result.data || []);
        console.log('Test Salons loaded:', result.data?.length || 0);
        console.log('Sample salon:', result.data?.[0]);
      } else {
        console.error('Test API Error:', result.message);
      }
    } catch (error) {
      console.error('Test fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading salons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Store className="w-6 h-6 mr-2" />
          Salon Management Test
        </h1>
        
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
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Salon Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Salon Location</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Contact Number</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Salon Type</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Join Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {salons.map((salon) => (
                  <tr key={salon._id} className="border-b border-slate-700">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{salon.salonName || salon.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {salon.city}, {salon.state}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {salon.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        salon.gender === 'Female' ? 'bg-pink-600' :
                        salon.gender === 'Male' ? 'bg-blue-600' :
                        'bg-purple-600'
                      }`}>
                        {salon.gender || 'Unisex'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(salon.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        salon.status === 'active' ? 'bg-green-600' :
                        salon.status === 'blocked' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}>
                        {salon.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div className="mb-1">
                          <strong>Data Debug:</strong>
                        </div>
                        <div className="text-gray-400">
                          <div>salonName: {salon.salonName || 'undefined'}</div>
                          <div>name: {salon.name || 'undefined'}</div>
                          <div>city: {salon.city || 'undefined'}</div>
                          <div>state: {salon.state || 'undefined'}</div>
                          <div>phone: {salon.phone || 'undefined'}</div>
                          <div>gender: {salon.gender || 'undefined'}</div>
                          <div>status: {salon.status || 'undefined'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
