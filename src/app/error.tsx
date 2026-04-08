'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

const m = motion as any;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Root Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 font-outfit">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] border border-surface-200 p-12 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-8">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-4xl font-black text-surface-950 mb-4 uppercase tracking-tighter">
          VIBE <span className="text-brand-600">INTERRUPTED</span>
        </h1>
        
        <p className="text-surface-500 font-medium mb-10 leading-relaxed">
          We encountered a synchronization error while fetching the latest collections. Let's try to restore the connection.
        </p>

        <div className="grid gap-4">
          <button
            onClick={() => reset()}
            className="vibez-button w-full"
          >
            <RefreshCw size={18} /> RESTORE CONNECTION
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-brand-600 transition-colors py-4"
          >
            <Home size={14} /> Back to Base
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-100">
          <p className="text-[8px] font-mono text-surface-300 uppercase tracking-widest">
            Error Digest: {error.digest || 'Unknown Identity'}
          </p>
        </div>
      </m.div>
    </div>
  );
}
