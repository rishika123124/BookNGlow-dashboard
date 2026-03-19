'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Eye, XCircle, CheckCircle, Clock, User, Store, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';
import { cn } from '@/lib/utils';

export default function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSection, setActiveSection] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      console.log('=== ADMIN BOOKINGS PAGE - FETCHING ===');
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        console.error('No admin token found in localStorage');
        setError('Please login to access bookings');
        return;
      }
      
      const url = statusFilter === 'all' 
        ? '/api/admin/bookings'
        : `/api/admin/bookings?status=${statusFilter}`;

      console.log('Fetching bookings from:', url);
      console.log('Using adminToken:', adminToken.substring(0, 20) + '...');

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const result = await response.json();
      console.log('Bookings API Response:', result);

      if (result.success) {
        setBookings(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
        console.log('Bookings loaded:', result.data.length);
        console.log('Stats:', result.stats);
        setError(null);
      } else {
        console.error('Bookings API Error:', result.message);
        console.error('Full error response:', result);
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      console.error('Error stack:', error.stack);
      setError('Network error while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action, reason = '') => {
    let confirmMessage = '';
    
    switch (action) {
      case 'cancel':
        confirmMessage = 'Are you sure you want to cancel this booking?';
        break;
      case 'confirm':
        confirmMessage = 'Are you sure you want to confirm this booking?';
        break;
      default:
        confirmMessage = `Are you sure you want to ${action} this booking?`;
    }

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: action, reason })
      });

      const result = await response.json();

      if (result.success) {
        fetchBookings(); // Refresh bookings list
        alert(`Booking ${action} successfully!`);
      } else {
        alert(result.message || 'Action failed');
      }
    } catch (error) {
      console.error('Booking action error:', error);
      alert('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
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

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const filteredBookings = bookings.filter(booking =>
    booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.salonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.serviceDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Loading Bookings...</p>
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
              <h1 className="text-2xl font-bold text-white">Booking Management</h1>
              <p className="text-gray-400">Manage all booking requests and appointments</p>
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
                      placeholder="Search bookings by customer, salon, or service..."
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
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                All Bookings ({filteredBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Salon</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Service</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Date & Time</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{booking.customerName}</p>
                            <p className="text-gray-400 text-sm">{booking.customerEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{booking.salonName}</p>
                            <p className="text-gray-400 text-sm">{booking.salonType}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-white">{booking.serviceName}</p>
                            <p className="text-gray-400 text-sm">₹{booking.servicePrice}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-white">{booking.bookingDate}</p>
                            <p className="text-gray-400 text-sm">{booking.bookingTime}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(booking.status)} text-white`}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                              onClick={() => showBookingDetails(booking)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleBookingAction(booking._id, 'confirm')}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                onClick={() => handleBookingAction(booking._id, 'cancel')}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            )}
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

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Booking Details</h2>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                onClick={() => setShowDetails(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              {/* Customer Information */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300">Name: <span className="text-white">{selectedBooking.customerName}</span></p>
                  <p className="text-gray-300">Email: <span className="text-white">{selectedBooking.customerEmail}</span></p>
                </div>
              </div>

              {/* Salon Information */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <Store className="w-4 h-4 mr-2" />
                  Salon Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300">Name: <span className="text-white">{selectedBooking.salonName}</span></p>
                  <p className="text-gray-300">Type: <span className="text-white">{selectedBooking.salonType}</span></p>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <p className="text-gray-300">Service: <span className="text-white">{selectedBooking.serviceName}</span></p>
                  <p className="text-gray-300">Price: <span className="text-white">₹{selectedBooking.servicePrice}</span></p>
                  <p className="text-gray-300">Duration: <span className="text-white">{selectedBooking.serviceDetails?.duration || 'N/A'}</span></p>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Booking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <p className="text-gray-300">Date: <span className="text-white">{selectedBooking.bookingDate}</span></p>
                  <p className="text-gray-300">Time: <span className="text-white">{selectedBooking.bookingTime}</span></p>
                  <p className="text-gray-300">Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedBooking.status)} text-white`}>{selectedBooking.status}</span></p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300">Created: <span className="text-white">{formatDate(selectedBooking.createdAt)}</span></p>
                  <p className="text-gray-300">Updated: <span className="text-white">{formatDate(selectedBooking.updatedAt)}</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleBookingAction(selectedBooking._id, 'confirm');
                        setShowDetails(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => {
                        handleBookingAction(selectedBooking._id, 'cancel');
                        setShowDetails(false);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </>
                )}
                {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'completed') && (
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
