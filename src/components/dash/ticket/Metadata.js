import { Calendar, Tag, User, Wrench } from 'lucide-react';
import React from 'react'

function Metadata({ticket,isAdmin}) {
  return (
    <>
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <User size={18} className="text-blue-600" /> Stakeholders
          </h3>
          <MetaItem
            label="Client"
            value={ticket.client?.name}
            subValue={ticket.client?.email}
          />
          <MetaItem
            label="Technician"
            value={ticket.mechanic?.name || "Unassigned"}
          />
        </div>
      )}
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4">
          Service Metadata
        </h3>
        <MetaItem
          icon={<Tag className="text-blue-500" />}
          label="Service"
          value={ticket.serviceTitle || ticket.severityName}
        />
        <MetaItem
          icon={<Calendar className="text-purple-500" />}
          label="Logged Date"
          value={new Date(ticket.createdAt).toLocaleDateString("en-IN")}
        />
        <MetaItem
          icon={<Wrench className="text-slate-600" />}
          label="Ticket ID"
          value={ticket.id.slice(-8).toUpperCase()}
        />
      </div>
    </>
  );
}

export default Metadata

function MetaItem({ icon, label, value, subValue }) {
  return (
    <div className="flex items-center gap-5 group">
      {icon && <div className="p-4 bg-slate-50 rounded-[20px]">{icon}</div>}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-base font-black text-slate-900 leading-none">
          {value || "N/A"}
        </p>
        {subValue && (
          <p className="text-[10px] text-slate-500 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
}
