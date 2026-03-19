'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Clock, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AISalonSearch({ isOpen, onClose }) {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  // Hardcoded locations for immediate fix
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

  console.log('=== AISALONSEARCH COMPONENT ===');
  console.log('Hardcoded locations:', dehradunLocations);
  console.log('Total locations:', dehradunLocations.length);

  const loadLocations = async () => {
    if (availableLocations.length > 0) return; // Already loaded
    
    setLoadingLocations(true);
    try {
      console.log('=== LOADING SALON LOCATIONS ===');
      const response = await fetch('/api/salons');
      const data = await response.json();
      console.log('Salons response:', data);
      
      if (data.success && data.data) {
        // Extract unique locations from salons
        const locations = [...new Set(data.data.map(salon => salon.location).filter(loc => loc))];
        console.log('Available locations:', locations);
        setAvailableLocations(locations);
      } else {
        // Fallback to Dehradun locations if API fails
        const fallbackLocations = [
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
        console.log('Using fallback locations:', fallbackLocations);
        setAvailableLocations(fallbackLocations);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback to Dehradun locations on error
      const fallbackLocations = [
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
      console.log('Using fallback locations due to error:', fallbackLocations);
      setAvailableLocations(fallbackLocations);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLocations();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!location || !searchQuery.trim()) {
      setError('Please select a location and enter a search query');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      console.log('=== AI SALON SEARCH ===');
      console.log('Searching for:', { location, searchQuery });

      const response = await fetch(`/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(searchQuery)}`);

      const data = await response.json();
      console.log('Search response:', data);

      if (data.success) {
        setSearchResults(data.data.salons);
        console.log(`Found ${data.data.totalResults} salons`);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search salons. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'No services listed';
    return services.slice(0, 3).map(s => s.name).join(', ') + (services.length > 3 ? '...' : '');
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
    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Salon Search</h2>
              <p className="text-gray-600 mt-1">Find the perfect salon for your needs</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => {
                  console.log('Location changed to:', e.target.value);
                  setLocation(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 relative z-50"
              >
                <option value="">Select location...</option>
                {dehradunLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              
              {/* Debug info */}
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <p className="font-bold">DEBUG:</p>
                <p>Total locations: {dehradunLocations.length}</p>
                <p>Selected: "{location}"</p>
                <p>Locations: {JSON.stringify(dehradunLocations)}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Salons or Services
              </label>
              <Input
                type="text"
                placeholder="e.g., Haircut, Massage, Facial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full mt-4"
          >
            {isSearching ? (
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
        </div>

        {/* Search Results */}
        <div className="p-6">
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Found {searchResults.length} Salons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((salon) => (
                  <Card key={salon.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{salon.salonName}</CardTitle>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{salon.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            {renderStars(salon.rating)}
                            <span className="text-sm text-gray-600 ml-1">({salon.rating})</span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {salon.matchReason}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Services:</p>
                          <p className="text-sm text-gray-600">{formatServices(salon.services)}</p>
                        </div>
                        
                        {salon.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {salon.phone}
                          </div>
                        )}
                        
                        {salon.address && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Address:</p>
                            <p>{salon.address}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            Book Appointment
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && location && searchQuery && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Salons Found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or location
              </p>
            </div>
          )}

          {!location && !searchQuery && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Salons</h3>
              <p className="text-gray-600">
                Enter a location and search term to find salons
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
