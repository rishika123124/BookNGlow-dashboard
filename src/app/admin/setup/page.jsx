'use client';

import { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetup() {
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup');
      const result = await response.json();

      if (result.success) {
        setAdminExists(result.adminExists);
      } else {
        setMessage('Failed to check admin status');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    setCreating(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        setAdminCredentials(result.admin);
        setAdminExists(true);
        setMessage('Admin created successfully!');
      } else {
        setMessage(result.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage('Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking admin status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-gray-400">BookNGlow Administration</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white text-center mb-6">
            {adminExists ? 'Admin User Exists' : 'Create Admin User'}
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('success') 
                ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {adminExists ? (
            <div className="space-y-4">
              {adminCredentials ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-500 font-medium">Admin Created Successfully!</span>
                  </div>
                  <div className="text-white space-y-2">
                    <p><span className="text-gray-400">Email:</span> {adminCredentials.email}</p>
                    <p><span className="text-gray-400">Password:</span> {adminCredentials.password}</p>
                  </div>
                  <p className="text-yellow-400 text-sm mt-2">
                    ⚠️ Save these credentials securely
                  </p>
                </div>
              ) : (
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-blue-500">Admin user already exists</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => window.location.href = '/admin/login'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Go to Admin Login
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Go to Main App
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-500">No admin user found</span>
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  Create an admin user to access admin dashboard
                </p>
              </div>

              <button
                onClick={createAdmin}
                disabled={creating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Admin...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Key className="w-4 h-4 mr-2" />
                    Create Admin User
                  </div>
                )}
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Go to Main App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
