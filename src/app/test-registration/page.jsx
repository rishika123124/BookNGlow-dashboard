'use client';

import { useState } from 'react';

export default function TestRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testRegistration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create test salon data
      const formData = new FormData();
      formData.append('salonName', `TEST SALON ${Date.now()}`);
      formData.append('ownerName', 'Test Owner');
      formData.append('email', `test${Date.now()}@salon.com`);
      formData.append('phone', '9876543210');
      formData.append('address', '123 Test Street');
      formData.append('city', 'Dehradun');
      formData.append('state', 'Uttarakhand');
      formData.append('pincode', '248001');
      formData.append('serviceName', 'Haircut');
      formData.append('price', '300');
      formData.append('offers', 'Test discount');
      formData.append('phoneVerified', 'true');
      formData.append('gender', 'female');
      formData.append('salonType', 'female');
      formData.append('contactInfo', 'test@salon.com');
      formData.append('openingTime', '9:00 AM');
      formData.append('closingTime', '8:00 PM');

      console.log('=== TESTING SALON REGISTRATION ===');
      console.log('Sending registration request...');

      const response = await fetch('/api/register-salon', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Registration Response:', data);

      if (data.success) {
        setResult(data);
        console.log('✅ Registration successful!');
        console.log('Salon Name:', data.data.salonName);
        console.log('Status:', data.data.status);
        console.log('Active:', data.data.isActive);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminDashboard = async () => {
    try {
      console.log('=== CHECKING ADMIN DASHBOARD ===');
      const response = await fetch('/api/admin/salons');
      const data = await response.json();
      
      console.log('Admin Dashboard Response:', data);
      
      if (data.success) {
        const pending = data.data.filter(s => s.status === 'pending');
        console.log('Pending Salons in Admin:', pending.length);
        pending.forEach((salon, index) => {
          console.log(`${index + 1}. ${salon.salonName} - ${salon.email}`);
        });
      }
    } catch (error) {
      console.error('Admin dashboard check error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Test Salon Registration Flow</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Step 1: Test Registration</h2>
        <button 
          onClick={testRegistration}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Test Salon'}
        </button>
        
        <button 
          onClick={checkAdminDashboard}
          className="ml-4 px-6 py-3 bg-green-600 rounded font-semibold"
        >
          Check Admin Dashboard
        </button>
      </div>

      {result && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✅ Registration Successful!</h2>
          <div className="bg-slate-800 p-4 rounded">
            <p><strong>Salon Name:</strong> {result.data.salonName}</p>
            <p><strong>Owner:</strong> {result.data.ownerName}</p>
            <p><strong>Email:</strong> {result.data.email}</p>
            <p><strong>Status:</strong> {result.data.status}</p>
            <p><strong>Active:</strong> {result.data.isActive ? 'Yes' : 'No'}</p>
            <p><strong>Gender:</strong> {result.data.gender}</p>
            <p><strong>Type:</strong> {result.data.salonType}</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-900/30 rounded">
            <p className="text-yellow-300">
              <strong>Next Step:</strong> Go to <a href="/admin/approval" className="underline">Admin Approval Page</a> to see this salon in pending requests!
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">❌ Registration Failed</h2>
          <div className="bg-red-900/30 p-4 rounded">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-slate-800 rounded">
        <h3 className="font-semibold mb-2">Expected Workflow:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Register Test Salon" to simulate registration</li>
          <li>Salon gets saved with status = "pending"</li>
          <li>Click "Check Admin Dashboard" to verify it appears</li>
          <li>Go to <a href="/admin/approval" className="underline">Admin Approval Page</a> to see pending requests</li>
          <li>Approve the salon to make it visible in public app</li>
        </ol>
      </div>
    </div>
  );
}
