"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Search, Loader2, MapPin, Star, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AISearchDialogNew({ open, onOpenChange }) {
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  // Dehradun locations
  const dehradunLocations = [
    'Rajpur Road',
    'Jakhan',
    'Ballupur',
    'Niranjanpur',
    'Clement Town',
    'Prem Nagar',
    'ISBT',
    'Patel Nagar',
    'niranjanpur dehradun'
  ];

  useEffect(() => {
    window.openAISearch = () => {
      onOpenChange(true);
    };
  }, [onOpenChange]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim() || !service.trim()) {
      setError('Please enter both location and service');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      console.log('=== AI SALON SEARCH ===');
      console.log('Location:', location);
      console.log('Service:', service);

      const response = await fetch(`/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(service)}`);

      const data = await response.json();
      console.log('Search response:', data);

      if (data.success) {
        console.log('API Response Data:', data.data);
        console.log('Salons array:', data.data.salons);
        console.log('Salons length:', data.data.salons.length);
        setSearchResults(data.data.salons);
        console.log(`Found ${data.data.totalResults} salons`);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search salons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return <>{stars}</>;
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'No services listed';
    return services.slice(0, 3).map(s => s.name).join(', ') + (services.length > 3 ? '...' : '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-slate-950 border-white/10 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-400" />
            AI Salon Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => {
                    console.log('Location selected:', e.target.value);
                    setLocation(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="" className="text-gray-400">Select location...</option>
                  {dehradunLocations.map((loc) => (
                    <option key={loc} value={loc} className="text-white bg-black">
                      {loc}
                    </option>
                  ))}
                </select>
                
                {/* Debug info */}
                <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                  <p className="text-gray-300">Available locations: {dehradunLocations.length}</p>
                  <p className="text-gray-300">Selected: "{location || 'None'}"</p>
                  <p className="text-gray-300">Last option: "niranjanpur dehradun"</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Service
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Haircut, Massage, Facial..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Salons...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Salons
                </>
              )}
            </Button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Found {searchResults.length} Salons
              </h3>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                {searchResults.map((salon) => (
                    <Card key={salon.id} className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white">{salon.salonName}</CardTitle>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-400">{salon.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              {renderStars(salon.rating)}
                              <span className="text-sm text-gray-400 ml-1">({salon.rating})</span>
                            </div>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {salon.matchReason}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Debug Info */}
                          <div className="p-2 bg-gray-800 rounded text-xs">
                            <p className="text-gray-300">Salon: {salon.salonName}</p>
                            <p className="text-gray-300">Matched Service: {salon.matchedService ? JSON.stringify(salon.matchedService) : 'NULL'}</p>
                            <p className="text-gray-300">Services Count: {salon.services?.length || 0}</p>
                          </div>
                          
                          {/* Salon Name */}
                          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-sm font-medium text-blue-300">Salon Name:</p>
                            <p className="text-lg font-semibold text-white">{salon.salonName}</p>
                          </div>
                          
                          {/* Matched Service with Price */}
                          {salon.matchedService ? (
                            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                              <p className="text-sm font-medium text-purple-300">Matched Service:</p>
                              <p className="text-lg font-semibold text-white">{salon.matchedService.name}</p>
                              <p className="text-xl font-bold text-green-400">₹{salon.matchedService.price || 'Not specified'}</p>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                              <p className="text-sm font-medium text-red-300">No Matched Service Found</p>
                              <p className="text-sm text-gray-400">Available Services:</p>
                              {salon.services && salon.services.length > 0 ? (
                                <ul className="text-xs text-gray-400 mt-1">
                                  {salon.services.slice(0, 3).map((service, idx) => (
                                    <li key={idx}>• {service.name} - ₹{service.price || 'N/A'}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-gray-400">No services listed</p>
                              )}
                            </div>
                          )}
                          
                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-1">{salon.location}</span>
                          </div>

                          {/* Contact Info */}
                          {salon.phone && (
                            <div className="flex items-center text-sm text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>{salon.phone}</span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => window.location.href = `/salons/${salon.id}`}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {!loading && searchResults.length === 0 && location && service && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Salons Found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or location
              </p>
            </div>
          )}

          {!location && !service && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Search for Salons</h3>
              <p className="text-gray-400">
                Enter a location and service to find salons
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
