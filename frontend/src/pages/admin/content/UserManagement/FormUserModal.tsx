import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "./FormUserModal.scss";
import { useUser } from "../../../../hooks/useUser"; // Hook quản lý user
import { User } from "../../../../types/user"; // Loại dữ liệu user

interface FormUserModalProps {
  show: boolean;
  onClose: () => void;
  id?: number | null;
}

interface CreateUserRequest {
  username: string;
  email: string;
  bio?: string;
  date_of_birth?: string; // YYYY-MM-DD
  is_staff: boolean;
  is_superuser: boolean;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
  bio?: string;
  date_of_birth?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

const FormUserModal: React.FC<FormUserModalProps> = ({ show, onClose, id }) => {
  const { getUserById, createUser, updateUser } = useUser();

  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
    date_of_birth: "",
    is_staff: false,
    is_superuser: false,
  });

  const resetForm = () => {
    setUser({
      username: "",
      email: "",
      bio: "",
      date_of_birth: "",
      is_staff: false,
      is_superuser: false,
    });
  };

  const fetchUser = useCallback(
    async (id: number) => {
      try {
        const response = await getUserById(id);
        if (!response) return toast.error("User not found.");

        setUser({
          username: response.username || "",
          email: response.email || "",
          bio: response.bio || "",
          date_of_birth: response.date_of_birth || "",
          is_staff: response.is_staff || false,
          is_superuser: response.is_superuser || false,
        });

        toast.info("User loaded for editing.");
      } catch {
        toast.error("Failed to load user data.");
      }
    },
    [getUserById],
  );

  useEffect(() => {
    if (id) fetchUser(id);
  }, [fetchUser, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { username, email, bio, date_of_birth, is_staff, is_superuser } =
      user;

    if (!username.trim()) return toast.error("Username is required.");
    if (!email.trim()) return toast.error("Email is required.");

    const userData: CreateUserRequest | UpdateUserRequest = {
      username,
      email,
      bio,
      date_of_birth,
      is_staff,
      is_superuser,
    };

    try {
      let result;
      if (id) {
        result = await updateUser(id, userData as UpdateUserRequest);
      } else {
        result = await createUser(userData as CreateUserRequest);
      }

      if (result) {
        toast.success(
          id ? "User updated successfully!" : "User added successfully!",
        );
        onClose();
      }
    } catch (error) {
      toast.error("Something went wrong when saving the user.");
      console.error(error);
    }
  };

  return (
    <>
      <div className={`overlay ${show ? "show" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5>{id ? "Edit User" : "Add User"}</h5>
            <button
              className="close-button"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {/* Row 1: Username */}
            <div className="form-row">
              <div className="form-group full">
                <label>Username</label>
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="form-row">
              <div className="form-group full">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3: Bio */}
            <div className="form-row">
              <div className="form-group full">
                <label>Bio</label>
                <input
                  className="input"
                  type="text"
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 4: Date of Birth */}
            <div className="form-row">
              <div className="form-group full">
                <label>Date of Birth</label>
                <input
                  className="input"
                  type="date"
                  name="date_of_birth"
                  value={user.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 5: User Roles (2 cột) */}
            <div className="form-row">
              <div className="form-group half checkbox-group">
                <label htmlFor="is_staff">Staff</label>
                <input
                  id="is_staff"
                  type="checkbox"
                  checked={user.is_staff}
                  onChange={(e) =>
                    setUser({ ...user, is_staff: e.target.checked })
                  }
                />
              </div>
              <div className="form-group half checkbox-group">
                <label htmlFor="is_superuser">Superuser</label>
                <input
                  id="is_superuser"
                  type="checkbox"
                  checked={user.is_superuser}
                  onChange={(e) =>
                    setUser({ ...user, is_superuser: e.target.checked })
                  }
                />
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
              {id ? "Update User" : "Save User"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormUserModal;
