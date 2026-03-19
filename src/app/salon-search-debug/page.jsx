'use client';

import { useState } from 'react';
import { Search, Sparkles, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AISalonSearchDebug from '@/components/AISalonSearchDebug';

export default function SalonSearchDebugPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Bug className="w-8 h-8 text-orange-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">BookNGlow Debug</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">Salons</a>
              <a href="#" className="text-orange-600 font-medium">AI Search Debug</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Salon Search - DEBUG MODE
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Debug version to test location dropdown functionality. 
            Check browser console (F12) for detailed logs.
          </p>
        </div>

        {/* Debug Trigger Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900 flex items-center justify-center">
                <Bug className="w-6 h-6 text-orange-600 mr-2" />
                Debug Location Dropdown
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Test the location dropdown with debug logging. 
                This will help identify why locations are not showing.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Bug className="w-5 h-5 mr-2" />
                Open Debug Modal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Debug Instructions */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Debug Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Step 1: Open Debug Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Click the "Open Debug Modal" button to open the debug version of the AI Salon Search.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Step 2: Check Console</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Open browser console (F12) and look for debug logs starting with "DEBUG:".
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Step 3: Test Dropdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Try to select a location from the dropdown. Check if locations appear in the dropdown.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Step 4: Check Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Look at the debug info box in the modal to see the locations array and selected value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expected Results */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Expected Results
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-800 mb-4">What Should Happen:</h4>
            <ul className="list-disc list-inside space-y-2 text-green-700">
              <li>Console should show: "=== DEBUG: AISalonSearch Component ==="</li>
              <li>Console should show: "dehradunLocations: [array with 9 locations]"</li>
              <li>Console should show: "Total locations: 9"</li>
              <li>Dropdown should show 9 location options</li>
              <li>Debug info box should show the locations array</li>
              <li>When you select a location, console should log the change</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debug Modal */}
      <AISalonSearchDebug isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
