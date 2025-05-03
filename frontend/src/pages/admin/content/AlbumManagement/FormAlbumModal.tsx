import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import "./FormAlbumModal.scss";
import { useGenre } from "../../../../hooks/useGenre";
import { useArtist } from "../../../../hooks/useArtist";
import { useAlbum } from "../../../../hooks/useAlbum";
import { Album, Genre, Artist } from "../../../../types/music";

interface FormAlbumModalProps {
  show: boolean;
  onClose: () => void;
  id?: number | null;
}
interface CreateAlbumRequest {
  title: string;
  artist: number;
  genres?: number[];
  release_date: string; // YYYY-MM-DD
  cover_image?: string | File | null;
  description?: string;
  slug?: string;
}

interface UpdateAlbumRequest {
  title?: string;
  description?: string;
  cover_image?: string | File | null;
  genres?: number[];
  release_date?: string;
}
const FormAlbumModal: React.FC<FormAlbumModalProps> = ({
  show,
  onClose,
  id,
}) => {
  const { genres, getGenres } = useGenre();
  const { artists, getArtists } = useArtist();
  const { getAlbumById, getAlbums, createAlbum, updateAlbum } = useAlbum();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showFullImage, setShowFullImage] = useState(false);
  const [album, setAlbum] = useState({
    title: "",
    description: "",
    cover_image: null as File | string | null,
    release_date: "",
    artist_id: null as number | null,
    genres: [] as number[],
  });

  const resetForm = () => {
    setAlbum({
      title: "",
      description: "",
      cover_image: null,
      release_date: "",
      artist_id: null,
      genres: [],
    });
    setShowFullImage(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchAlbum = useCallback(
    async (id: number) => {
      try {
        const response = await getAlbumById(id);
        if (!response) return toast.error("Album not found.");

        setAlbum({
          title: response.title || "",
          description: response.description || "",
          cover_image: response.cover_image || "",
          release_date: response.release_date || "",
          artist_id: response.artist?.id || null,
          genres: response.genres?.map((g) => g.id) || [],
        });

        toast.info("Album loaded for editing.");
      } catch {
        toast.error("Failed to load album data.");
      }
    },
    [getAlbumById],
  );

  useEffect(() => {
    getGenres();
    getArtists();
    if (id) fetchAlbum(id);
  }, [getGenres, getArtists, fetchAlbum, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlbum((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlbum((prev) => ({ ...prev, cover_image: file }));
    }
  };

  const getImagePreview = (): string | undefined => {
    if (album.cover_image instanceof File) {
      return URL.createObjectURL(album.cover_image);
    }
    if (typeof album.cover_image === "string") {
      return album.cover_image;
    }
    return undefined;
  };

  const handleGenresChange = (selected: any) => {
    setAlbum((prev) => ({
      ...prev,
      genres: selected ? selected.map((opt: any) => opt.value) : [],
    }));
  };

  const handleArtistChange = (selected: any) => {
    setAlbum((prev) => ({ ...prev, artist_id: selected?.value || null }));
  };

  const handleSubmit = async () => {
    const { title, description, cover_image, release_date, artist_id, genres } =
      album;

    if (!title.trim()) return toast.error("Title is required.");
    if (!release_date) return toast.error("Release date is required.");
    if (!artist_id) return toast.error("Artist must be selected.");
    if (!genres || genres.length === 0)
      return toast.error("At least one genre must be selected.");

    // Check duplicate title + artist (only on create)
    if (!id) {
      const existingAlbumsRes = await getAlbums(); // add this function to `useAlbum` if needed
      const exists = existingAlbumsRes?.some(
        (a) =>
          a.title.trim().toLowerCase() === title.trim().toLowerCase() &&
          a.artist?.id === artist_id,
      );
      if (exists) {
        return toast.error(
          "An album with the same title and artist already exists.",
        );
      }
    }

    const albumData: CreateAlbumRequest | UpdateAlbumRequest = {
      title,
      description,
      release_date,
      artist: artist_id,
      genres,
    };

    if (cover_image && typeof cover_image !== "string") {
      albumData.cover_image = cover_image;
    } else if (!id && !cover_image) {
      albumData.cover_image = null;
    }

    try {
      let result;
      if (id) {
        result = await updateAlbum(id, albumData as UpdateAlbumRequest);
      } else {
        result = await createAlbum(albumData as CreateAlbumRequest);
      }

      if (result) {
        toast.success(
          id ? "Album updated successfully!" : "Album added successfully!",
        );
        resetForm();
        onClose();
      }
    } catch (error) {
      toast.error("Something went wrong when saving the album.");
      console.error(error);
    }
  };

  const genreOptions = genres.map((g) => ({ value: g.id, label: g.name }));
  const artistOptions = artists.map((a) => ({ value: a.id, label: a.name }));

  return (
    <>
      <div className={`overlay ${show ? "show" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5>{id ? "Edit Album" : "Add Album"}</h5>
            {/* <button
              className="close-button"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              ×
            </button> */}
          </div>
          <div className="modal-body">
            {/* Row 1: Title & Description */}
            <div className="form-row">
              <div className="form-group half">
                <label>Title</label>
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={album.title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group half">
                <label>Description</label>
                <input
                  className="input"
                  type="text"
                  name="description"
                  value={album.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Release Date & Artist */}
            <div className="form-row">
              <div className="form-group half">
                <label>Release Date</label>
                <input
                  className="input"
                  type="date"
                  name="release_date"
                  value={album.release_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group half">
                <label>Artist</label>
                <Select
                  className="mt-1"
                  name="artist"
                  options={artistOptions}
                  value={
                    artistOptions.find(
                      (opt) => opt.value === album.artist_id,
                    ) || null
                  }
                  onChange={handleArtistChange}
                />
              </div>
            </div>

            {/* Row 3: Genres */}
            <div className="form-row">
              <div className="form-group full">
                <label>Genres</label>
                <Select
                  isMulti
                  name="genres"
                  options={genreOptions}
                  value={genreOptions.filter((opt) =>
                    album.genres.includes(opt.value),
                  )}
                  onChange={handleGenresChange}
                />
              </div>
            </div>

            {/* Row 4: Cover Image */}
            <div className="form-row">
              <div className="form-group full">
                <label>Cover Image</label>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />

                {getImagePreview() && (
                  <img
                    src={getImagePreview()}
                    alt="Album"
                    className="thumbnail"
                    onClick={() => setShowFullImage(true)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="button secondary"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Close
            </button>
            <button className="button" onClick={handleSubmit}>
              {id ? "Update Album" : "Save Album"}
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Popup */}
      {showFullImage && (
        <div className="image-overlay" onClick={() => setShowFullImage(false)}>
          <div className="image-popup" onClick={(e) => e.stopPropagation()}>
            {album.cover_image && (
              <img
                src={
                  typeof album.cover_image === "string"
                    ? album.cover_image
                    : URL.createObjectURL(album.cover_image)
                }
                alt="Full Album"
              />
            )}
          </div>
          <button
            className="image-close-button"
            onClick={() => setShowFullImage(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default FormAlbumModal;
