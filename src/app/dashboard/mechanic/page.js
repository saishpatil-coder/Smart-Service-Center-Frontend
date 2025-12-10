"use client";
import LoadingDashboard from "@/components/Loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "MECHANIC") {
      router.replace("/unauthorized"); // or generic unauthorized page
    }
  }, [loading, user]);

  if (loading || !user) return <LoadingDashboard />;
  return (
    <div>Welcome mechanic</div>
    );
}