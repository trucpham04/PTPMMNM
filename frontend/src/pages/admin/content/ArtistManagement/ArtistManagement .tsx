import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ArtistManagement.scss";
import { useArtist } from "../../../../hooks/useArtist";
import { Artist as ImportedArtist } from "../../../../types/music"; // Rename the imported Artist type

// LocalArtist type definition if necessary
interface LocalArtist {
  id: number;
  name: string;
  genres: number[]; // Now using number[] for genre IDs
  image: string;
  bio: string;
  slug: string;
}

const ArtistManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<LocalArtist[]>([]); // Use LocalArtist type for local state

  const { artists, loading, getArtists } = useArtist();

  useEffect(() => {
    const fetchData = async () => {
      await getArtists();
    };
    fetchData();
  }, [getArtists]);

  useEffect(() => {
    if (!loading && artists) {
      setData(artists); // Copy the fetched artists into the state
      console.log("Artists data copied into state:", artists);
    }
  }, [artists, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      setData(data.filter((artist) => artist.id !== id));
      toast.success("Deleted successfully!");
    }
  };

  const handleEdit = (id: number) => {
    const artist = data.find((item) => item.id === id);
    if (artist) {
      console.log("Edit Artist:", artist);
      setShowModal(true); // Show modal for editing
    }
  };

  const ActionButtons = ({ id }: { id: number }) => (
    <div className="action-buttons">
      <button className="btn-icon me-2" onClick={() => handleEdit(id)}>
        <FaEllipsisV />
      </button>
      <button className="btn-icon" onClick={() => handleDelete(id)}>
        <FaTrashAlt />
      </button>
    </div>
  );

  const columns: TableColumn<LocalArtist>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Genres",
      selector: (row) => row.genres.join(", "), // Display genre IDs, you can map them later to actual genre names
      sortable: true,
    },
    {
      name: "Bio",
      selector: (row) => row.bio,
    },
    {
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img src={row.image} alt={row.name} width={50} height={50} />
        ) : (
          <span>No image</span>
        ),
    },
    {
      name: "Actions",
      cell: (row) => <ActionButtons id={row.id} />,
      button: true,
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-75"
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
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistManagement;
