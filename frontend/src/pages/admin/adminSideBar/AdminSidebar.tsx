import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaUserAlt,
  FaCompactDisc,
  FaHeadphones,
  FaListUl,
  FaTags,
} from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import "./AdminSidebar.scss";

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string>("artist"); // mặc định chọn "artist" luôn

  const handleMenuClick = (item: string) => {
    console.log("is submit", item);
    setSelectedItem(item);
    navigate(`/admin/${item.toLowerCase()}`);
  };

  return (
    <Sidebar className="sidebarAdmin" collapsed={collapsed} breakPoint="md">
      <Menu>
        <MenuItem
          icon={<FaUserAlt />}
          className={`${selectedItem === "artist" ? "active" : ""}`}
          onClick={() => handleMenuClick("artist")}
        >
          <span>Artist</span>
        </MenuItem>

        <MenuItem
          icon={<FaCompactDisc />}
          className={`${selectedItem === "album" ? "active" : ""}`}
          onClick={() => handleMenuClick("album")}
        >
          <span>Album</span>
        </MenuItem>

        <MenuItem
          icon={<FaHeadphones />}
          className={`${selectedItem === "song" ? "active" : ""}`}
          onClick={() => handleMenuClick("song")}
        >
          <span>Song</span>
        </MenuItem>

        <MenuItem
          icon={<FaListUl />}
          className={`${selectedItem === "playlist" ? "active" : ""}`}
          onClick={() => handleMenuClick("playlist")}
        >
          <span>Playlist</span>
        </MenuItem>

        <MenuItem
          icon={<FaTags />}
          className={`${selectedItem === "genre" ? "active" : ""}`}
          onClick={() => handleMenuClick("genre")}
        >
          <span>Genres</span>
        </MenuItem>
        <MenuItem
          icon={<FaUserAlt />}
          className={`${selectedItem === "user" ? "active" : ""}`}
          onClick={() => handleMenuClick("user")}
        >
          <span>Artist</span>
        </MenuItem>
        <MenuItem
          icon={<FiSettings />}
          className={`${selectedItem === "settings" ? "active" : ""}`}
          onClick={() => handleMenuClick("settings")}
        >
          <span>Settings</span>
        </MenuItem>

        <MenuItem
          icon={<FiLogOut />}
          className={`${selectedItem === "logout" ? "active" : ""}`}
          onClick={() => handleMenuClick("logout")}
        >
          <span>Log Out</span>
        </MenuItem>
      </Menu>

      <div
        className="sidebar-footer-container d-flex"
        style={{
          backgroundColor: "rgba(33, 40, 50, 0.05)",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div className="sidebar-footer-content">
          <div className="sidebar-footer-subtitle">Logged in as:</div>
          <div className="sidebar-login-name">Guest</div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
