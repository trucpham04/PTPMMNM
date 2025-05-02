import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ArtistManagement.scss";
import { useArtist } from "../../../../hooks/useArtist";
import { Artist, Genre } from "../../../../types/music";
import FormArtistModal from "./FormArtistModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
const ArtistManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDel, setShowModalDel] = useState<boolean>(false);

  const [data, setData] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [deleteArtistId, setDeleteArtistId] = useState<number | null>(null);

  const { artists, loading, getArtists, deleteArtist } = useArtist();

  useEffect(() => {
    const fetchData = async () => {
      await getArtists();
    };
    fetchData();
  }, [getArtists]);

  useEffect(() => {
    if (!loading && artists) {
      setData(artists);
      console.log("Artists data copied into state:", artists);
    }
  }, [artists, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteArtist(id);

    if (success) {
      toast.success("Artist deleted successfully.");
      setShowModalDel(false);
      setDeleteArtistId(null);
    } else {
      toast.error("Failed to delete artist.");
    }
  };
  const showModalDelete = (id: number) => {
    console.log("Delete artist with ID:", id);
    setDeleteArtistId(id);
    setShowModalDel(true);
  };
  const handleEdit = (id: number) => {
    console.log("Edit artist with ID: ", id);
    setShowModal(true);
    setArtistId(id);
  };

  const ActionButtons = ({ id }: { id: number }) => (
    <div className="action-buttons">
      <button className="btn-icon me-2" onClick={() => handleEdit(id)}>
        <FaEllipsisV />
      </button>
      <button className="btn-icon" onClick={() => showModalDelete(id)}>
        <FaTrashAlt />
      </button>
    </div>
  );

  const columns: TableColumn<Artist>[] = [
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
      width: "18%",
    },
    {
      name: "Genres",
      selector: (row) =>
        row.genres && row.genres.length > 0
          ? row.genres.map((g) => g.name).join(", ")
          : "No genres",
      sortable: true,
      width: "18%",
    },
    {
      name: "Bio",
      selector: (row) => row.bio || "",
    },
    {
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img src={row.image} alt={row.name} width={50} height={50} />
        ) : (
          <span>No image</span>
        ),
      width: "18%",
    },
    {
      name: "Actions",
      cell: (row) => <ActionButtons id={row.id} />,
      button: true,
      width: "18%",
    },
  ];

  const filteredData = data.filter((artist) =>
    [artist.name, artist.bio]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-artist-management">
      <Card>
        <Card.Header>Artist Management</Card.Header>
        <Card.Body>
          <div className="input-group d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search artist..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-success ms-2"
              onClick={() => setShowModal(true)}
            >
              <IoIosAddCircleOutline className="me-1" />
              Add Artist
            </button>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            className="card-table"
          />
        </Card.Body>
      </Card>

      <FormArtistModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setArtistId(null);
        }}
        id={artistId}
      />
      <ConfirmDeleteModal
        show={showModalDel}
        onClose={() => {
          setShowModalDel(false);
          setDeleteArtistId(null);
        }}
        onDelete={() => handleDelete(deleteArtistId!)}
        itemName="artist"
      />
    </div>
  );
};

export default ArtistManagement;
