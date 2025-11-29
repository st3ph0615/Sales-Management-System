import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Load users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  // Update role
  const changeRole = async (id, newRole) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });

    setUsers(users.map(u => (u.user_id === id ? { ...u, role: newRole } : u)));
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsers(users.filter(u => u.user_id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <h1 className="admin-page-title">Users</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">No users found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.user_id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.user_id, e.target.value)}
                        className="role-select"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn small danger" onClick={() => deleteUser(u.user_id)}>
                        Delete
                      </button>
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
