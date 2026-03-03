'use client';

import { redirect } from 'next/navigation';

/**
 * The Dashboard page has been removed per user request.
 * Any attempts to access this route will now redirect to the home page.
 */
export default function DashboardPage() {
  redirect('/');
}
