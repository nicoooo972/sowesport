"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers la nouvelle page de map
    router.push('/tournaments-map');
  }, [router]);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Redirection vers la carte interactive...</p>
      </div>
    </div>
  );
} 