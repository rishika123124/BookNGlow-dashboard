'use client';

import { useState, useEffect } from 'react';
import { Crown, Search, Star, TrendingUp, Store, Eye, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminPremiumManagement() {
  const [premiumSalons, setPremiumSalons] = useState([]);
  const [regularSalons, setRegularSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('premium');

  useEffect(() => {
    fetchPremiumSalons();
    fetchRegularSalons();
  }, []);

  const fetchPremiumSalons = async () => {
    try {
      const response = await fetch('/api/admin/salons?isPremium=true&limit=50');
      const result = await response.json();

      if (result.success) {
        setPremiumSalons(result.data);
      }
    } catch (error) {
      console.error('Premium salons fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegularSalons = async () => {
    try {
      const response = await fetch('/api/admin/salons?isPremium=false&limit=20');
      const result = await response.json();

      if (result.success) {
        setRegularSalons(result.data);
      }
    } catch (error) {
      console.error('Regular salons fetch error:', error);
    }
  };

  const togglePremiumStatus = async (salonId, currentStatus) => {
    const action = currentStatus ? 'remove premium status from' : 'make premium';
    
    if (!confirm(`Are you sure you want to ${action} this salon?`)) return;

    try {
      const response = await fetch('/api/admin/salons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          salonId, 
          action: 'togglePremium', 
          data: { isPremium: !currentStatus }
        })
      });

      const result = await response.json();

      if (result.success) {
        fetchPremiumSalons(); // Refresh lists
        fetchRegularSalons();
        alert(`Salon ${action} successfully!`);
      } else {
        alert(result.message || 'Action failed');
      }
    } catch (error) {
      console.error('Premium toggle error:', error);
      alert('Something went wrong');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Loading Premium Salons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="lg:ml-64">
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Premium Salon Management</h1>
              <p className="text-gray-400">Manage premium salon subscriptions and features</p>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-medium">
                {premiumSalons.length} Premium Salons
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Premium Salons */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Premium Salons ({premiumSalons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search premium salons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumSalons
                  .filter(salon => 
                    salon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    salon.location?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((salon) => (
                  <div key={salon._id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-600/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium flex items-center gap-2">
                          {salon.name}
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </h3>
                        <p className="text-gray-400 text-sm">{salon.location}</p>
                      </div>
                      <Badge className="bg-yellow-600 text-white">
                        Premium
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <Badge className={
                          salon.salonType === 'Female' ? 'bg-pink-600' :
                          salon.salonType === 'Male' ? 'bg-blue-600' : 'bg-purple-600'
                        }>
                          {salon.salonType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Services:</span>
                        <span className="text-white">{salon.services?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Since:</span>
                        <span className="text-white">{formatDate(salon.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex-1"
                        onClick={() => togglePremiumStatus(salon._id, true)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Remove Premium
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regular Salons (Candidates for Premium) */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-500" />
                Regular Salons ({regularSalons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularSalons.slice(0, 12).map((salon) => (
                  <div key={salon._id} className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:bg-slate-600/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{salon.name}</h3>
                        <p className="text-gray-400 text-sm">{salon.location}</p>
                      </div>
                      <Badge className="bg-blue-600 text-white">
                        Regular
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <Badge className={
                          salon.salonType === 'Female' ? 'bg-pink-600' :
                          salon.salonType === 'Male' ? 'bg-blue-600' : 'bg-purple-600'
                        }>
                          {salon.salonType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Services:</span>
                        <span className="text-white">{salon.services?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-white">{salon.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white flex-1"
                        onClick={() => togglePremiumStatus(salon._id, false)}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Make Premium
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {regularSalons.length > 12 && (
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Showing 12 of {regularSalons.length} regular salons
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
