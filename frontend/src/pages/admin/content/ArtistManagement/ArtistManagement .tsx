import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ArtistManagement.scss";

// Định nghĩa kiểu dữ liệu cho Artist
interface Artist {
  id: number;
  name: string;
  genre: string;
  country: string;
}

const ArtistManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const [data, setData] = useState<Artist[]>([
    {
      id: 1,
      name: "Taylor Swift",
      genre: "Pop",
      country: "USA",
    },
    {
      id: 2,
      name: "Sơn Tùng M-TP",
      genre: "V-Pop",
      country: "Vietnam",
    },
    {
      id: 3,
      name: "Ed Sheeran",
      genre: "Pop",
      country: "UK",
    },
  ]);

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
      // Hiện modal chỉnh sửa tại đây
      console.log("Edit Artist:", artist);
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

  const columns = [
    {
      name: "ID",
      selector: (row: Artist) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: Artist) => row.name,
      sortable: true,
    },
    {
      name: "Genre",
      selector: (row: Artist) => row.genre,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row: Artist) => row.country,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Artist) => <ActionButtons id={row.id} />,
    },
  ];

  const filteredData = data.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.country.toLowerCase().includes(searchTerm.toLowerCase()),
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

      {/* Modal thêm/sửa nghệ sĩ nếu có thể tạo sau */}
    </div>
  );
};

export default ArtistManagement;
