"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import Icon from "../ui/icon";
import { Album } from "@/types";

export default function NavAlbums({ albums }: { albums: Album[] }) {
  return (
    <SidebarGroup className="w-full px-1">
      <SidebarMenu>
        <div className="w-full">
          <SidebarMenuItem className="h-16! gap-2">
            <NavLink to={"/favorites"}>
              {({ isActive }) => (
                <SidebarMenuButton
                  className="flex h-full cursor-pointer gap-3 p-2! group-data-[collapsible=icon]:size-16!"
                  tooltip={"Your Favorites"}
                  isActive={isActive}
                >
                  <div className="bg-primary flex size-12 min-w-12 items-center justify-center rounded-md">
                    {/* <img
                      src={album.cover_url}
                      alt={album.title}
                      className="h-full w-full rounded-sm object-cover"
                    /> */}
                    <Icon className="fill text-primary-foreground" size={"lg"}>
                      favorite
                    </Icon>
                  </div>

                  <div className="flex flex-col justify-center space-y-1 text-nowrap group-data-[collapsible=icon]:hidden">
                    <div
                      className={cn(
                        "line-clamp-1 font-medium",
                        isActive && "text-green-500",
                      )}
                    >
                      Your Favorites
                    </div>
                    {/* <div className="text-muted-foreground line-clamp-1 text-xs">
                      Album • {timeAgo(album.savedAt || "")}
                    </div> */}
                  </div>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        </div>
        {albums.map((album, index) => (
          <div className="w-full" key={`${album.title}-${index}`}>
            <SidebarMenuItem className="h-16! gap-2">
              <NavLink to={`/album/${album.id}`}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    className="flex h-full cursor-pointer gap-3 p-2! group-data-[collapsible=icon]:size-16!"
                    tooltip={album.title}
                    isActive={isActive}
                  >
                    <div className="flex size-12 min-w-12 items-center justify-center rounded-md">
                      <img
                        src={album.cover_image}
                        alt={album.title}
                        className="h-full w-full rounded-sm object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-center space-y-1 text-nowrap group-data-[collapsible=icon]:hidden">
                      <div
                        className={cn(
                          "line-clamp-1 font-medium",
                          isActive && "text-green-500",
                        )}
                      >
                        {album.title}
                      </div>
                      {/* <div className="text-muted-foreground line-clamp-1 text-xs">
                        Album • {timeAgo(album.savedAt || "")}
                      </div> */}
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
