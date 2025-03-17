import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import GlobalNavbar from "../app/global-navbar";

function DefaultLayout() {
  return (
    <div className="flex flex-col">
      <GlobalNavbar />

      <div className="mt-16 flex-1">
        <SidebarProvider
          className="min-h-[calc(100vh-4rem)] overflow-hidden"
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-icon": "4rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar className="mt-16 max-h-[calc(100vh-4rem)]" />
          <SidebarInset className="boder m-2 overflow-auto rounded-md bg-neutral-900 p-2">
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default DefaultLayout;
