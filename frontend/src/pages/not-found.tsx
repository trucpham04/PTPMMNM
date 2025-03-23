import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center">
      <h1 className="mt-0 mb-4 text-5xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mb-10">
        We can’t seem to find the page you are looking for.
      </p>
      <Button className="size-fit! cursor-pointer rounded-full p-0!">
        <Link to="/" className="px-8! py-3! text-lg font-semibold">
          Home
        </Link>
      </Button>
    </div>
  );
}
