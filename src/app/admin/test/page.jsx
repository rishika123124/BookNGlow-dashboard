'use client';

import { useState } from 'react';

export default function AdminTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@booknglow.com',
          password: 'admin123'
        })
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h1 className="text-white text-xl mb-4">Admin Login API Test</h1>
          
          <button
            onClick={testAPI}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Admin Login API'}
          </button>

          {result && (
            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-medium mb-2">API Response:</h3>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <a href="/admin/setup" className="text-purple-400 hover:text-purple-300 text-sm block">
              ← Admin Setup
            </a>
            <a href="/admin/login" className="text-purple-400 hover:text-purple-300 text-sm block">
              ← Admin Login
            </a>
            <a href="/" className="text-purple-400 hover:text-purple-300 text-sm block">
              ← Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
