import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add product form data
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    price: "",
    stock_quantity: "",
    image_url: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.error) return alert(data.error);

    alert("Product added successfully!");

    // Reset form
    setForm({
      product_name: "",
      category: "",
      price: "",
      stock_quantity: "",
      image_url: ""
    });

    // Reload
    loadProducts();
  };

  return (
    <AdminLayout>
      <div className="admin-products-page">
        <h1>Products</h1>

        {/* INLINE ADD FORM */}
        <form className="add-product-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={form.product_name}
            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock_quantity}
            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            required
          />

          <button type="submit" className="btn primary">Add Product</button>
        </form>

        {/* LOADING */}
        {loading ? (
          <p className="loading">Loading products...</p>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.product_id}>
                    <td>
                      <img src={p.image_url} alt="" className="prod-img" />
                    </td>
                    <td>{p.product_name}</td>
                    <td>{p.category}</td>
                    <td>₱{Number(p.price).toFixed(2)}</td>
                    <td>{p.stock_quantity}</td>
                    <td>
                      <button className="btn small">Edit</button>
                      <button className="btn small danger">Delete</button>
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
