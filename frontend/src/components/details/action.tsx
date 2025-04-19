import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Album } from "@/types";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/authContext";

interface AlbumActionProps {
  album: Album;
}

export default function AlbumAction({ album }: AlbumActionProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user && album) {
        setLoading(true);
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [user, album]);

  const handleToggleSave = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      if (saved) {
        setSaved(false);
      } else {
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
