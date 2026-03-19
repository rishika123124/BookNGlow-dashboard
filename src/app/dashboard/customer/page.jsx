'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { Footer } from '@/components/dashboard/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, StatusIcon } from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  Store,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isUserLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Customer Dashboard - User:', user);
    console.log('Customer Dashboard - isUserLoading:', isUserLoading);
    console.log('Customer Dashboard - User role:', user?.role);
    console.log('Customer Dashboard - User type:', user?.type);
    
    // Only fetch data if user is authenticated and is a customer
    if (!isUserLoading) {
      if (user && (user.role === 'customer' || user.type === 'customer')) {
        console.log('Customer Dashboard - User is customer, fetching bookings...');
        fetchBookings();
      } else if (!user) {
        console.log('Customer Dashboard - No user found, redirecting to login...');
        router.push('/login');
      } else {
        console.log('Customer Dashboard - User is not customer, redirecting to salon dashboard...');
        router.push('/dashboard/salon');
      }
      setLoading(false);
    }
  }, [user, isUserLoading]);

  const fetchBookings = async () => {
    try {
      console.log('Customer Dashboard - Fetching bookings for user:', user.id);
      const result = await api.getBookings(user.id, null);
      
      if (result.success) {
        console.log('Customer Dashboard - Bookings fetched:', result.data);
        setBookings(result.data);
      } else {
        console.error('Customer Dashboard - Failed to fetch bookings:', result.message);
        toast.error(result.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Customer Dashboard - Error fetching bookings:', error);
      toast.error('Error fetching bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      console.log('Cancel booking attempt:', bookingId);
      toast.loading('Cancelling booking...');
      
      const result = await api.updateBookingStatus(bookingId, 'cancelled');
      console.log('Cancel API result:', result);
      
      toast.dismiss();
      
      if (result.success) {
        toast.success('Booking cancelled successfully');
        // Refresh bookings to show updated status
        fetchBookings();
      } else {
        console.error('Cancel API error:', result);
        toast.error(result.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Error cancelling booking');
    }
  };

  const handleRescheduleBooking = async (bookingId) => {
    try {
      toast.loading('Opening reschedule options...');
      // TODO: Implement reschedule modal or navigation
      toast.dismiss();
      toast.success('Reschedule feature coming soon!');
    } catch (error) {
      toast.error('Error opening reschedule options');
      console.error('Reschedule error:', error);
    }
  };

  // FRONTEND CANCELLATION POLICY: Helper function to check if cancellation is allowed
  const isCancellationAllowed = (bookingDate, bookingTime, bookingStatus) => {
    console.log('isCancellationAllowed called with:', { bookingDate, bookingTime, bookingStatus });
    
    // NULL-SAFE: Check if booking status exists and is valid
    if (!bookingStatus) {
      console.log('Cancellation not allowed: missing booking status');
      return false;
    }
    
    // Don't allow cancellation if booking is already cancelled or completed
    if (bookingStatus === 'cancelled' || bookingStatus === 'completed') {
      console.log('Cancellation not allowed: booking is cancelled or completed');
      return false;
    }

    // Only allow cancellation for confirmed or pending bookings
    if (!['confirmed', 'pending'].includes(bookingStatus)) {
      console.log('Cancellation not allowed: invalid booking status:', bookingStatus);
      return false;
    }

    // NULL-SAFE: Check if booking date and time exist
    if (!bookingDate || !bookingTime) {
      console.log('Cancellation not allowed: missing booking date or time');
      return false;
    }

    try {
      // NULL-SAFE: Handle different date formats (ISO string vs regular date string)
      let appointmentDateTime;
      
      // Check if bookingDate is in ISO format (contains 'T' and 'Z')
      if (bookingDate.toString().includes('T')) {
        // ISO format: Extract just the date part and combine with time
        const datePart = bookingDate.toString().split('T')[0]; // Get YYYY-MM-DD
        appointmentDateTime = new Date(`${datePart} ${bookingTime}`);
      } else {
        // Regular format: Use as-is
        const dateStr = bookingDate.toString().trim();
        const timeStr = bookingTime.toString().trim();
        appointmentDateTime = new Date(`${dateStr} ${timeStr}`);
      }
      
      // NULL-SAFE: Check if the created date is valid
      if (isNaN(appointmentDateTime.getTime())) {
        console.log('Cancellation not allowed: invalid date/time format', { 
          bookingDate, 
          bookingTime,
          appointmentDateTime: appointmentDateTime.toString()
        });
        return false;
      }

      const currentTime = new Date();
      const timeDifference = appointmentDateTime - currentTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours

      console.log('Time calculation:', {
        appointmentDateTime: appointmentDateTime.toISOString(),
        currentTime: currentTime.toISOString(),
        timeDifference: timeDifference,
        hoursDifference: hoursDifference
      });

      // Allow cancellation only if appointment is more than 2 hours away
      const allowed = hoursDifference >= 2;
      console.log('Cancellation allowed:', allowed, '(hoursDifference >= 2)');
      return allowed;
    } catch (error) {
      console.error('Error in isCancellationAllowed:', error);
      console.log('Returning false due to error');
      return false; // Always return false on error instead of crashing
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  // Show access denied if user is not a customer
  if (!isUserLoading && (!user || (user.role !== 'customer' && user.type !== 'customer'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-slate-600">This page is only accessible to customers.</p>
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
        <div className="text-white">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl md:text-5xl text-white mb-4">
            Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg">Manage your bookings and discover new salons</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Total</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">{bookings.length}</h3>
            <p className="text-gray-300 font-medium">Total Bookings</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Upcoming</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
            </h3>
            <p className="text-gray-300 font-medium">Upcoming Appointments</p>
          </div>
          
          <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 rounded-[30px] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {bookings.filter(b => b.status === 'completed').length}
            </h3>
            <p className="text-gray-300 font-medium">Completed Services</p>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="relative bg-slate-900/40 backdrop-blur-lg p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10">
          <h2 className="font-headline text-2xl md:text-3xl text-white mb-6">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No bookings yet</p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              >
                Explore Salons
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Side - Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white text-lg">{booking.salon?.salonName || booking.salon?.name || booking.salonName || 'Salon'}</h3>
                        <StatusBadge status={booking.status} showIcon={true} />
                      </div>
                      
                      {/* Service Name Display */}
                      <div className="mb-2">
                        <span className="text-sm text-purple-300 font-medium">
                          Service: {
                            Array.isArray(booking.serviceDetails) 
                              ? booking.serviceDetails.map(service => service.name || service).join(', ')
                              : booking.serviceDetails?.name || booking.serviceDetails || 'Service not specified'
                          }
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {booking.salon?.location || booking.salon?.area || booking.location || 'Location not available'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {booking.salon?.contactInfo || booking.salon?.phone || booking.contactInfo || 'Contact not available'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Action Buttons */}
                    <div className="flex gap-2">
                      {/* Cancel Button - Only show if cancellation is allowed */}
                      {(() => {
                        const allowed = isCancellationAllowed(booking.date, booking.time, booking.status);
                        console.log('isCancellationAllowed result:', allowed, 'for booking:', booking);
                        return allowed;
                      })() ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                          className="opacity-50 cursor-not-allowed"
                          title={
                            booking.status === 'cancelled' || booking.status === 'completed'
                              ? 'Cannot cancel completed/cancelled bookings'
                              : 'Cancellations not allowed within 2 hours of appointment'
                          }
                        >
                          Cancel
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRescheduleBooking(booking._id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Explore More Section */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
          >
            Explore More Salons
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
