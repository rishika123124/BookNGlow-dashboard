'use client';

export default function AdminTestSimple() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Admin Dashboard Test</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-gray-300 mb-4">This is a simple test to check if the admin dashboard is working.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">150</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Total Salons</h3>
            <p className="text-3xl font-bold text-green-400">25</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-purple-400">17</p>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              View Users
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              View Salons
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
