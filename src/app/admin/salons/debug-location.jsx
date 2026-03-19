'use client';

import { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Calendar } from 'lucide-react';

export default function AdminSalonsLocationDebug() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      console.log('=== DEBUG SALON LOCATION FIELDS ===');
      setLoading(true);
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/admin/salons?limit=5', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('Debug Salons API Response:', result);

      if (result.success) {
        setSalons(result.data || []);
        console.log('Debug Salons loaded:', result.data?.length || 0);
        
        // Log each salon with location fields
        result.data?.forEach((salon, index) => {
          console.log(`=== SALON ${index + 1} LOCATION FIELDS ===`);
          console.log('salonName:', salon.salonName);
          console.log('city:', salon.city);
          console.log('state:', salon.state);
          console.log('address:', salon.address);
          console.log('location:', salon.location);
          console.log('pincode:', salon.pincode);
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
          <p>Loading salon location debug...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Store className="w-6 h-6 mr-2" />
          Salon Location Debug
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
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Location Fields Analysis</h2>
              <div className="space-y-2">
                {salons.map((salon, index) => (
                  <div key={salon._id} className="border border-slate-600 p-4 rounded">
                    <h3 className="text-lg font-medium mb-2">Salon {index + 1}: {salon.salonName || salon.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Available Location Fields:</strong>
                        <div className="text-gray-400 mt-1">
                          <div>city: {salon.city || 'undefined'}</div>
                          <div>state: {salon.state || 'undefined'}</div>
                          <div>address: {salon.address || 'undefined'}</div>
                          <div>location: {salon.location || 'undefined'}</div>
                          <div>pincode: {salon.pincode || 'undefined'}</div>
                        </div>
                      </div>
                      <div>
                        <strong>What Will Display:</strong>
                        <div className="text-gray-400 mt-1">
                          <div>Primary: {salon.city && salon.state ? `${salon.city}, ${salon.state}` : 'undefined'}</div>
                          <div>Secondary: {salon.address || salon.location || 'undefined'}</div>
                          <div>Fallback: {salon.city || salon.state || 'Location not specified'}</div>
                          <div className="mt-2 text-green-400">
                            <strong>Final Display:</strong> {salon.city && salon.state ? 
                              `${salon.city}, ${salon.state}` : 
                              salon.address || salon.location || 
                              (salon.city || salon.state || 'Location not specified')
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Table Preview</h2>
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="text-left p-4 text-gray-400 font-medium">Salon Name</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Location Display</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
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
                            {salon.city && salon.state ? 
                              `${salon.city}, ${salon.state}` : 
                              salon.address || salon.location || 
                              (salon.city || salon.state || 'Location not specified')
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-300 text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {salon.phone || 'No phone'}
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
                          <span className={`px-2 py-1 rounded text-xs ${
                            salon.status === 'approved' ? 'bg-green-600' :
                            salon.status === 'blocked' ? 'bg-red-600' :
                            'bg-yellow-600'
                          }`}>
                            {salon.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
