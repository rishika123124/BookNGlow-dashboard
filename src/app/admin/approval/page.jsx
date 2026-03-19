'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Store, Eye, Clock, AlertCircle, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';
import { cn } from '@/lib/utils';

export default function AdminSalonApproval() {
  const [pendingSalons, setPendingSalons] = useState([]);
  const [rejectedSalons, setRejectedSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('approval');
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingSalons();
    fetchRejectedSalons();
  }, []);

  const fetchPendingSalons = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch('/api/admin/salons', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const result = await response.json();

      if (result.success) {
        const pending = result.data.filter(salon => salon.status === 'pending');
        setPendingSalons(pending);
        console.log('=== PENDING SALONS DEBUG ===');
        console.log('Total Salons:', result.data.length);
        console.log('Pending Salons:', pending.length);
        console.log('Pending Data:', pending);
      } else {
        console.error('Failed to fetch pending salons:', result.message);
      }
    } catch (error) {
      console.error('Error fetching pending salons:', error);
    }
  };

  const fetchRejectedSalons = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch('/api/admin/salons', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const result = await response.json();

      if (result.success) {
        const rejected = result.data.filter(salon => salon.status === 'rejected');
        setRejectedSalons(rejected);
        console.log('=== REJECTED SALONS DEBUG ===');
        console.log('Rejected Salons:', rejected.length);
      }
    } catch (error) {
      console.error('Error fetching rejected salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (salonId) => {
    if (!confirm('Are you sure you want to approve this salon?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Admin authentication required');
        return;
      }

      const response = await fetch('/api/admin/salons', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ salonId, action: 'approve' })
      });

      const result = await response.json();

      if (result.success) {
        fetchPendingSalons(); // Refresh list
        fetchRejectedSalons();
        alert('Salon approved successfully!');
        console.log('=== SALON APPROVED ===');
        console.log('Approved Salon ID:', salonId);
      } else {
        alert(result.message || 'Approval failed');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Something went wrong');
    }
  };

  const handleReject = async (salonId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!confirm('Are you sure you want to reject this salon?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Admin authentication required');
        return;
      }

      const response = await fetch('/api/admin/salons', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ 
          salonId, 
          action: 'reject', 
          reason: rejectionReason
        })
      });

      const result = await response.json();

      if (result.success) {
        fetchPendingSalons(); // Refresh list
        fetchRejectedSalons();
        setRejectionReason('');
        setShowDetails(false);
        alert('Salon rejected successfully!');
        console.log('=== SALON REJECTED ===');
        console.log('Rejected Salon ID:', salonId);
        console.log('Rejection Reason:', rejectionReason);
      } else {
        alert(result.message || 'Rejection failed');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Something went wrong');
    }
  };

  const handleViewDetails = (salon) => {
    setSelectedSalon(salon);
    setShowDetails(true);
    setRejectionReason('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showSalonDetails = (salon) => {
    setSelectedSalon(salon);
    setShowDetails(true);
    setRejectionReason('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Loading Approval Requests...</p>
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
              <h1 className="text-2xl font-bold text-white">Salon Approval System</h1>
              <p className="text-gray-400">Review and manage salon registration requests</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-medium">
                {pendingSalons.length} Pending
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Pending Salons */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Pending Approval ({pendingSalons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSalons.length > 0 ? (
                <div className="space-y-4">
                  {pendingSalons.map((salon) => (
                    <div key={salon._id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-medium">{salon.name}</h3>
                            <Badge className="bg-yellow-500 text-white">
                              Pending
                            </Badge>
                            <Badge className={cn(
                              salon.salonType === 'Female' ? 'bg-pink-600' :
                              salon.salonType === 'Male' ? 'bg-blue-600' :
                              'bg-purple-600',
                              'text-white'
                            )}>
                              {salon.salonType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-2" />
                              {salon.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-2" />
                              {salon.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-2" />
                              {salon.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-2" />
                              Applied: {formatDate(salon.createdAt)}
                            </div>
                          </div>

                          {salon.services && salon.services.length > 0 && (
                            <div className="mt-3">
                              <p className="text-gray-400 text-sm mb-1">Services:</p>
                              <div className="flex flex-wrap gap-1">
                                {salon.services.slice(0, 3).map((service, index) => (
                                  <span key={index} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded">
                                    {service.name} - ₹{service.price}
                                  </span>
                                ))}
                                {salon.services.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-700 text-gray-400 text-xs rounded">
                                    +{salon.services.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            onClick={() => showSalonDetails(salon)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(salon._id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            onClick={() => showSalonDetails(salon)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-400">No pending salon approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Rejected */}
          {rejectedSalons.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                  Recently Rejected ({rejectedSalons.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rejectedSalons.map((salon) => (
                    <div key={salon._id} className="border border-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{salon.name}</h4>
                          <p className="text-gray-400 text-sm">{salon.email}</p>
                          {salon.rejectionReason && (
                            <p className="text-red-400 text-sm mt-1">
                              Reason: {salon.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-red-500 text-white text-xs">
                            Rejected
                          </Badge>
                          <p className="text-gray-500 text-xs mt-1">
                            {formatDate(salon.rejectedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Salon Details Modal */}
      {showDetails && selectedSalon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Salon Details</h2>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                onClick={() => setShowDetails(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium text-lg">{selectedSalon.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge className={cn(
                    selectedSalon.salonType === 'Female' ? 'bg-pink-600' :
                    selectedSalon.salonType === 'Male' ? 'bg-blue-600' :
                    'bg-purple-600',
                    'text-white'
                  )}>
                    {selectedSalon.salonType}
                  </Badge>
                  <Badge className="bg-yellow-500 text-white">
                    Pending
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Contact Information</p>
                  <p className="text-white">{selectedSalon.email}</p>
                  <p className="text-white">{selectedSalon.phone}</p>
                  <p className="text-white">{selectedSalon.location}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registration Details</p>
                  <p className="text-white">Applied: {formatDate(selectedSalon.createdAt)}</p>
                  <p className="text-white">Status: Pending</p>
                </div>
              </div>

              {selectedSalon.services && selectedSalon.services.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Services Offered</p>
                  <div className="space-y-2">
                    {selectedSalon.services.map((service, index) => (
                      <div key={index} className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-white font-medium">{service.name}</p>
                        <p className="text-gray-400 text-sm">₹{service.price} • {service.duration}</p>
                        {service.description && (
                          <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              <div>
                <label className="text-gray-400 text-sm">Rejection Reason (if rejecting)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 text-white rounded-lg resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleApprove(selectedSalon._id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Salon
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  onClick={() => handleReject(selectedSalon._id)}
                  disabled={!rejectionReason.trim()}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Salon
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
