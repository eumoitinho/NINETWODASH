"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.push('/login');
      return;
    }

    // Redirect based on user role
    if (session.user.role === 'admin' || session.user.role === 'media_analyst') {
      router.push('/dashboard');
    } else {
      router.push(`/portal/${session.user.clientSlug}`);
    }
  }, [session, status, router]);

  // Loading screen while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <img 
            src="/ninetwo-logo.png" 
            alt="NINETWODASH" 
            className="h-16 mx-auto"
          />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <h5 className="text-xl font-semibold mb-2">NINETWODASH</h5>
        <p className="text-muted-foreground">
          {status === 'loading' ? 'Verificando autenticação...' : 'Redirecionando...'}
        </p>
      </div>
    </div>
  );
};

export default Page;