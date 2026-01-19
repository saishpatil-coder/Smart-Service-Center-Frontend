import { ArrowLeft } from 'lucide-react'
import React from 'react'

function TicketNavigation({router,id,isAdmin}) {
  return (
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {isAdmin ? "Back to Ticket Console" : "Back to Dashboard"}
        </button>
        <span className="text-xs text-slate-400 font-mono hidden md:block">
          Record ID: {id}
        </span>
      </div>
  )
}

export default TicketNavigation
