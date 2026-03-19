'use client';

import { useState } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AISalonSearchDebug({ isOpen, onClose }) {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // Dehradun major areas - DEBUG VERSION
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

  console.log('=== DEBUG: AISalonSearch Component ===');
  console.log('dehradunLocations:', dehradunLocations);
  console.log('Total locations:', dehradunLocations.length);

  const handleSearch = async () => {
    if (!location || !searchQuery.trim()) {
      setError('Please select a location and enter a search query');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      console.log('=== DEBUG: Search Parameters ===');
      console.log('Location:', location);
      console.log('Search Query:', searchQuery);

      const response = await fetch(`/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(searchQuery)}`);

      const data = await response.json();
      console.log('DEBUG: Search response:', data);

      if (data.success) {
        console.log(`DEBUG: Found ${data.data.totalResults} salons`);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('DEBUG: Search error:', error);
      setError('Failed to search salons. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Salon Search - DEBUG</h2>
              <p className="text-gray-600 mt-1">Debug version with location logging</p>
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
                Location (DEBUG)
              </label>
              <select
                value={location}
                onChange={(e) => {
                  console.log('DEBUG: Location changed to:', e.target.value);
                  setLocation(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select location...</option>
                {dehradunLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              
              {/* DEBUG INFO */}
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <p className="font-bold">DEBUG INFO:</p>
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
                Search Salons (DEBUG)
              </>
            )}
          </Button>
        </div>

        {/* Debug Console */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Console</h3>
          <div className="bg-gray-100 p-4 rounded-lg text-sm">
            <p className="font-bold">Check browser console (F12) for debug logs</p>
            <p className="mt-2">Expected logs:</p>
            <ul className="list-disc list-inside mt-1">
              <li>=== DEBUG: AISalonSearch Component ===</li>
              <li>dehradunLocations: [array with 9 locations]</li>
              <li>Total locations: 9</li>
              <li>DEBUG: Location changed to: [selected value]</li>
              <li>DEBUG: Search Parameters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
