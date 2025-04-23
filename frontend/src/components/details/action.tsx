import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/authContext";
import { useFavorite } from "@/hooks";
import { cn } from "@/lib/utils";

interface AlbumActionProps {
  album: Album;
}

export default function AlbumAction({ album }: AlbumActionProps) {
  const { user } = useAuth();

  const {
    getIsAlbumFavorited,
    isAlbumFavorited,
    addAlbumToFavorites,
    removeAlbumFromFavorites,
  } = useFavorite();

  useEffect(() => {
    if (user && album) {
      getIsAlbumFavorited(user.id, album.id);
    }
  }, [user, album]);

  const handleToggleFavorite = async () => {
    if (!user || !album) return;

    if (isAlbumFavorited) {
      await removeAlbumFromFavorites(user.id, album.id);
    } else {
      await addAlbumToFavorites(user.id, album.id);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-12 cursor-pointer rounded-full"
      onClick={handleToggleFavorite}
    >
      <Icon size="md" className={cn({ fill: isAlbumFavorited })}>
        favorite
      </Icon>
    </Button>
  );
}
