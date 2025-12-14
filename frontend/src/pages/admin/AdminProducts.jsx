import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ LOW STOCK TOGGLE STATE (ADDED)
  const [showLowStock, setShowLowStock] = useState(false);
  // ✅ SEARCH STATE (ADDED)
  const [search, setSearch] = useState("");


  // Add product form
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
    fetch("http://localhost:5000/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

    const displayedProducts = products
    .filter(p => (showLowStock ? p.stock_quantity <= 5 : true))
    .filter(p =>
      p.product_name.toLowerCase().includes(search.toLowerCase())
    );


  // --------------------------
  // ADD PRODUCT
  // --------------------------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/admin/products", {
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

    setForm({
      product_name: "",
      category: "",
      price: "",
      stock_quantity: "",
      image_url: ""
    });

    loadProducts();
  };

  // --------------------------
  // SAVE EDITED PRODUCT
  // --------------------------
  const saveProductChanges = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admin/products/${editingProduct.product_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      }
    );

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Product updated!");

    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === editingProduct.product_id ? editingProduct : p
      )
    );

    setEditingProduct(null);
  };

  // --------------------------
  // DELETE PRODUCT
  // --------------------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Delete failed: " + data.error);
      return;
    }

    alert("Product deleted permanently");

    setProducts(prev => prev.filter(p => p.product_id !== id));
  };

  return (
    <AdminLayout>
      <div className="admin-products-page">

        {/* ✅ HEADER WITH LOW-STOCK BUTTON (ADDED) */}
        <div className="products-header">
  <h1>Products</h1>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <input
      type="text"
      placeholder="Search product name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "6px 10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginBottom: "10px"
      }}
    />

    <button
      className="btn small"
      onClick={() => setShowLowStock(prev => !prev)}
    >
      {showLowStock ? "View All Products" : "View Low-Stock Items"}
    </button>
  </div>
</div>


        {/* ADD PRODUCT FORM */}
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
            onChange={(e) =>
              setForm({ ...form, stock_quantity: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            required
          />

          <button type="submit" className="btn primary">
            Add Product
          </button>
        </form>

        {/* PRODUCT TABLE */}
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
              {displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    No products found.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p) => (
                  <tr key={p.product_id}>
                    <td>
                      <img src={p.image_url} alt="" className="prod-img" />
                    </td>
                    <td>{p.product_name}</td>
                    <td>{p.category}</td>
                    <td>₱{Number(p.price).toFixed(2)}</td>
                    <td>{p.stock_quantity}</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => setEditingProduct(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => deleteProduct(p.product_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* EDIT MODAL */}
        {editingProduct && (
          <div className="modal-backdrop">
            <div className="modal">
              <h2>Edit Product</h2>

              <input
                value={editingProduct.product_name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    product_name: e.target.value
                  })
                }
              />

              <input
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value
                  })
                }
              />

              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value)
                  })
                }
              />

              <input
                type="number"
                value={editingProduct.stock_quantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock_quantity: Number(e.target.value)
                  })
                }
              />

              <input
                value={editingProduct.image_url}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    image_url: e.target.value
                  })
                }
              />

              <div className="modal-actions">
                <button className="btn primary" onClick={saveProductChanges}>
                  Save
                </button>
                <button className="btn" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
