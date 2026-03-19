'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboardDebug() {
  const [stats, setStats] = useState({});
  const [pendingSalons, setPendingSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      console.log('=== ADMIN DASHBOARD DEBUG START ===');
      
      // Check admin token
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin Token:', adminToken ? '✅ Present' : '❌ Missing');
      setDebugInfo(prev => ({ ...prev, adminToken: adminToken ? 'Present' : 'Missing' }));

      if (!adminToken) {
        setError('Admin token not found. Please login first.');
        setLoading(false);
        return;
      }

      // Fetch stats
      console.log('Fetching stats...');
      const statsResponse = await fetch('/api/admin/stats');
      const statsData = await statsResponse.json();
      console.log('Stats Response:', statsData);
      setStats(statsData.success ? statsData.data : {});

      // Fetch salons
      console.log('Fetching salons...');
      const salonsResponse = await fetch('/api/admin/salons', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const salonsData = await salonsResponse.json();
      console.log('Salons Response:', salonsData);
      
      if (salonsData.success) {
        const pending = salonsData.data.filter(salon => salon.status === 'pending');
        console.log('Pending Salons Found:', pending.length);
        pending.forEach((salon, index) => {
          console.log(`${index + 1}. ${salon.salonName} - ${salon.email}`);
        });
        setPendingSalons(pending);
        setDebugInfo(prev => ({ 
          ...prev, 
          totalSalons: salonsData.data.length,
          pendingSalons: pending.length,
          apiSuccess: true
        }));
      } else {
        console.error('Salons API failed:', salonsData);
        setError('Failed to fetch salons: ' + salonsData.message);
      }

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(error.message);
      setDebugInfo(prev => ({ ...prev, error: error.message }));
    } finally {
      setLoading(false);
      console.log('=== ADMIN DASHBOARD DEBUG END ===');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard Debug</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard Debug</h1>
        <div className="text-red-400 mb-4">Error: {error}</div>
        <Button onClick={fetchAllData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard Debug</h1>
      
      {/* Debug Info */}
      <Card className="mb-6 bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Admin Token:</span>
              <div className={debugInfo.adminToken === 'Present' ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.adminToken || 'Unknown'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Total Salons:</span>
              <div className="text-white">{debugInfo.totalSalons || 0}</div>
            </div>
            <div>
              <span className="text-gray-400">Pending Salons:</span>
              <div className="text-yellow-400">{debugInfo.pendingSalons || 0}</div>
            </div>
            <div>
              <span className="text-gray-400">API Success:</span>
              <div className={debugInfo.apiSuccess ? 'text-green-400' : 'text-red-400'}>
                {debugInfo.apiSuccess ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.totalUsers || 0}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.totalSalons || 0}</div>
            <div className="text-sm text-gray-400">Total Salons</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{stats.totalBookings || 0}</div>
            <div className="text-sm text-gray-400">Total Bookings</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingSalons || 0}</div>
            <div className="text-sm text-gray-400">Pending Salons</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Salons */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="w-5 h-5" />
            Pending Salon Requests ({pendingSalons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSalons.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Store className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <div>No pending salon requests</div>
              <div className="text-sm mt-1">All salons have been reviewed</div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSalons.map((salon) => (
                <div key={salon._id} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{salon.salonName}</h3>
                      <p className="text-sm text-gray-400">{salon.ownerName}</p>
                      <p className="text-sm text-gray-400">{salon.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                          {salon.gender}
                        </Badge>
                        <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                          {salon.city}
                        </Badge>
                        <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                          {salon.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={fetchAllData} className="bg-blue-600 hover:bg-blue-700">
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
