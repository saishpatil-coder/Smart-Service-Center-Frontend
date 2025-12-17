import { SidebarProvider } from "@/context/SidebarContext";
import DashboardMainWrapper from "./DashboardMainWrapper";
import { DashboardProvider } from "@/context/DashBoardContext";

export default function DashboardLayout({ children }) {

  return (
    <DashboardProvider>
        <DashboardMainWrapper>{children}</DashboardMainWrapper>
    </DashboardProvider>
  );
}
