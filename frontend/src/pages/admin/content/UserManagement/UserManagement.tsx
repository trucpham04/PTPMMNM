import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaTools, FaTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "./UserManagement.scss";
import { useUser } from "../../../../hooks/useUser"; // Hook quản lý người dùng
import { User } from "../../../../types/user"; // Kiểu dữ liệu user
import FormUserModal from "./FormUserModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDel, setShowModalDel] = useState<boolean>(false);

  const [data, setData] = useState<User[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const { users, loading, getUsers, deleteUser } = useUser();
  const fetchData = async () => {
    try {
      await getUsers(); // Lấy dữ liệu người dùng từ API
      console.log(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getUsers]);

  useEffect(() => {
    if (!loading && users) {
      setData(users);
      console.log("Users data copied into state:", users);
    }
  }, [users, loading]);

  // ----------------------------------------------------------------------------SEARCH--------------------------------------------------------------------------

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((user) =>
    [user.username, user.email, user.bio ?? "", user.country ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // ----------------------------------------------------------------------------DELETE--------------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const success = await deleteUser(id);
    if (success) {
      toast.success("User deleted successfully.");
      setShowModalDel(false);
      setDeleteUserId(null);
    } else {
      toast.error("Failed to delete user.");
    }
  };

  const showModalDelete = (id: number) => {
    console.log("Delete user with ID:", id);
    setDeleteUserId(id);
    setShowModalDel(true);
  };

  // ----------------------------------------------------------------------------EDIT--------------------------------------------------------------------------

  const handleEdit = (id: number) => {
    console.log("Edit user with ID: ", id);
    setShowModal(true);
    setUserId(id);
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

  const columns: TableColumn<User>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "10%",
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      width: "20%",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "25%",
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.date_of_birth || "Chưa có",
      sortable: true,
      width: "15%",
    },
    {
      name: "Ảnh đại diện",
      cell: (row) => {
        let src = "";

        if (typeof row.profile_picture === "string") {
          src = row.profile_picture;
        } else if (row.profile_picture instanceof File) {
          src = URL.createObjectURL(row.profile_picture);
        }

        return src ? (
          <img
            src={src}
            alt="avatar"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        ) : (
          "Không có"
        );
      },
      width: "15%",
    },
    {
      name: "Actions",
      cell: (row) => <ActionButtons id={row.id} />,
      button: true,
      width: "15%",
    },
  ];

  return (
    <div className="admin-user-management">
      <Card>
        <Card.Header>User Management</Card.Header>
        <Card.Body>
          <div className="input-group d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search user..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {/* <button
              className="btn btn-success ms-2"
              onClick={() => setShowModal(true)}
            >
              <IoIosAddCircleOutline className="me-1" />
              Add User
            </button> */}
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

      <FormUserModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setUserId(null);
          fetchData();
        }}
        id={userId}
      />
      <ConfirmDeleteModal
        show={showModalDel}
        onClose={() => {
          setShowModalDel(false);
          setDeleteUserId(null);
        }}
        onDelete={() => handleDelete(deleteUserId!)}
        itemName="user"
      />
    </div>
  );
};

export default UserManagement;
