import {
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  UserCheck,
  ClipboardList,
} from "lucide-react";

const ALL_STEPS = [
  {
    key: "PENDING",
    label: "Ticket Created",
    icon: ClipboardList,
    dateKey: "createdAt",
  },
  {
    key: "ACCEPTED",
    label: "Accepted by Service Center",
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
    label: "Completed",
    icon: CheckCircle,
    dateKey: "completedAt",
  },
];

export default function TicketTimeline({ ticket }) {
  const isCancelled = ticket.status === "CANCELLED";
  const canceledAt = ticket['completedAt']

  const steps = isCancelled
    ? [
        ALL_STEPS[0],
        {
          key: "CANCELLED",
          label: "Cancelled",
          icon: XCircle,
          dateKey: "cancelledAt", // ✅ FIX
        },
      ]
    : ALL_STEPS;

  const activeIndex = steps.findIndex((step) => step.key === ticket.status);

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold text-gray-800 mb-6">Ticket Timeline</h3>

      <ol className="relative border-l border-gray-200 ml-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const date = ticket[step.dateKey];
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          let iconStyle = "bg-gray-100 border-gray-300 text-gray-400";

          if (isCancelled) {
            iconStyle = "bg-red-50 border-red-300 text-red-600";
          } else if (isCompleted) {
            iconStyle = "bg-green-50 border-green-300 text-green-600";
          } else if (isActive) {
            iconStyle = "bg-blue-50 border-blue-300 text-blue-600";
          }

          return (
            <li key={step.key} className="mb-7 ml-6 last:mb-0">
              <span
                className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full border ${iconStyle}`}
              >
                <Icon size={14} />
              </span>

              <div>
                <p
                  className={`text-sm ${
                    isCompleted || isActive
                      ? "font-semibold text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {/* ✅ Date shown correctly */}
                {date && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(date).toLocaleString()}
                  </p>
                )}

                {isCancelled && (
                  <p className="text-xs mt-1 text-red-600">
                    {new Date(canceledAt).toLocaleString()}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
