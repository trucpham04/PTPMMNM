import React from "react";
import { FaBars, FaChevronRight } from "react-icons/fa";
import { FiBell, FiMail } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import "./header.scss";
interface HeaderProps {
  setCollapsed: (value: boolean) => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ setCollapsed, collapsed }) => {
  return (
    <nav className="header-navbar">
      <div className="header-left">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-icon toggle-btn"
        >
          <FaBars />
        </button>
        <a href="#" className="brand">
          Spotify Admin
        </a>
      </div>

      {/* <form className="header-search d-none d-lg-block">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="search-input"
          />
          <div className="search-icon">
            <IoIosSearch />
          </div>
        </div>
      </form> */}

      <ul className="header-nav">
        <li className="nav-item d-none d-md-block">
          {/* <a href="#" className="nav-link">
            Documentation <FaChevronRight />
          </a> */}
        </li>
        <li className="nav-item">
          {/* <button className="btn-icon">
            <FiBell />
          </button> */}
        </li>
        <li className="nav-item">
          {/* <button className="btn-icon">
            <FiMail />
          </button> */}
        </li>
        <li className="nav-item">
          <button className="avatar-btn">
            {/* <img src="..." alt="User avatar" /> */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
