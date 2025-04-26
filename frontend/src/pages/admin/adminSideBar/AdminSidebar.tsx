import React from "react";
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

  return (
    <Sidebar className="sidebarAdmin" collapsed={collapsed} breakPoint="md">
      <Menu>
        <MenuItem
          icon={<FaUserAlt />}
          onClick={() => navigate("/admin/artist")}
        >
          <span>Artist</span>
        </MenuItem>
        <MenuItem
          icon={<FaCompactDisc />}
          onClick={() => navigate("/admin/album")}
        >
          <span>Album</span>
        </MenuItem>
        <MenuItem
          icon={<FaHeadphones />}
          onClick={() => navigate("/admin/song")}
        >
          <span>Song</span>
        </MenuItem>
        <MenuItem
          icon={<FaListUl />}
          onClick={() => navigate("/admin/playlist")}
        >
          <span>Playlist</span>
        </MenuItem>
        <MenuItem icon={<FaTags />} onClick={() => navigate("/admin/genre")}>
          <span>Genres</span>
        </MenuItem>
        <MenuItem
          icon={<FiSettings />}
          onClick={() => navigate("/admin/settings")}
        >
          <span>Settings</span>
        </MenuItem>
        <MenuItem icon={<FiLogOut />}>
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
