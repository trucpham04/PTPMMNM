"use client";

import { type LucideIcon } from "lucide-react";
import ReactLogo from "@/assets/react.svg";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export default function NavAlbums({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup className="w-full px-1">
      <SidebarMenu>
        {items.map((item) => (
          <div className="w-full" key={item.title}>
            <SidebarMenuItem className="h-16!">
              {/* <Link to="/"> */}
              <SidebarMenuButton
                className="flex h-full cursor-pointer p-2! group-data-[collapsible=icon]:size-16!"
                tooltip={item.title}
              >
                <div className="flex size-12 min-w-12 items-center justify-center rounded-md bg-red-100">
                  <img src={ReactLogo} alt="" />
                </div>
                <div className="space-y-1 text-nowrap group-data-[collapsible=icon]:hidden">
                  <div>{item.title}</div>
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
