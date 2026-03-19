'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Database, Mail, Bell, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'BookNGlow',
    adminEmail: 'admin@booknglow.com',
    supportEmail: 'support@booknglow.com',
    maxBookingsPerDay: 50,
    autoApproveSalons: false,
    enableEmailNotifications: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('settings');

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="lg:ml-64">
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
              <p className="text-gray-400">Configure system settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Admin Email</label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Support Email</label>
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Booking Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Booking Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm">Max Bookings Per Day</label>
                  <Input
                    type="number"
                    value={settings.maxBookingsPerDay}
                    onChange={(e) => setSettings({...settings, maxBookingsPerDay: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Auto Approve Salons</span>
                  <button
                    onClick={() => setSettings({...settings, autoApproveSalons: !settings.autoApproveSalons})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoApproveSalons ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.autoApproveSalons ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Enable Email Notifications</span>
                  <button
                    onClick={() => setSettings({...settings, enableEmailNotifications: !settings.enableEmailNotifications})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.enableEmailNotifications ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.enableEmailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    Email service is configured with SMTP settings
                  </p>
                  <Badge className="bg-green-600 text-white mt-2">
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Maintenance Mode</span>
                  <button
                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                {settings.maintenanceMode && (
                  <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg">
                    <p className="text-red-400 text-sm">
                      ⚠️ Maintenance mode is enabled. Users cannot access the application.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
