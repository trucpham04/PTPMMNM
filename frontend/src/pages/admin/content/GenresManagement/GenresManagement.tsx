import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaTools, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./GenresManagement.scss";
import { useGenre } from "../../../../hooks/useGenre";
import { Genre } from "../../../../types/music";
import FormGenreModal from "./FormGenresModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const GenresManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [data, setData] = useState<Genre[]>([]);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [deleteGenreId, setDeleteGenreId] = useState<number | null>(null);

  const { genres, loading, getGenres, deleteGenre } = useGenre();

  useEffect(() => {
    getGenres();
  }, [getGenres]);

  useEffect(() => {
    if (!loading && genres) {
      setData(genres);
    }
  }, [genres, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteGenre(id);
    if (success) {
      toast.success("Genre deleted successfully.");
      setShowModalDel(false);
      setDeleteGenreId(null);
    } else {
      toast.error("Failed to delete genre.");
    }
  };

  const showModalDelete = (id: number) => {
    setDeleteGenreId(id);
    setShowModalDel(true);
  };

  const handleEdit = (id: number) => {
    setShowModal(true);
    setGenreId(id);
  };

  const ActionButtons = ({ id }: { id: number }) => (
    <div className="action-buttons">
      <button className="btn-icon me-2" onClick={() => handleEdit(id)}>
        <FaTools />
      </button>
      <button className="btn-icon" onClick={() => showModalDelete(id)}>
        <FaTrashAlt />
      </button>
    </div>
  );

  const columns: TableColumn<Genre>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "30%",
    },
    {
      name: "Description",
      selector: (row) => row.description || "nothing",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => <ActionButtons id={row.id} />,
      button: true,
      width: "15%",
    },
  ];

  const filteredData = data.filter((genre) =>
    [genre.name, genre.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-genre-management">
      <Card>
        <Card.Header>Genres Management</Card.Header>
        <Card.Body>
          <div className="input-group d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-success ms-2"
              onClick={() => setShowModal(true)}
            >
              <IoIosAddCircleOutline className="me-1" />
              Add Genre
            </button>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            fixedHeader
            fixedHeaderScrollHeight="375px"
            customStyles={{
              rows: {
                style: {
                  minHeight: "32px",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
              },
            }}
          />
        </Card.Body>
      </Card>

      <FormGenreModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setGenreId(null);
          getGenres();
        }}
        id={genreId}
      />

      <ConfirmDeleteModal
        show={showModalDel}
        onClose={() => {
          setShowModalDel(false);
          setDeleteGenreId(null);
        }}
        onDelete={() => handleDelete(deleteGenreId!)}
        itemName="genre"
      />
    </div>
  );
};

export default GenresManagement;
