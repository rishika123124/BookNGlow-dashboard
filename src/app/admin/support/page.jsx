'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Search, CheckCircle, XCircle, Mail, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminSupportMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSection, setActiveSection] = useState('support');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter]);

  const fetchMessages = async () => {
    try {
      console.log('=== FETCHING SUPPORT MESSAGES ===');
      setLoading(true);
      
      // Check admin authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found');
        setLoading(false);
        return;
      }
      
      console.log('Admin token found for support messages');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      console.log('Fetching support messages with params:', params.toString());
      const response = await fetch(`/api/admin/support?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Support messages response status:', response.status);
      const result = await response.json();
      console.log('Support messages API Response:', result);

      if (result.success) {
        setMessages(result.data || []);
        setTotalPages(result.pagination?.pages || 1);
        console.log('Support messages loaded successfully:', result.data?.length || 0);
      } else {
        console.error('Support messages API Error:', result.message);
        setMessages([]);
      }
    } catch (error) {
      console.error('Support messages fetch error:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageAction = async (messageId, action) => {
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, action })
      });

      const result = await response.json();

      if (result.success) {
        fetchMessages(); // Refresh messages
        alert(`Message ${action} successfully!`);
      } else {
        alert(result.message || 'Action failed');
      }
    } catch (error) {
      console.error('Message action error:', error);
      alert('Something went wrong');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/support?messageId=${messageId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        fetchMessages(); // Refresh messages
        alert('Message deleted successfully!');
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Message delete error:', error);
      alert('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Loading Support Messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="lg:ml-64">
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Support Messages</h1>
              <p className="text-gray-400">Manage customer support requests</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Support Messages ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">{message.subject}</h3>
                          <Badge className={`${getStatusColor(message.status)} text-white`}>
                            {message.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-2" />
                            {message.name} ({message.email})
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-2" />
                            {formatDate(message.createdAt)}
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm line-clamp-2">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          onClick={() => showMessageDetails(message)}
                        >
                          View
                        </Button>
                        {message.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleMessageAction(message._id, 'resolve')}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => deleteMessage(message._id)}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message Details Modal */}
      {showDetails && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                onClick={() => setShowDetails(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">{selectedMessage.subject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300">From: <span className="text-white">{selectedMessage.name}</span></p>
                  <p className="text-gray-300">Email: <span className="text-white">{selectedMessage.email}</span></p>
                  <p className="text-gray-300">Phone: <span className="text-white">{selectedMessage.phone || 'Not provided'}</span></p>
                  <p className="text-gray-300">Date: <span className="text-white">{formatDate(selectedMessage.createdAt)}</span></p>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Message</h4>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedMessage.status === 'pending' && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleMessageAction(selectedMessage._id, 'resolve');
                      setShowDetails(false);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
