import { Outlet } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import AdminSidebar from "../../../pages/admin/adminSideBar/AdminSidebar";
import Header from "../../../pages/admin/header/header";
import "./admin-layout.scss";
import { useAuth } from "@/contexts/authContext";

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (!user || user.is_staff === false) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div className={`app-container`}>
      <div className="admin-container">
        <div className="admin-header">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        <div className="admin-content">
          <div className="admin-sidebar">
            <AdminSidebar collapsed={collapsed} />
          </div>

          <div className={`admin-main ${collapsed ? "collapsed" : ""}`}>
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default memo(AdminLayout);
