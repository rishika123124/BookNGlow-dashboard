'use client';

import { useState, useEffect } from 'react';
import { Store, Search, Filter, Eye, Trash2, CheckCircle, XCircle, Crown, MapPin, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';
import { cn } from '@/lib/utils';

export default function AdminSalonManagement() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSection, setActiveSection] = useState('salons');

  useEffect(() => {
    fetchSalons();
  }, [currentPage, statusFilter, premiumFilter]);

  const fetchSalons = async () => {
    try {
      console.log('=== FETCHING SALONS ===');
      setLoading(true);
      
      // Check admin authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found');
        setLoading(false);
        return;
      }
      
      console.log('Admin token found:', adminToken);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(premiumFilter !== 'all' && { isPremium: premiumFilter === 'true' })
      });

      console.log('Fetching salons with params:', params.toString());
      const response = await fetch(`/api/admin/salons?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        setSalons(result.data || []);
        setTotalPages(result.pagination?.pages || 1);
        console.log('Salons loaded successfully:', result.data?.length || 0);
      } else {
        console.error('API Error:', result.message);
        setSalons([]);
      }
    } catch (error) {
      console.error('Salons fetch error:', error);
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSalonAction = async (salonId, action, data = {}) => {
    let confirmMessage = '';
    
    switch (action) {
      case 'approve':
        confirmMessage = 'Are you sure you want to approve this salon?';
        break;
      case 'reject':
        confirmMessage = 'Are you sure you want to reject this salon?';
        break;
      case 'block':
        confirmMessage = 'Are you sure you want to block this salon?';
        break;
      case 'unblock':
        confirmMessage = 'Are you sure you want to unblock this salon?';
        break;
      case 'togglePremium':
        confirmMessage = `Are you sure you want to ${data.isPremium ? 'make premium' : 'remove premium status from'} this salon?`;
        break;
      case 'delete':
        confirmMessage = 'Are you sure you want to delete this salon? This action cannot be undone.';
        break;
      default:
        confirmMessage = `Are you sure you want to ${action} this salon?`;
    }

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch('/api/admin/salons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId, action, data })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Salon action completed successfully!');
        fetchSalons(); // Refresh salons list
      } else {
        alert(result.message || 'Action failed');
      }
    } catch (error) {
      console.error('Salon action error:', error);
      alert('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'deleted':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredSalons = salons.filter(salon =>
    (salon.salonName || salon.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (salon.city && salon.state)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (salon.city + ', ' + salon.state)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Loading Salons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Salon Management</h1>
              <p className="text-gray-400">Manage all registered salons</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search salons by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="deleted">Deleted</option>
                  </select>
                  <select
                    value={premiumFilter}
                    onChange={(e) => setPremiumFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-lg"
                  >
                    <option value="all">All Types</option>
                    <option value="true">Premium</option>
                    <option value="false">Regular</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salons Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Store className="w-5 h-5 mr-2" />
                All Salons ({filteredSalons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
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
                    {filteredSalons.map((salon) => (
                      <tr key={salon._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        {/* Salon Name */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{salon.salonName || salon.name}</p>
                            {salon.isPremium && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        
                        {/* Salon Location */}
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
                        
                        {/* Contact Number */}
                        <td className="p-4">
                          <div className="flex items-center text-gray-300 text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {salon.phone}
                          </div>
                        </td>
                        
                        {/* Salon Type */}
                        <td className="p-4">
                          <Badge className={cn(
                            salon.gender === 'Female' ? 'bg-pink-600' :
                            salon.gender === 'Male' ? 'bg-blue-600' :
                            'bg-purple-600',
                            'text-white'
                          )}>
                            {salon.gender || 'Unisex'}
                          </Badge>
                        </td>
                        
                        {/* Join Date */}
                        <td className="p-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(salon.createdAt)}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="p-4">
                          <Badge className={`${getStatusColor(salon.status)} text-white`}>
                            {salon.status || 'pending'}
                          </Badge>
                        </td>
                        
                        {/* Action */}
                        <td className="p-4">
                          <div className="flex gap-2">
                            {salon.status === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                onClick={() => handleSalonAction(salon._id, 'block')}
                                title="Block Salon"
                              >
                                Block
                              </Button>
                            ) : salon.status === 'blocked' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                onClick={() => handleSalonAction(salon._id, 'unblock')}
                                title="Unblock Salon"
                              >
                                Unblock
                              </Button>
                            ) : salon.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                  onClick={() => handleSalonAction(salon._id, 'approve')}
                                  title="Approve Salon"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                  onClick={() => handleSalonAction(salon._id, 'reject')}
                                  title="Reject Salon"
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            ) : null}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
                              onClick={() => handleSalonAction(salon._id, 'delete')}
                              title="Delete Salon"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-400 text-sm">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
