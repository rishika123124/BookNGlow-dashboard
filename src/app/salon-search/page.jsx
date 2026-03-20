'use client';

import { useState } from 'react';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AISalonSearch from '@/components/AISalonSearch';

export default function SalonSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">BookNGlow</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-purple-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-purple-600">Salons</a>
              <a href="#" className="text-gray-700 hover:text-purple-600">Services</a>
              <a href="#" className="text-purple-600 font-medium">AI Search</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Salon Search
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect salon based on your location and specific services. 
            Our AI search matches you with the best salons in your area.
          </p>
        </div>

        {/* Search Trigger Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                Start Your Search
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Search for salons by location and services. Find haircuts, massages, facials, and more!
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Open AI Salon Search
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Search className="w-5 h-5 text-purple-600 mr-2" />
                Smart Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Search by salon name or specific services. Our AI finds the perfect match for your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                Location-Based
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find salons in your specific area. Get results tailored to your location preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Star className="w-5 h-5 text-purple-600 mr-2" />
                Rated Salons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                See ratings and reviews. Choose from the best-rated salons in your area.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Searches */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Searches
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Haircut',
              'Massage',
              'Facial',
              'Manicure',
              'Pedicure',
              'Hair Color',
              'Bridal',
              'Spa'
            ].map((search) => (
              <Button
                key={search}
                variant="outline"
                onClick={() => {
                  setIsModalOpen(true);
                  // You could pre-fill the search query here
                }}
                className="bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Salon Search Modal */}
      <AISalonSearch isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
