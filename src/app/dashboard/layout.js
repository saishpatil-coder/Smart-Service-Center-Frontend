import { SidebarProvider } from "@/context/SidebarContext";
import DashboardMainWrapper from "./DashboardMainWrapper";

export default function DashboardLayout({ children }) {

  return (
    <SidebarProvider>
      <DashboardMainWrapper>
        {children}
      </DashboardMainWrapper>
    </SidebarProvider>
  );
}
