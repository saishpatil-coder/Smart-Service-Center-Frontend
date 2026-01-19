"use client";
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

function TicketNotFound() {
    const router = useRouter();
  return (
    <div className="max-w-md mx-auto mt-32 text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
      <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={32} className="text-red-600" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">
        Ticket not found
      </h2>
      <p className="text-slate-500 mb-8">
        This record might have been archived or deleted.
      </p>
      <button
        onClick={() => router.back()}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
      >
        Go Back
      </button>
    </div>
  );
}

export default TicketNotFound
