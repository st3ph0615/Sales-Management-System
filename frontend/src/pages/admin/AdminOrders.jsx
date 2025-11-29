import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (order_id, newStatus) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/admin/orders/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();

    if (data.error) return alert(data.error);

    setOrders(prev =>
      prev.map(o => (o.order_id === order_id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <AdminLayout>
      <div className="admin-orders-page">
        <h1>Orders</h1>

        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : (
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">No orders found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id}>
                    <td>{o.order_id.slice(0, 8)}</td>
                    <td>{o.customer_name}</td>
                    <td>₱{Number(o.total_amount).toFixed(2)}</td>
                    <td>{o.payment_status}</td>
                    <td>{o.status}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.order_id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
