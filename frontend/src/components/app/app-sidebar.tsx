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
import { useAuth } from "@/contexts/authContext";
import { Skeleton } from "../ui/skeleton";
import { useAlbum } from "@/hooks";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { sidebarOpen, setSidebarOpen } = React.useContext(AppSideBarContext);
  const { albums, loading } = useAlbum();
  const { user } = useAuth();

  // Convert saved albums to the format expected by NavAlbums
  const formattedAlbums = albums.map((album) => ({
    title: album.title,
    url: `/album/${album.id}`,
    cover_url: album.cover_image,
    // savedAt: album.,
  }));

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
        {loading ? (
          <div className="space-y-4 p-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-sm" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
          </div>
        ) : user ? (
          formattedAlbums.length > 0 ? (
            <NavAlbums albums={formattedAlbums} />
          ) : sidebarOpen == true ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
              <Icon size="xl" className="mb-2">
                library_music
              </Icon>
              <p>No saved albums yet</p>
              <p className="text-xs">Albums you save will appear here</p>
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
            <Icon size="xl" className="mb-2">
              account_circle
            </Icon>
            <p>Login to view your saved albums</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
