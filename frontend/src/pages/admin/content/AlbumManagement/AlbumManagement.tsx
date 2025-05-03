import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaTools, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./AlbumManagement.scss";
import { useAlbum } from "../../../../hooks/useAlbum"; // Hook quản lý album
import { Album } from "../../../../types/music"; // Kiểu dữ liệu album
import FormAlbumModal from "./FormAlbumModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const AlbumManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDel, setShowModalDel] = useState<boolean>(false);

  const [data, setData] = useState<Album[]>([]);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [deleteAlbumId, setDeleteAlbumId] = useState<number | null>(null);

  const { albums, loading, getAlbums, deleteAlbum } = useAlbum();
  const fetchData = async () => {
    try {
      await getAlbums(); // Lấy dữ liệu album từ API
      console.log(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getAlbums]);

  useEffect(() => {
    if (!loading && albums) {
      setData(albums);
      console.log("Albums data copied into state:", albums);
    }
  }, [albums, loading]);

  // ----------------------------------------------------------------------------SEARCH--------------------------------------------------------------------------

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((album) =>
    [album.title, album.artist?.name ?? "", album.description]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // ----------------------------------------------------------------------------DELETE--------------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const success = await deleteAlbum(id);
    if (success) {
      toast.success("Album deleted successfully.");
      setShowModalDel(false);
      setDeleteAlbumId(null);
    } else {
      toast.error("Failed to delete album.");
    }
  };

  const showModalDelete = (id: number) => {
    console.log("Delete album with ID:", id);
    setDeleteAlbumId(id);
    setShowModalDel(true);
  };

  // ----------------------------------------------------------------------------EDIT--------------------------------------------------------------------------

  const handleEdit = (id: number) => {
    console.log("Edit album with ID: ", id);
    setShowModal(true);
    setAlbumId(id);
  };

  // ----------------------------------------------------------------------------TABLE--------------------------------------------------------------------------

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

  const columns: TableColumn<Album>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "18%",
    },
    {
      name: "Artist",
      selector: (row) => row.artist?.name || "Unknown",
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
      name: "Cover Image",
      cell: (row) =>
        row.cover_image ? (
          <img src={row.cover_image} alt={row.title} width={50} height={50} />
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

  return (
    <div className="admin-album-management">
      <Card>
        <Card.Header>Album Management</Card.Header>
        <Card.Body>
          <div className="input-group d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search album..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-success ms-2"
              onClick={() => setShowModal(true)}
            >
              <IoIosAddCircleOutline className="me-1" />
              Add Album
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

      <FormAlbumModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setAlbumId(null);
          fetchData();
        }}
        id={albumId}
      />
      <ConfirmDeleteModal
        show={showModalDel}
        onClose={() => {
          setShowModalDel(false);
          setDeleteAlbumId(null);
        }}
        onDelete={() => handleDelete(deleteAlbumId!)}
        itemName="album"
      />
    </div>
  );
};

export default AlbumManagement;
