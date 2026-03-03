
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Both login and signup are handled by the unified /login page
    router.replace('/login');
  }, [router]);

  return null;
}
