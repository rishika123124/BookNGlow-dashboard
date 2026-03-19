'use client';

import { useState } from 'react';

export default function SupportTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSupportAPI = async () => {
    setLoading(true);
    try {
      console.log('=== TESTING SUPPORT API ===');
      
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        subject: 'Test Support Message',
        message: 'This is a test support message from debug page.',
        category: 'Technical Support'
      };

      console.log('Sending test data:', testData);

      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAdminAPI = async () => {
    setLoading(true);
    try {
      console.log('=== TESTING ADMIN SUPPORT API ===');
      
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token found:', adminToken ? 'Yes' : 'No');

      const response = await fetch('/api/admin/support', {
        method: 'GET',
        headers: {
          'Authorization': adminToken ? `Bearer ${adminToken}` : '',
          'Content-Type': 'application/json',
        }
      });

      console.log('Admin response status:', response.status);

      const data = await response.json();
      console.log('Admin response data:', data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Admin test error:', error);
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Support API Debug</h1>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test User Support API</h2>
            <button
              onClick={testSupportAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              {loading ? 'Testing...' : 'Test Support Submission'}
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Admin Support API</h2>
            <button
              onClick={testAdminAPI}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
            >
              {loading ? 'Testing...' : 'Test Admin Support'}
            </button>
          </div>

          {result && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Result</h2>
              <pre className="bg-slate-900 p-4 rounded overflow-x-auto text-sm">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
