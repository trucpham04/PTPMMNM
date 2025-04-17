import { useState, useCallback } from "react";
import { collectionService } from "../services";
import { Collection, CollectionSong } from "../types";

interface CreateCollectionRequest {
  title: string;
  collection_type:
    | "featured"
    | "trending"
    | "new_releases"
    | "genre_based"
    | "mood_based"
    | "seasonal";
  description?: string;
  genres?: number[];
  songs?: number[];
  cover_image?: File;
  is_active: boolean;
}

interface UpdateCollectionRequest {
  title?: string;
  description?: string;
  genres?: number[];
  is_active?: boolean;
  cover_image?: File;
}

interface AddSongToCollectionRequest {
  collection: number;
  song: number;
  position: number;
}

interface UpdateCollectionSongRequest {
  position: number;
}

export const useCollection = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionSongs, setCollectionSongs] = useState<CollectionSong[]>([]);
  const [collectionSong, setCollectionSong] = useState<CollectionSong | null>(
    null,
  );

  // Get all collections
  const getCollections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getCollections();

      if (response.EC === 0 && response.DT) {
        setCollections(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch collections");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch collections";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create collection
  const createCollection = useCallback(
    async (collectionData: CreateCollectionRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await collectionService.createCollection(collectionData);

        if (response.EC === 0 && response.DT) {
          setCollections((prev) => [...prev, response.DT!]);
          return response.DT;
        } else {
          setError(response.EM || "Failed to create collection");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create collection";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get collection by ID
  const getCollectionById = useCallback(async (collectionId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getCollectionById(collectionId);

      if (response.EC === 0 && response.DT) {
        setCollection(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch collection");
        return null;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch collection";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update collection
  const updateCollection = useCallback(
    async (collectionId: number, collectionData: UpdateCollectionRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await collectionService.updateCollection(
          collectionId,
          collectionData,
        );

        if (response.EC === 0 && response.DT) {
          setCollection(response.DT);
          setCollections((prev) =>
            prev.map((c) => (c.id === collectionId ? response.DT! : c)),
          );
          return response.DT;
        } else {
          setError(response.EM || "Failed to update collection");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update collection";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete collection
  const deleteCollection = useCallback(
    async (collectionId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await collectionService.deleteCollection(collectionId);

        if (response.EC === 0) {
          setCollections((prev) => prev.filter((c) => c.id !== collectionId));
          if (collection && collection.id === collectionId) {
            setCollection(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete collection");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete collection";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collection],
  );

  // Get all collection songs
  const getCollectionSongs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getCollectionSongs();

      if (response.EC === 0 && response.DT) {
        setCollectionSongs(response.DT);
        return response.DT;
      } else {
        setError(response.EM || "Failed to fetch collection songs");
        return [];
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch collection songs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add song to collection
  const addSongToCollection = useCallback(
    async (data: AddSongToCollectionRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await collectionService.addSongToCollection(data);

        if (response.EC === 0 && response.DT) {
          setCollectionSongs((prev) => [...prev, response.DT!]);
          return response.DT;
        } else {
          setError(response.EM || "Failed to add song to collection");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to add song to collection";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get collection song by ID
  const getCollectionSongById = useCallback(
    async (collectionSongId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await collectionService.getCollectionSongById(collectionSongId);

        if (response.EC === 0 && response.DT) {
          setCollectionSong(response.DT);
          return response.DT;
        } else {
          setError(response.EM || "Failed to fetch collection song");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch collection song";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update collection song
  const updateCollectionSong = useCallback(
    async (collectionSongId: number, data: UpdateCollectionSongRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await collectionService.updateCollectionSong(
          collectionSongId,
          data,
        );

        if (response.EC === 0 && response.DT) {
          setCollectionSongs((prev) =>
            prev.map((cs) => (cs.id === collectionSongId ? response.DT! : cs)),
          );
          if (collectionSong && collectionSong.id === collectionSongId) {
            setCollectionSong(response.DT);
          }
          return response.DT;
        } else {
          setError(response.EM || "Failed to update collection song");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update collection song";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [collectionSong],
  );

  // Delete collection song
  const deleteCollectionSong = useCallback(
    async (collectionSongId: number) => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await collectionService.deleteCollectionSong(collectionSongId);

        if (response.EC === 0) {
          setCollectionSongs((prev) =>
            prev.filter((cs) => cs.id !== collectionSongId),
          );
          if (collectionSong && collectionSong.id === collectionSongId) {
            setCollectionSong(null);
          }
          return true;
        } else {
          setError(response.EM || "Failed to delete collection song");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete collection song";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [collectionSong],
  );

  return {
    loading,
    error,
    collections,
    collection,
    collectionSongs,
    collectionSong,
    getCollections,
    createCollection,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getCollectionSongs,
    addSongToCollection,
    getCollectionSongById,
    updateCollectionSong,
    deleteCollectionSong,
  };
};

export default useCollection;
