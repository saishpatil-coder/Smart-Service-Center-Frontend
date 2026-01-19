import {
  CheckCircle2,
  Clock,
  Wrench,
  UserCheck,
  ClipboardList,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_STEPS = [
  {
    key: "PENDING",
    label: "Ticket Created",
    icon: ClipboardList,
    dateKey: "createdAt",
  },
  {
    key: "ACCEPTED",
    label: "Accepted by Center",
    icon: UserCheck,
    dateKey: "acceptedAt",
  },
  {
    key: "ASSIGNED",
    label: "Assigned to Mechanic",
    icon: Wrench,
    dateKey: "assignedAt",
  },
  {
    key: "IN_PROGRESS",
    label: "Work in Progress",
    icon: Clock,
    dateKey: "inProgressAt",
  },
  {
    key: "COMPLETED",
    label: "Successfully Resolved",
    icon: CheckCircle2,
    dateKey: "completedAt",
  },
];

export default function TicketTimeline({ ticket }) {
  const isCancelled = ticket.status === "CANCELLED";

  const steps = isCancelled
    ? [
        ALL_STEPS[0],
        {
          key: "CANCELLED",
          label: "Ticket Cancelled",
          icon: XCircle,
          dateKey: "completedAt",
        }, // Using completedAt as fallback
      ]
    : ALL_STEPS;

  const activeIndex = steps.findIndex((s) => s.key === ticket.status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-slate-900">Tracking Progress</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          ID: {ticket.id?.slice(-8)}
        </span>
      </div>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const date = ticket[step.dateKey];
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === steps.length - 1;

          // Determine State Colors
          let stateStyles = "text-slate-300 border-slate-100 bg-white"; // Future
          if (isCancelled && index === 1)
            stateStyles = "text-red-600 border-red-100 bg-red-50";
          else if (isCompleted)
            stateStyles = "text-emerald-600 border-emerald-100 bg-emerald-50";
          else if (isActive)
            stateStyles =
              "text-blue-600 border-blue-600 bg-white ring-4 ring-blue-50";

          return (
            <div key={step.key} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-4 top-8 w-[2px] h-[calc(100%-16px)] transition-colors duration-500",
                    isCompleted ? "bg-emerald-200" : "bg-slate-100"
                  )}
                />
              )}

              {/* Icon Bubble */}
              <div
                className={cn(
                  "relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  stateStyles
                )}
              >
                {isCompleted && !isCancelled ? (
                  <CheckCircle2
                    size={18}
                    fill="currentColor"
                    className="text-white"
                  />
                ) : (
                  <Icon size={16} />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-bold transition-colors",
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-slate-900"
                      : "text-slate-400"
                  )}
                >
                  {step.label}
                </p>

                {date && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs font-medium text-slate-400">
                      {new Date(date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                )}

                {isActive && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                    Currently Here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
