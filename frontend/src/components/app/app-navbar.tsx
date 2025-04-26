import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/icon";
import { useSidebar } from "../ui/sidebar";
import { useAuth } from "@/contexts/authContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState, useRef } from "react";

function AppNavbar({ className }: { className?: string }) {
  const { openMobile, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("fixed h-16 w-dvw p-2", className)}>
      <div className="relative flex h-full items-center justify-between">
        <Icon
          size={"xl"}
          onClick={() => setOpenMobile(!openMobile)}
          className="mr-3 md:hidden!"
        >
          menu
        </Icon>
        <Link
          to="/"
          className="hidden h-18 w-18 items-center justify-center text-white md:flex"
        >
          <Icon size={"xl"}>grid_view</Icon>
        </Link>

        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 gap-2">
          <Button className="size-12 cursor-pointer rounded-full bg-neutral-800 text-white hover:bg-neutral-700">
            <NavLink to="/">
              {({ isActive }) => (
                <Icon size={"lg"} fill={isActive}>
                  home
                </Icon>
              )}
            </NavLink>
          </Button>

          {/* Searchbar */}
          <div
            ref={searchRef}
            className="relative flex w-fit rounded-full bg-neutral-800 ring-offset-2 transition-all delay-75 duration-200 focus-within:ring-0 hover:bg-neutral-700"
          >
            <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent pl-1 text-white">
              <Icon size="lg">search</Icon>
            </div>
            <div className="hidden md:flex">
              <Input
                placeholder="What do you want to play?"
                className="h-12 w-md border-0 bg-transparent! pl-0! focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(
                      `/search?q=${encodeURIComponent(searchQuery.trim())}`,
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>

        {user ? (
          <Popover>
            <div className="size-12 cursor-pointer">
              <PopoverTrigger>
                <Avatar className="size-full cursor-pointer border">
                  <AvatarImage src={user.profile_picture} />
                  <AvatarFallback className="size-12">
                    <Icon size={"lg"}>person</Icon>
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-40 rounded-sm p-1">
                <div className="grid gap-1">
                  {user.is_staff ? (
                    <>
                      {" "}
                      <Button
                        asChild
                        variant="ghost"
                        className="cursor-pointer rounded-xs"
                      >
                        <Link to="/admin" className="justify-start">
                          Admin
                        </Link>
                      </Button>
                      <Separator className="w-full" />
                    </>
                  ) : (
                    ""
                  )}

                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="cursor-pointer justify-start! rounded-xs"
                  >
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </div>
          </Popover>
        ) : (
          <div className="flex gap-2">
            <Button
              asChild
              variant={"outline"}
              className="cursor-pointer rounded-full px-5 py-5 font-semibold"
            >
              <a href="/register" className="inline-flex items-center">
                Sign Up
              </a>
            </Button>
            <Button
              asChild
              className="cursor-pointer rounded-full px-5 py-5 font-semibold"
            >
              <a href="/login" className="inline-flex items-center">
                Log In
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppNavbar;
