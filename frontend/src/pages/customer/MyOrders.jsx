import React, { useEffect, useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import "./MyOrders.css";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      fetch("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((r) => r.json())
        .then((data) => {
          console.log("ORDERS FROM API:", data);   // ← ADD THIS
          setOrders(data);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }, []);


  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">
        <h2 className="page-title">My Orders</h2>

        {loading ? (
          <div className="muted">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-box">
            <p>You have no orders yet.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Payment</th> {/* Payment Column */}
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

                    <tbody>
  {orders.map((o) => {
    const itemList = Array.isArray(o.items)
      ? o.items.map((it) => `${it.product_name} (x${it.quantity})`).join(", ")
      : "—";

    return (
      <tr key={o.order_id}>
        <td>{itemList}</td>
        <td>{new Date(o.order_date).toLocaleString()}</td>
        <td>{o.payment_method || "—"}</td>
        <td>₱{Number(o.total_amount).toFixed(2)}</td>
        <td>
          <span className={`status-pill ${o.status.toLowerCase()}`}>
            {o.status}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>



          </table>
        )}
      </main>
    </div>
  );
}