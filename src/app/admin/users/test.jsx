'use client';

import { useState, useEffect } from 'react';
import { Users, Ban, Trash2 } from 'lucide-react';

export default function AdminUsersTest() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('=== TEST FETCH USERS ===');
      setLoading(true);
      const response = await fetch('/api/admin/users?limit=10');
      const result = await response.json();
      console.log('Test API Response:', result);

      if (result.success) {
        setUsers(result.data || []);
        console.log('Test Users loaded:', result.data?.length || 0);
      } else {
        console.error('Test API Error:', result.message);
      }
    } catch (error) {
      console.error('Test fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    if (!confirm('Block this user?')) return;
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'block' })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('User blocked successfully!');
        fetchUsers();
      } else {
        alert('Failed to block user');
      }
    } catch (error) {
      console.error('Block error:', error);
      alert('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          User Management Test
        </h1>
        
        <div className="mb-4">
          <p className="text-gray-400">Total Users: {users.length}</p>
        </div>

        {users.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No users found</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-700">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active' ? 'bg-green-600' : 
                        user.status === 'blocked' ? 'bg-red-600' : 
                        'bg-gray-600'
                      }`}>
                        {user.status || 'unknown'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center"
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            Block
                          </button>
                        ) : user.status === 'blocked' ? (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center"
                          >
                            Unblock
                          </button>
                        ) : null}
                        <button
                          onClick={() => alert('Delete functionality not implemented in test')}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
