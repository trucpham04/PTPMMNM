"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import NavAlbums from "@/components/app/nav-albums";
import { Button } from "../ui/button";
import Icon from "../ui/icon";

import { AppSideBarContext } from "../layouts/default-layout";
import { cn } from "@/lib/utils";

const data = {
  albums: [
    {
      title: "Day",
      url: "/album/1",
      cover_url: "https://placehold.co/400",
    },
    {
      title: "La",
      url: "/album/2",
      cover_url: "https://placehold.co/400",
    },
    {
      title: "Demo",
      url: "/album/3",
      cover_url: "https://placehold.co/400",
    },
    {
      title: "Thoi",
      url: "/album/4",
      cover_url: "https://placehold.co/400",
    },
  ],
};

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { sidebarOpen, setSidebarOpen } = React.useContext(AppSideBarContext);

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className={cn("group-data-[collapsible=icon]:w-18!", className)}
      {...props}
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-4 pb-2 text-zinc-500 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:flex-col">
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:text-primary flex w-fit cursor-pointer items-center gap-2 transition-colors duration-200"
        >
          <Icon size={"xl"} fill={!sidebarOpen}>
            folder_copy
          </Icon>
          <div className="w-fit min-w-fit font-semibold text-nowrap group-data-[collapsible=icon]:hidden">
            Your Library
          </div>
        </div>

        <Button
          className="hidden items-center justify-center rounded-full group-data-[collapsible=icon]:flex"
          size={"icon"}
        >
          <Icon size="lg">add</Icon>
        </Button>

        <Button
          className="w-fit cursor-pointer rounded-full pr-4! group-data-[collapsible=icon]:hidden"
          size="sm"
        >
          <Icon size="lg">add</Icon>
          <div className="text-md font-semibold">Create</div>
        </Button>
      </SidebarHeader>

      <SidebarContent className="w-full">
        <NavAlbums albums={data.albums} />
      </SidebarContent>
    </Sidebar>
  );
}
