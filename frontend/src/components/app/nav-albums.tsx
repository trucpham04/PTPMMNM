"use client";

import { type LucideIcon } from "lucide-react";
import ReactLogo from "@/assets/react.svg";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function NavAlbums({
  albums,
}: {
  albums: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup className="w-full px-1">
      <SidebarMenu>
        {albums.map((album) => (
          <div className="w-full" key={album.title}>
            <SidebarMenuItem className="h-16! gap-2">
              {/* <Link to="/"> */}
              <SidebarMenuButton
                className="flex h-full cursor-pointer gap-3 p-2! group-data-[collapsible=icon]:size-16!"
                tooltip={album.title}
              >
                <div className="flex size-12 min-w-12 items-center justify-center rounded-md bg-red-100">
                  <img src={ReactLogo} alt="" />
                </div>

                <div className="space-y-2 text-nowrap group-data-[collapsible=icon]:hidden">
                  <div>{album.title}</div>
                  <div className="text-foreground text-xs">
                    Type: Artist ? Albums
                  </div>
                </div>
              </SidebarMenuButton>
              {/* </Link> */}
            </SidebarMenuItem>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
