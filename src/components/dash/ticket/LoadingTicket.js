"use client";
import { Loader2 } from 'lucide-react';
import React from 'react'

function LoadingTicket() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-slate-50/50">
      <div className="relative flex items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600 relative z-10"
          size={48}
        />
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse opacity-50" />
      </div>
      <p className="text-slate-500 font-bold tracking-tight">
        Retrieving Service History...
      </p>
    </div>
  );
}

export default LoadingTicket
