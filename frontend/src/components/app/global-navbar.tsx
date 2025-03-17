import { cn } from "@/lib/utils";
import { LayoutGrid, User, House, FolderOpen, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

function GlobalNavbar({ className }: { className?: string }) {
  return (
    <div className={cn("fixed h-16 w-dvw p-2", className)}>
      <div className="flex h-full items-center justify-between">
        <Link
          to="/"
          className="flex h-18 w-18 items-center justify-center text-white"
        >
          <LayoutGrid size={24} className="cursor-pointer" />
        </Link>

        <div className="flex gap-2">
          <Button className="size-12 cursor-pointer rounded-full bg-neutral-800 text-white hover:bg-neutral-700">
            <House className="size-6!" />
          </Button>

          {/* Searchbar */}

          <div className="focus:animate-in flex w-fit rounded-full bg-neutral-800 ring-offset-2 delay-75 focus-within:ring-0 hover:bg-neutral-700">
            <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent pl-1 text-white">
              <Search className="size-6!" />
            </div>
            <Input
              placeholder="What do you want to play?"
              className="h-12 w-md border-0 bg-transparent! pl-0! focus-visible:ring-0"
            />
            <div className="flex items-center">
              <Separator orientation="vertical" className="h-3/5!" />
            </div>
            <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent pr-1 text-white">
              <FolderOpen className="size-6!" />
            </div>
          </div>
        </div>
        <div className="size-12 cursor-pointer">
          <Avatar className="size-full">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default GlobalNavbar;
