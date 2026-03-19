'use client';

import { useState } from 'react';
import { Search, Sparkles, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AISalonSearchNew from '@/components/AISalonSearchNew';

export default function SalonSearchNewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <RefreshCw className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">BookNGlow</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Salons</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#" className="text-blue-600 font-medium">AI Search (New)</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Salon Search - REBUILT
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completely rebuilt AI-powered salon search with fresh, clean code. 
            Find the perfect salon based on your location and specific services.
          </p>
        </div>

        {/* Search Trigger Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600 mr-2" />
                Rebuilt AI Salon Search
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Fresh implementation with hardcoded locations, 
                proper state management, and clean UI design.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Open Rebuilt AI Search
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Search className="w-5 h-5 text-blue-600 mr-2" />
                Fresh Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Completely rebuilt from scratch with clean, modern React code and proper state management.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                9 Dehradun Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All major areas of Dehradun hardcoded for immediate display without API dependencies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                Enhanced Debug Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Real-time status display shows locations count, selected value, and readiness state.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Improvements */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Rebuilt Improvements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Clean Code</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Fresh React component with proper hooks</li>
                  <li>No complex dynamic loading issues</li>
                  <li>Hardcoded locations for reliability</li>
                  <li>Clean state management</li>
                  <li>Proper error handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Better UX</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Status display showing current state</li>
                  <li>Console logging for debugging</li>
                  <li>Loading states with spinners</li>
                  <li>Professional card design</li>
                  <li>Responsive layout</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Testing Instructions
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-800 mb-4">How to Test:</h4>
            <ol className="list-decimal list-inside space-y-3 text-green-700">
              <li>Go to: <code className="bg-green-100 px-2 py-1 rounded">http://localhost:3000/salon-search-new</code></li>
              <li>Click: <strong>"Open Rebuilt AI Search"</strong> button</li>
              <li>Check: Location dropdown shows all 9 Dehradun areas</li>
              <li>Check: Status display shows current state</li>
              <li>Select: Any location (e.g., "niranjanpur dehradun")</li>
              <li>Enter: Search query (e.g., "hair")</li>
              <li>Click: <strong>"Search Salons"</strong> button</li>
              <li>Expected: Results or proper "No salons found" message</li>
            </ol>
            
            <div className="mt-4 p-4 bg-green-100 rounded">
              <p className="text-green-800 font-semibold">Expected Console Logs:</p>
              <code className="text-sm text-green-700 block mt-2">
                <strong>=== AI SALON SEARCH - REBUILT ===</strong><br/>
                <strong>Locations available: 9</strong><br/>
                <strong>Location selected: [your selection]</strong><br/>
                <strong>=== SEARCHING SALONS ===</strong><br/>
                <strong>Found X salons</strong>
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Rebuilt AI Salon Search Modal */}
      <AISalonSearchNew isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
