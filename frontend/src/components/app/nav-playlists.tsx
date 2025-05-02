"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Playlist } from "@/types";

export default function NavPlaylists({ playlists }: { playlists: Playlist[] }) {
  return (
    <SidebarGroup className="w-full px-1">
      <SidebarGroupLabel className="mb-2 text-2xl font-semibold group-data-[collapsible=icon]:hidden">
        Playlists
      </SidebarGroupLabel>
      <SidebarMenu>
        {playlists.map((playlist, index) => (
          <div className="w-full" key={`${playlist.name}-${index}`}>
            <SidebarMenuItem className="h-16! gap-2">
              <NavLink to={`/playlist/${playlist.id}`}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className="flex h-full cursor-pointer gap-3 p-2! group-data-[collapsible=icon]:size-16!"
                    tooltip={playlist.name}
                    isActive={isActive}
                  >
                    <div className="flex size-12 min-w-12 items-center justify-center rounded-md">
                      <img
                        src={playlist.cover_image}
                        alt={playlist.name.slice(0, 2).toUpperCase()}
                        className="bg-primary text-primary-foreground inline-flex h-full w-full items-center justify-center rounded-sm object-cover text-xl font-bold"
                      />
                    </div>

                    <div className="flex flex-col justify-center space-y-1 text-nowrap group-data-[collapsible=icon]:hidden">
                      <div
                        className={cn(
                          "line-clamp-1 font-medium",
                          isActive && "text-green-500",
                        )}
                      >
                        {playlist.name}
                      </div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">
                        Playlist •{" "}
                        {
                          new Date(playlist.created_at)
                            .toISOString()
                            .split("T")[0]
                        }
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
