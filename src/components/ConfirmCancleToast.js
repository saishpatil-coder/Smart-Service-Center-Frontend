import { toast } from "react-toastify";

export function confirmCancel(onConfirm) {
  toast(
    ({ closeToast }) => (
      <div className="space-y-3">
        <p className="font-medium text-gray-900">
          Are you sure you want to cancel this ticket?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={closeToast}
            className="px-3 py-1 text-sm rounded-md border"
          >
            No
          </button>

          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
}
