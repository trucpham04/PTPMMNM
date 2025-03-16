"use client";

import { type LucideIcon } from "lucide-react";
import ReactLogo from "@/assets/react.svg";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
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
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                size={"lg"}
                className="h-16 group-data-[collapsible=icon]:h-16! group-data-[collapsible=icon]:w-16!"
                tooltip={item.title}
              >
                <div className="flex h-16 w-16 min-w-16 items-center justify-center rounded-md bg-red-50">
                  <img src={ReactLogo} alt="" />
                </div>
                <div className="w-0! group-data-[collapsible=icon]:hidden">
                  {item.title}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
