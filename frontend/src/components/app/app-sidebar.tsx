"use client";

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
import { useFavoriteContext } from "@/contexts/favoriteContext";
import { ComponentProps, useContext, useEffect, useState } from "react";
import { useFavorite, usePlaylist } from "@/hooks";
import NavPlaylists from "./nav-playlists";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Playlist } from "@/types";

export function AppSidebar({
  className,
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { sidebarOpen, setSidebarOpen } = useContext(AppSideBarContext);
  const { user } = useAuth();
  const { getFavoriteAlbumsByUser, loading } = useFavorite();
  const { getPlaylistsByUser, createPlaylist } = usePlaylist();
  const { favoriteAlbums, userPlaylists } = useFavoriteContext();

  const [isNewPlaylistDialogOpen, setIsNewPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getFavoriteAlbumsByUser(user.id);
      getPlaylistsByUser(user.id);
    }
  }, [user]);

  const handleNewPlaylistNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPlaylistName(e.target.value);
    setNameError(null);
  };

  const validatePlaylistName = () => {
    if (!newPlaylistName.trim()) {
      setNameError("Playlist name cannot be empty");
      return false;
    }

    const nameExists = userPlaylists.some(
      (playlist: Playlist) =>
        playlist.name.toLowerCase() === newPlaylistName.trim().toLowerCase(),
    );

    if (nameExists) {
      setNameError("A playlist with this name already exists");
      return false;
    }

    return true;
  };

  const handleCreatePlaylist = () => {
    if (validatePlaylistName() && user) {
      createPlaylist({
        user: user.id,
        name: newPlaylistName,
        is_public: false,
      }).then(() => {
        getPlaylistsByUser(user.id);
      });

      setNewPlaylistName("");
      setIsNewPlaylistDialogOpen(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsNewPlaylistDialogOpen(open);
    if (!open) {
      setNewPlaylistName("");
      setNameError(null);
    }
  };

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
          className="hidden cursor-pointer items-center justify-center rounded-full group-data-[collapsible=icon]:flex"
          size={"icon"}
          onClick={() => setIsNewPlaylistDialogOpen(true)}
        >
          <Icon size="lg">add</Icon>
        </Button>

        <Button
          className="w-fit cursor-pointer rounded-full pr-4! group-data-[collapsible=icon]:hidden"
          size="sm"
          onClick={() => setIsNewPlaylistDialogOpen(true)}
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
          <>
            <NavAlbums albums={favoriteAlbums} />
            <NavPlaylists playlists={userPlaylists} />
          </>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
            <Icon size="xl" className="mb-2">
              account_circle
            </Icon>
            <p>Login to view your saved albums</p>
          </div>
        )}
      </SidebarContent>

      <Dialog open={isNewPlaylistDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogTitle className="mb-4 text-xl font-bold">
            New playlist
          </DialogTitle>
          <div className="space-y-2">
            {/* <Label htmlFor="playlist-name">Playlist name</Label> */}
            <Input
              id="playlist-name"
              placeholder="Your playlist name..."
              value={newPlaylistName}
              onChange={handleNewPlaylistNameChange}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewPlaylistDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
