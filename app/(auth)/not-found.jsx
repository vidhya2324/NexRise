// File: app/not-found.js
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    if (countdown === 0) router.push('/');
    return () => clearInterval(timer);
  }, [countdown, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg"
          >
            Go Back
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-purple-900 rounded-lg hover:bg-opacity-90"
          >
            Return Home ({countdown}s)
          </button>
        </div>
      </div>
    </div>
  );
}