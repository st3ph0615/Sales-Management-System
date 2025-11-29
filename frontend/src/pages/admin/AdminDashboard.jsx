import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout"; 
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch admin stats");
        return r.json();
      })
      .then(setStats)
      .catch(err => console.error("Admin fetch error:", err));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="admin-page-title">Admin Dashboard</h1>

        {!stats ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-label">Products</div>
              <div className="stats-value">{stats.totalProducts}</div>
            </div>

            <div className="stats-card">
              <div className="stats-label">Orders</div>
              <div className="stats-value">{stats.totalOrders}</div>
            </div>

            <div className="stats-card">
              <div className="stats-label">Customers</div>
              <div className="stats-value">{stats.totalCustomers}</div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
