import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import AppNavbar from "../app/app-navbar";
import AppFooter from "../app/app-footer";

function DefaultLayout() {
  return (
    <div className="flex h-screen flex-col">
      <AppNavbar />

      <main className="mt-16 flex flex-1">
        <SidebarProvider
          className="min-h-full overflow-hidden"
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-icon": "4rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar className="mt-16 max-h-[calc(100vh-8rem)]" />
          <SidebarInset className="boder m-2 overflow-auto rounded-md bg-neutral-900 p-2">
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </main>

      <AppFooter className="" />
    </div>
  );
}

export default DefaultLayout;
