import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div>
      <AdminSidebar />

      <main
        style={{
          marginLeft: "260px",
          padding: "30px",
          minHeight: "100vh",
          background: "#f3f4f6",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;