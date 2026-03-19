'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SupportFormTest() {
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiResponse('');

    console.log('=== DEBUG SUPPORT FORM SUBMISSION ===');
    console.log('Form data:', { category, email, subject, message });

    try {
      // Test toast first
      console.log('Testing toast...');
      toast({
        title: "Test Toast",
        description: "This is a test toast message.",
      });
      console.log('Toast called successfully');

      // Test API call
      console.log('Making API call...');
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: email || 'test@example.com',
          phone: '9876543210',
          subject: `[${category || 'General'}] ${subject}`,
          message: `Category: ${category || 'General'}\n\n${message}\n\nContact Details:\nEmail: ${email || 'test@example.com'}`,
          category: category || 'General',
          subject,
          message,
          createdAt: new Date()
        }),
      });

      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response data:', result);
      setApiResponse(JSON.stringify(result, null, 2));

      if (result.success) {
        console.log('Submission successful, showing success toast...');
        toast({
          title: "Support Request Submitted",
          description: "Your support request has been sent successfully. Our team will respond soon.",
        });
        
        // Reset form
        setCategory('');
        setSubject('');
        setMessage('');
        setEmail('');
      } else {
        console.log('Submission failed, showing error toast...');
        toast({
          title: "Error",
          description: result.message || "Failed to submit support request. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setApiResponse('Error: ' + error.message);
      
      toast({
        title: "Error",
        description: error.message || "Failed to submit support request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testToastOnly = () => {
    console.log('Testing toast only...');
    toast({
      title: "Toast Test",
      description: "This is just a toast test to verify toast is working.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Support Form Debug Test</h1>
        
        {/* Toast Test Button */}
        <div className="mb-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Toast Test</h2>
          <button
            onClick={testToastOnly}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Test Toast Only
          </button>
        </div>

        {/* Support Form */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Support Form Test</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="">Select category</option>
                <option value="booking">Booking Issues</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Help</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
            </button>
          </form>
        </div>

        {/* API Response */}
        {apiResponse && (
          <div className="mt-8 p-4 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">API Response</h2>
            <pre className="bg-slate-900 p-4 rounded overflow-x-auto text-sm">
              {apiResponse}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>First click "Test Toast Only" to verify toast notifications are working</li>
            <li>Fill out the form fields (Category, Email, Subject, Message)</li>
            <li>Click "Submit Support Request"</li>
            <li>Check for toast notifications</li>
            <li>Check console logs for detailed debugging information</li>
            <li>Check API Response section for server response</li>
            <li>Check admin dashboard at /admin/support for new messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
