import { cn } from "@/lib/utils";

function GlobalNavbar({ className }: { className?: string }) {
  return (
    <>
      <div className={cn("fixed min-h-16 w-dvw bg-zinc-600", className)}></div>
    </>
  );
}

export default GlobalNavbar;
