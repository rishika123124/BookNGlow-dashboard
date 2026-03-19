'use client';

export default function AdminDashboardSimple() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-400">1,247</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Total Salons</h2>
          <p className="text-3xl font-bold text-green-400">89</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold text-purple-400">17</p>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-400">Hair Cut - Divine Salon</p>
                <p className="text-sm text-gray-500">March 27, 2026 - 3:00 PM</p>
              </div>
              <span className="bg-green-600 px-3 py-1 rounded-full text-sm">Confirmed</span>
            </div>
          </div>
          
          <div className="bg-slate-700 p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-gray-400">Facial - Beauty Salon</p>
                <p className="text-sm text-gray-500">March 28, 2026 - 10:00 AM</p>
              </div>
              <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
