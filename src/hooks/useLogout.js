import { deleteFCMToken, logout } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  // You can pass setUser here, or get it from a Context inside this hook
  const triggerLogout = async (setUser) => {
    try {
      setLoggingOut(true);

      // Execute cleanup tasks
      await deleteFCMToken();
      localStorage.removeItem("fcm_sent");
      await logout();

      // Update UI and State
      toast.success("Logged out successfully");
      if (setUser) setUser(null);

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return { triggerLogout, loggingOut };
};
