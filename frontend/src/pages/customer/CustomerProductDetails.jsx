import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import "./CustomerProductDetails.css";

export default function CustomerProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentMethods = [
    "Cash on Delivery",
    "GCash",
    "PayMaya",
    "Bank Transfer",
    "Debit/Credit Card"
  ];
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Product not found");
        return r.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Failed to load product", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  //  Add to Cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.product_id === product.product_id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        image_url: product.image_url,
        price: product.price,
        quantity
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  //  NEW BUY NOW (redirect to checkout, NOT create order)
  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.customer_id) {
      alert("Please login to purchase.");
      navigate("/login");
      return;
    }

    // Save ONLY this product into cart
    const tempCart = [
      {
        product_id: product.product_id,
        product_name: product.product_name,
        image_url: product.image_url,
        price: Number(product.price),
        quantity: quantity
      }
    ];

    localStorage.setItem("cart", JSON.stringify(tempCart));

    // Redirect to checkout page
    navigate("/customer/checkout");
  };

  // Rendering
  if (loading)
    return (
      <div className="cd-layout">
        <CustomerSidebar />
        <main className="cd-main">
          <div className="muted">Loading product...</div>
        </main>
      </div>
    );

  if (!product)
    return (
      <div className="cd-layout">
        <CustomerSidebar />
        <main className="cd-main">
          <div className="muted">Product not found.</div>
        </main>
      </div>
    );

  return (
    <div className="cd-layout">
      <CustomerSidebar />
      <main className="cd-main">
        <div className="product-detail-grid">
          <div className="detail-image">
            <img src={product.image_url} alt={product.product_name} />
          </div>

          <div className="detail-info">
            <h2>{product.product_name}</h2>
            <p className="detail-price">₱{Number(product.price || 0).toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>

            <p><strong>In stock:</strong> {product.stock_quantity ?? "—"}</p>
            <p><strong>Category:</strong> {product.category ?? "—"}</p>

            <label>Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock_quantity || 100}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value || 1)))
              }
            />

            <label>Payment method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div style={{ marginTop: 16, display: "flex", gap: "10px" }}>
              <button className="btn secondary" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <button className="btn primary" onClick={handleBuyNow} disabled={buying}>
                {buying ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}