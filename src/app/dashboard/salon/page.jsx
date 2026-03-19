'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, StatusIcon } from '@/components/ui/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  Scissors, 
  TrendingUp,
  Store,
  Phone,
  MapPin,
  Star,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail
} from 'lucide-react';

export default function SalonDashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useAuth();
  const [salonData, setSalonData] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    thisMonthBookings: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  
  // Add New Service State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    duration: ''
  });
  const [addingService, setAddingService] = useState(false);
  
  // Add New Offer State
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    discount: '',
    description: '',
    validDate: ''
  });
  const [addingOffer, setAddingOffer] = useState(false);

  useEffect(() => {
    console.log('Salon Dashboard - User:', user);
    console.log('Salon Dashboard - isUserLoading:', isUserLoading);
    console.log('Salon Dashboard - User role:', user?.role);
    console.log('Salon Dashboard - User type:', user?.type);
    
    // Only fetch data if user is authenticated and is a salon owner
    if (!isUserLoading && user && (user.role === 'salon' || user.type === 'salon')) {
      console.log('Salon Dashboard - User is salon owner, fetching data...');
      fetchSalonData();
      fetchAllBookings(); // Fetch all bookings instead of just pending
    } else if (!isUserLoading && (!user || (user.role !== 'salon' && user.type !== 'salon'))) {
      console.log('Salon Dashboard - User is not salon owner, redirecting...');
      // Redirect non-salon users away from salon dashboard
      router.push('/dashboard');
    }
    setLoading(false);
  }, [user, isUserLoading]);

  // Debug: Log booking data when it changes
  useEffect(() => {
    console.log('Bookings updated:', {
      total: bookingRequests.length + confirmedBookings.length,
      pending: bookingRequests.length,
      confirmed: confirmedBookings.length,
      sampleBooking: bookingRequests[0] || confirmedBookings[0]
    });
  }, [bookingRequests, confirmedBookings]);

  const fetchSalonData = async () => {
    try {
      const result = await api.getSalonProfile();
      
      if (result.success) {
        setSalonData(result.data);
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const salonResult = await api.getSalonProfile();
      
      if (salonResult.success && salonResult.data._id) {
        const bookingsResult = await api.getBookings(null, salonResult.data._id);
        
        if (bookingsResult.success) {
          const allBookings = bookingsResult.data;
          
          // Filter bookings by status
          const pendingBookings = allBookings
            .filter(booking => booking.status === 'pending')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          const confirmedBookings = allBookings
            .filter(booking => booking.status === 'confirmed')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          const cancelledBookings = allBookings
            .filter(booking => booking.status === 'cancelled')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          const completedBookings = allBookings
            .filter(booking => booking.status === 'completed')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          // Calculate stats
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          const thisMonthBookings = allBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          });
          
          // Calculate revenue (assuming confirmed bookings generate revenue)
          const monthlyRevenue = thisMonthBookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((total, booking) => {
              // Extract price from serviceDetails if available
              const price = booking.serviceDetails?.price || 
                           (typeof booking.serviceDetails === 'string' ? 
                            parseInt(booking.serviceDetails.match(/₹(\d+)/)?.[1] || 0) : 0);
              return total + price;
            }, 0);
          
          // Update all states
          setBookingRequests(pendingBookings);
          setConfirmedBookings(confirmedBookings);
          setCancelledBookings(cancelledBookings);
          setCompletedBookings(completedBookings);
          setStats({
            totalBookings: allBookings.length, // TRUE TOTAL: All bookings regardless of status
            thisMonthBookings: thisMonthBookings.length,
            monthlyRevenue: monthlyRevenue
          });
          
          console.log('Dashboard data updated:', {
            pending: pendingBookings.length,
            confirmed: confirmedBookings.length,
            cancelled: cancelledBookings.length,
            completed: completedBookings.length,
            total: allBookings.length,
            thisMonth: thisMonthBookings.length,
            revenue: monthlyRevenue
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    setUpdatingBooking(bookingId);
    
    try {
      const result = await api.updateBookingStatus(bookingId, action);

      if (result.success) {
        // RE-FETCH STRATEGY: Refresh all dashboard data for real-time sync
        console.log(`Booking ${action} successfully, re-fetching dashboard data...`);
        await fetchAllBookings(); // This will update all states and stats
        
        // Show success message
        if (action === 'confirmed') {
          toast.success('Booking confirmed successfully! Dashboard updated.');
        } else if (action === 'rejected') {
          toast.success('Booking rejected. Dashboard updated.');
        }
        
        console.log(`Booking ${action} and dashboard refreshed successfully`);
      } else {
        console.error('Failed to update booking:', result.message);
        toast.error(result.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error updating booking. Please try again.');
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Add New Service Function
  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      toast.error('Service name and price are required');
      return;
    }

    setAddingService(true);
    try {
      const result = await api.addSalonService({
        salonId: salonData?._id, // Pass the correct salon ID
        name: newService.name,
        price: parseFloat(newService.price),
        description: newService.description,
        duration: newService.duration || '30min' // Add duration
      });

      if (result.success) {
        toast.success('Service added successfully!');
        setNewService({ name: '', price: '', description: '', duration: '' });
        setShowServiceForm(false);
        
        // Refresh salon data to show new service
        await fetchSalonData();
      } else {
        toast.error(result.message || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Error adding service. Please try again.');
    } finally {
      setAddingService(false);
    }
  };

  // Add New Offer Function
  const handleAddOffer = async () => {
    if (!newOffer.title || !newOffer.discount) {
      toast.error('Offer title and discount are required');
      return;
    }

    console.log('=== ADDING OFFER ===');
    console.log('Offer data:', newOffer);

    setAddingOffer(true);
    try {
      const result = await api.addSalonOffer({
        salonId: salonData?._id, // Pass the correct salon ID
        title: newOffer.title,
        discount: parseFloat(newOffer.discount),
        description: newOffer.description,
        validDate: newOffer.validDate
      });

      console.log('API Response:', result);

      if (result.success) {
        toast.success('Offer added successfully!');
        setNewOffer({ title: '', discount: '', description: '', validDate: '' });
        setShowOfferForm(false);
        
        // Refresh salon data to show new offer
        await fetchSalonData();
      } else {
        toast.error(result.message || 'Failed to add offer');
      }
    } catch (error) {
      console.error('Error adding offer:', error);
      
      // More specific error handling
      if (error.message === 'Failed to fetch') {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('AbortError')) {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Error adding offer: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setAddingOffer(false);
    }
  };

  // Show loading state while checking authentication
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-pink-600" />
        <p className="mt-4 text-slate-600">Authenticating...</p>
      </div>
    );
  }

  // Show access denied if user is not a salon owner
  if (!isUserLoading && (!user || (user.role !== 'salon' && user.type !== 'salon'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-slate-600">This page is only accessible to salon owners.</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!salonData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">No salon data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="font-headline text-3xl md:text-5xl text-white mb-4">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{salonData.name}</span>
              </h1>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {salonData.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {salonData.location}
                </p>
                <p className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  {salonData.gender} Salon
                </p>
              </div>
            </div>
            
            {/* Salon Image */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[30px] md:rounded-[40px] overflow-hidden border-2 border-white/20">
                {salonData.serviceImages && salonData.serviceImages.length > 0 ? (
                  <img 
                    src={salonData.serviceImages[0]} 
                    alt={salonData.salonName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Store className="h-16 w-16 text-purple-400" />
                  </div>
                )}
              </div>
            </div>
            </div>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl md:text-3xl text-white">My Services</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              {salonData.services?.map((service, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{service.name}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                      <p className="text-gray-500 text-xs">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-purple-400">₹{service.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              onClick={() => setShowServiceForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </div>

          {/* Offers Section */}
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl md:text-3xl text-white">My Offers</h2>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              {salonData.offers?.map((offer, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                      <p className="text-gray-400 text-sm">{offer.description}</p>
                      <p className="text-gray-500 text-xs">Valid until: {offer.validUntil}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {offer.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              onClick={() => setShowOfferForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Offer
            </Button>
          </div>
        </div>

        {/* Booking Requests Section */}
        <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl md:text-3xl text-white flex items-center gap-3">
              <StatusIcon status="pending" size="lg" />
              Booking Requests ({bookingRequests.length})
            </h2>
          </div>
          
          {bookingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No pending booking requests</p>
              <p className="text-gray-500 text-sm mt-2">New booking requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookingRequests.map((booking) => (
                <div key={booking._id} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <StatusBadge status="pending" />
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg mb-2">{booking.service?.name || booking.serviceDetails?.name || 'Service'}</h3>
                          <div className="space-y-1">
                            <p className="text-purple-400 font-semibold text-xl">₹{booking.service?.price || booking.serviceDetails?.price || '0'}</p>
                            <p className="text-gray-400 text-sm">{booking.service?.time || booking.serviceDetails?.time || 'Duration not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-300">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium text-white">
                              {booking.customer?.name || 
                               `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 
                               'Customer'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{booking.customerEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleBookingAction(booking._id, 'confirmed')}
                        disabled={updatingBooking === booking._id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {updatingBooking === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookingAction(booking._id, 'rejected')}
                        disabled={updatingBooking === booking._id}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        {updatingBooking === booking._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed Bookings Section */}
        {confirmedBookings.length > 0 && (
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl md:text-3xl text-white flex items-center gap-3">
                <StatusIcon status="confirmed" size="lg" />
                Confirmed Bookings ({confirmedBookings.length})
              </h2>
            </div>
            <div className="space-y-4">
              {confirmedBookings.map((booking) => (
                <div key={booking._id} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status="confirmed" />
                        <div>
                          <span className="text-white font-medium">
                            {booking.customer?.name || 
                             `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 
                             booking.customerEmail || 
                             'Customer'}
                          </span>
                          {booking.customerEmail && (
                            <span className="text-gray-400 text-sm ml-2">
                              ({booking.customerEmail})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-300 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4" />
                          Service: {
                            Array.isArray(booking.serviceDetails) 
                              ? booking.serviceDetails.map(service => service.name || service).join(', ')
                              : booking.serviceDetails?.name || booking.serviceDetails || 'Service not specified'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Total</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.totalBookings}</h3>
            <p className="text-gray-300 font-medium">Total Bookings</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">This Month</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.thisMonthBookings}</h3>
            <p className="text-gray-300 font-medium">New Bookings</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Revenue</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">₹{stats.monthlyRevenue.toLocaleString()}</h3>
            <p className="text-gray-300 font-medium">Monthly Revenue</p>
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl md:text-3xl text-white flex items-center gap-3">
              <Calendar className="h-6 w-6 text-purple-400" />
              Booking Status Breakdown
            </h2>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Total: {stats.totalBookings}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status="pending" />
                <span className="text-orange-300 font-medium">Pending</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{bookingRequests.length}</h3>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status="confirmed" />
                <span className="text-green-300 font-medium">Confirmed</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{confirmedBookings.length}</h3>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status="cancelled" />
                <span className="text-red-300 font-medium">Cancelled</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{cancelledBookings.length}</h3>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon status="completed" />
                <span className="text-blue-300 font-medium">Completed</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{completedBookings.length}</h3>
            </div>
          </div>
        </div>
      </main>

      {/* Add New Service Dialog */}
      <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddService();
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Haircut, Massage, Facial"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Price (₹) *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 300"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Description (Optional)
                </label>
                <Textarea
                  placeholder="Describe your service..."
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Duration (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 30min, 1hr, 45min"
                  value={newService.duration || ''}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowServiceForm(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingService}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {addingService ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Service
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Offer Dialog */}
      <Dialog open={showOfferForm} onOpenChange={setShowOfferForm}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddOffer();
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offer Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Summer Sale, Weekend Special"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount (%) *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 20"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offer Description (Optional)
                </label>
                <Textarea
                  placeholder="Describe your offer..."
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valid Date (Optional)
                </label>
                <Input
                  type="date"
                  value={newOffer.validDate}
                  onChange={(e) => setNewOffer({...newOffer, validDate: e.target.value})}
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOfferForm(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingOffer}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {addingOffer ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Offer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
