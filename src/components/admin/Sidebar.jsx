'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Calendar, 
  MessageSquare, 
  Crown, 
  CheckCircle, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard'
  },
  {
    id: 'users',
    label: 'Users Management',
    icon: Users,
    href: '/admin/users'
  },
  {
    id: 'salons',
    label: 'Salon Management',
    icon: Store,
    href: '/admin/salons'
  },
  {
    id: 'approval',
    label: 'Salon Approval',
    icon: CheckCircle,
    href: '/admin/approval'
  },
  {
    id: 'bookings',
    label: 'Booking Management',
    icon: Calendar,
    href: '/admin/bookings'
  },
  {
    id: 'support',
    label: 'Support Messages',
    icon: MessageSquare,
    href: '/admin/support'
  },
  {
    id: 'premium',
    label: 'Premium Salons',
    icon: Crown,
    href: '/admin/premium'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }
];

export function Sidebar({ activeSection, setActiveSection }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-slate-700">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mr-3">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">BookNGlow</h1>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id || pathname === item.href;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
