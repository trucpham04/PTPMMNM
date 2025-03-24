import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="to-background from-primary-foreground flex h-screen flex-col items-center justify-center bg-linear-to-b">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
