import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={`admin-link ${location.pathname.includes("dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className={`admin-link ${location.pathname.includes("products") ? "active" : ""}`}
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className={`admin-link ${location.pathname.includes("orders") ? "active" : ""}`}
          >
            Orders
          </Link>

          <Link
            to="/admin/users"
            className={`admin-link ${location.pathname.includes("users") ? "active" : ""}`}
          >
            Users
          </Link>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
