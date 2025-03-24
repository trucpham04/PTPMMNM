import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="from-primary-foreground to-background flex min-h-screen w-full items-center justify-center bg-gradient-to-b p-6 md:p-10">
      <div className="mb-20 w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
