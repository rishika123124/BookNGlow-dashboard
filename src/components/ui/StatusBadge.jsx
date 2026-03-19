'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

// Centralized status badge styles to ensure consistency across the dashboard
const statusStyles = {
  pending: {
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: Clock,
    label: 'Pending'
  },
  confirmed: {
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
    label: 'Confirmed'
  },
  cancelled: {
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
    label: 'Cancelled'
  },
  completed: {
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: CheckCircle,
    label: 'Completed'
  },
  rejected: {
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
    label: 'Rejected'
  }
};

export function StatusBadge({ status, showIcon = false, size = 'sm' }) {
  const statusConfig = statusStyles[status?.toLowerCase()] || statusStyles.pending;
  const Icon = statusConfig.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };
  
  return (
    <Badge className={`${statusConfig.className} ${sizeClasses[size] || sizeClasses.sm}`}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {statusConfig.label}
    </Badge>
  );
}

export function StatusIcon({ status, size = 'sm' }) {
  const statusConfig = statusStyles[status?.toLowerCase()] || statusStyles.pending;
  const Icon = statusConfig.icon;
  
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return (
    <Icon className={`${sizeClasses[size] || sizeClasses.sm} ${statusConfig.className.replace(/bg-|border-/, 'text-').replace(/\/\d+/, '')}`} />
  );
}

// Export status styles for use in other components if needed
export { statusStyles };
