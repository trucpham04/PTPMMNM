"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LibraryBig,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import NavAlbums from "@/components/app/nav-albums";
import { Button } from "../ui/button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="bg-zinc-900! group-data-[collapsible=icon]:w-16!"
      {...props}
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-4 pb-2 text-zinc-500 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:flex-col">
        <div
          onClick={toggleSidebar}
          className="hover:text-primary flex w-fit cursor-pointer items-center gap-2 transition-colors duration-200"
        >
          <LibraryBig className="size-10! p-1.5" />
          <div className="w-fit min-w-fit font-semibold text-nowrap group-data-[collapsible=icon]:hidden">
            Your Library
          </div>
        </div>

        <Button
          className="hidden items-center justify-center rounded-full group-data-[collapsible=icon]:flex"
          size={"icon"}
        >
          <Plus className="size-6!" />
        </Button>

        <Button
          className="w-fit cursor-pointer rounded-full pr-4! group-data-[collapsible=icon]:hidden"
          size="sm"
        >
          <Plus className="size-6!" />
          <div className="text-md font-semibold">Create</div>
        </Button>
      </SidebarHeader>

      <SidebarContent className="w-full">
        <NavAlbums items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
