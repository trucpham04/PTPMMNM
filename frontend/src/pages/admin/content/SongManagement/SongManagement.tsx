import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaTools, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./SongManagement.scss";
import { useSong } from "../../../../hooks/useSong"; // Hook quản lý bài hát
import { Song } from "../../../../types/music"; // Kiểu dữ liệu bài hát
import FormSongModal from "./FormSongModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
interface CreateSongRequest {
  title: string;
  artist: number;
  featuring_artists?: number[];
  album?: number;
  genres?: number[];
  composers?: string;
  audio_file: string | File | null;
  video_file?: string | File | null;
  duration: string;
  lyrics?: string;
  release_date?: string;
  price?: string;
  is_downloadable: boolean;
  is_premium: boolean;
  slug?: string;
}

interface UpdateSongRequest {
  title?: string;
  lyrics?: string;
  price?: string;
  is_downloadable?: boolean;
  is_premium?: boolean;
  audio_file?: string | File | null;
  video_file?: string | File | null;
  featuring_artists?: number[];
  genres?: number[];
}
const SongManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDel, setShowModalDel] = useState<boolean>(false);
  const [data, setData] = useState<Song[]>([]);
  const [songId, setSongId] = useState<number | null>(null);
  const [deleteSongId, setDeleteSongId] = useState<number | null>(null);

  const { songs, loading, getSongs, deleteSong } = useSong();

  // Fetch dữ liệu bài hát từ API
  const fetchData = async () => {
    try {
      await getSongs();
      console.log("Song data: ", songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getSongs]);

  useEffect(() => {
    if (!loading && songs) {
      setData(songs);
    }
  }, [songs, loading]);

  // Xử lý tìm kiếm bài hát
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((song) =>
    [song.title, song.artist?.name ?? "", song.album?.title, song.genres?.name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Xử lý xóa bài hát
  const handleDelete = async (id: number) => {
    const success = await deleteSong(id);
    if (success) {
      toast.success("Song deleted successfully.");
      setShowModalDel(false);
      setDeleteSongId(null);
    } else {
      toast.error("Failed to delete song.");
    }
  };

  const showModalDelete = (id: number) => {
    setDeleteSongId(id);
    setShowModalDel(true);
  };

  // Xử lý chỉnh sửa bài hát
  const handleEdit = (id: number) => {
    setShowModal(true);
    setSongId(id);
  };

  // Hiển thị các nút hành động
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

  // Cột cho DataTable
  const columns: TableColumn<Song>[] = [
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
      width: "20%",
    },
    {
      name: "Artist",
      selector: (row) => row.artist?.name || "Unknown",
      sortable: true,
      width: "20%",
    },
    {
      name: "Album",
      selector: (row) => row.album?.title || "Unknown",
      sortable: true,
      width: "20%",
    },
    {
      name: "Genres",
      selector: (row) =>
        row.genres && row.genres.length > 0
          ? row.genres.map((g) => g.name).join(", ")
          : "No genres",
      sortable: true,
      width: "20%",
    },
    {
      name: "Actions",
      cell: (row) => <ActionButtons id={row.id} />,
      button: true,
      width: "10%",
    },
  ];

  return (
    <div className="admin-song-management">
      <Card>
        <Card.Header>Song Management</Card.Header>
        <Card.Body>
          <div className="input-group d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search song..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-success ms-2"
              onClick={() => setShowModal(true)}
            >
              <IoIosAddCircleOutline className="me-1" />
              Add Song
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

      <FormSongModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSongId(null);
          fetchData();
        }}
        id={songId}
      />
      <ConfirmDeleteModal
        show={showModalDel}
        onClose={() => {
          setShowModalDel(false);
          setDeleteSongId(null);
        }}
        onDelete={() => handleDelete(deleteSongId!)}
        itemName="song"
      />
    </div>
  );
};

export default SongManagement;
