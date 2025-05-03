import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./FormGenresModal.scss";
import { useGenre } from "../../../../hooks/useGenre";
import { Genre } from "../../../../types/music";

interface FormGenreModalProps {
  show: boolean;
  onClose: () => void;
  id?: number | null;
}

const FormGenreModal: React.FC<FormGenreModalProps> = ({
  show,
  onClose,
  id,
}) => {
  const { getGenreById, getGenres, createGenre, updateGenre } = useGenre();

  const [genre, setGenre] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchGenre = async (genreId: number) => {
      try {
        const data: Genre | null = await getGenreById(genreId);
        if (data) {
          setGenre({
            name: data.name,
            description: data.description || "",
          });
          toast.info("Genre loaded for editing.");
        } else {
          toast.error("Genre not found.");
        }
      } catch (err) {
        toast.error("Failed to fetch genre data.");
        console.error(err);
      }
    };

    if (id) fetchGenre(id);
    else resetForm();
  }, [id]);

  const resetForm = () => {
    setGenre({ name: "", description: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGenre((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!genre.name.trim()) return toast.error("Genre name is required.");

    try {
      if (!id) {
        const existingGenres = await getGenres();
        const nameExists = existingGenres.some(
          (g) =>
            g.name.trim().toLowerCase() === genre.name.trim().toLowerCase(),
        );

        if (nameExists) {
          return toast.error("Genre name already exists.");
        }
      }

      let result;
      if (id) {
        result = await updateGenre(id, genre);
      } else {
        result = await createGenre(genre);
      }

      if (result) {
        toast.success(
          id ? "Genre updated successfully!" : "Genre added successfully!",
        );
        resetForm();
        onClose();
      }
    } catch (err) {
      toast.error("Error saving genre.");
      console.error(err);
    }
  };

  return (
    <div className={`overlay ${show ? "show" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h5>{id ? "Edit Genre" : "Add Genre"}</h5>
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
          <div className="form-group">
            <label>Name</label>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Enter genre name"
              value={genre.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              className="input"
              type="text"
              name="description"
              placeholder="Enter genre description"
              value={genre.description}
              onChange={handleChange}
            />
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
            {id ? "Update Genre" : "Save Genre"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormGenreModal;
