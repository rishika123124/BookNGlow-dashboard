// API helper functions for authenticated requests

// Get token from localStorage first, then cookies as fallback
export const getToken = () => {
  if (typeof window !== 'undefined') {
    // First try localStorage (for frontend access)
    const localStorageToken = localStorage.getItem('auth-token');
    if (localStorageToken) {
      console.log('Found token in localStorage:', localStorageToken);
      return localStorageToken;
    }
    
    // Fallback to cookies (for server-side access)
    console.log('No token in localStorage, checking cookies...');
    const cookies = document.cookie.split(';');
    console.log('All cookies:', document.cookie);
    console.log('Split cookies:', cookies);
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    console.log('Found auth cookie:', authCookie);
    const token = authCookie ? authCookie.split('=')[1] : null;
    console.log('Extracted token from cookie:', token);
    return token;
  }
  console.log('Window is undefined, returning null token');
  return null;
};

// Create authenticated fetch wrapper
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  console.log('AuthenticatedFetch - URL:', url);
  console.log('AuthenticatedFetch - Token exists:', !!token);
  console.log('AuthenticatedFetch - Token value:', token ? token.substring(0, 20) + '...' : 'null');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  console.log('AuthenticatedFetch - Request headers:', defaultOptions.headers);

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // Try to get more detailed error information from the response
      let errorDetails = `HTTP error! status: ${response.status}`;
      
      try {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        
        // Try to parse as JSON first
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorDetails = errorJson.message;
          }
          if (errorJson.details) {
            errorDetails += ` - ${errorJson.details}`;
          }
        } catch (jsonError) {
          // If not JSON, use the text response
          if (errorText && errorText.length > 0 && errorText.length < 500) {
            errorDetails = `Server error: ${errorText}`;
          }
        }
      } catch (textError) {
        console.error('Could not read error response:', textError);
      }
      
      throw new Error(errorDetails);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    // Add more specific error logging
    if (error.message === 'Failed to fetch') {
      console.error('Network error - Could not reach server');
    } else if (error.message.includes('AbortError')) {
      console.error('Request was aborted or timed out');
    } else if (error.message.includes('TypeError')) {
      console.error('Type error - possibly invalid JSON or response');
    }
    
    throw error;
  }
};

// Specific API functions
export const api = {
  // Bookings API
  getBookings: (userId, salonId) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (salonId) params.append('salonId', salonId);
    
    return authenticatedFetch(`/api/bookings?${params.toString()}`);
  },
  
  createBooking: (bookingData) => {
    return authenticatedFetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },
  
  updateBookingStatus: (bookingId, status) => {
    console.log('API: updateBookingStatus called with:', { bookingId, status });
    const result = authenticatedFetch('/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ bookingId, status })
    });
    console.log('API: updateBookingStatus request sent');
    return result;
  },

  // Salon API
  getSalonProfile: () => {
    return authenticatedFetch('/api/salons/profile');
  },
  
  getSalonById: (salonId) => {
    return authenticatedFetch(`/api/salons/${salonId}`);
  },

  // User API
  getUserProfile: () => {
    return authenticatedFetch('/api/auth/user/profile');
  },

  // Add Salon Service
  addSalonService: (serviceData) => {
    console.log('=== API ADD SALON SERVICE ===');
    console.log('Service data being sent:', serviceData);
    
    return authenticatedFetch('/api/salons/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    }).catch(error => {
      console.error('Add Salon Service API Error:', error);
      throw error;
    });
  },

  // Add Salon Offer
  addSalonOffer: (offerData) => {
    console.log('=== API ADD SALON OFFER ===');
    console.log('Offer data being sent:', offerData);
    
    return authenticatedFetch('/api/salons/offers', {
      method: 'POST',
      body: JSON.stringify(offerData)
    }).catch(error => {
      console.error('Add Salon Offer API Error:', error);
      throw error;
    });
  }
};
