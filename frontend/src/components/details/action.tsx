import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";
import Icon from "@/components/ui/icon";
import { useUserAlbums } from "@/hooks/use-user-albums";
import { useAuth } from "@/contexts/auth-context";

interface AlbumActionProps {
  album: Album;
}

export default function AlbumAction({ album }: AlbumActionProps) {
  const { user } = useAuth();
  const { saveAlbum, removeAlbum, isAlbumSaved } = useUserAlbums();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && album) {
        setLoading(true);
        const status = await isAlbumSaved(album.id);
        setSaved(status);
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [user, album, isAlbumSaved]);

  const handleToggleSave = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      if (saved) {
        await removeAlbum(album.id);
        setSaved(false);
      } else {
        await saveAlbum(album.id);
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full"
      onClick={handleToggleSave}
      disabled={loading}
    >
      {loading ? (
        <Icon size="md" className="animate-spin">
          autorenew
        </Icon>
      ) : saved ? (
        <Icon size="md" className="fill text-green-500">
          favorite
        </Icon>
      ) : (
        <Icon size="md">favorite_border</Icon>
      )}
    </Button>
  );
}
