"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavAlbums({
  albums,
}: {
  albums: {
    title: string;
    url: string;
    cover_url: string;
  }[];
}) {
  return (
    <SidebarGroup className="w-full px-1">
      <SidebarMenu>
        {albums.map((album) => (
          <div className="w-full" key={album.title}>
            <SidebarMenuItem className="h-16! gap-2">
              <NavLink to={album.url}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className="flex h-full cursor-pointer gap-3 p-2! group-data-[collapsible=icon]:size-16!"
                    tooltip={album.title}
                    isActive={isActive}
                  >
                    <div className="flex size-12 min-w-12 items-center justify-center rounded-md">
                      <img
                        src={album.cover_url}
                        alt=""
                        className="rounded-sm"
                      />
                    </div>

                    <div className="space-y-2 text-nowrap group-data-[collapsible=icon]:hidden">
                      <div className={cn(isActive && "text-green-500")}>
                        {album.title}
                      </div>
                      <div className="text-foreground text-xs">
                        Type: Artist ? Albums
                      </div>
                    </div>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
