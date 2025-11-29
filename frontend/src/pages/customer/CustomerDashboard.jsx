import CustomerSidebar from "./CustomerSidebar";
import { useEffect, useState } from "react";
import "./CustomerPages.css";

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3000/api/products/")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Product fetch failed:", err));
  }, []);

  // ========== INFINITE SLIDER ==========
  const [index, setIndex] = useState(0);

  const slideBy = 4;
  const cardWidth = 260;
  const totalCards = products.length;

  const getTranslateX = () => -(index * cardWidth);

  const next = () => {
    setIndex((prev) => {
      if (prev + slideBy >= totalCards) return 0;
      return prev + slideBy;
    });
  };

  const prev = () => {
    setIndex((prev) => {
      if (prev - slideBy < 0) {
        const lastGroup = Math.floor((totalCards - 1) / slideBy) * slideBy;
        return lastGroup;
      }
      return prev - slideBy;
    });
  };
  // =====================================

  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">
        <div className="cd-search-container">
          <input className="cd-search" placeholder="Search" />
        </div>

        <h1 className="cd-greeting">
          Hi, {user?.email?.split("@")[0] || "Customer"}
        </h1>

        {/* === FEATURED PRODUCTS === */}
        <section className="featured-section">
          <h2>Featured Products</h2>

          <div className="slider-wrapper">

            {/* LEFT ARROW */}
            <button className="slider-arrow left" onClick={prev}>
              ❮
            </button>

            <div className="slider-window">
              <div
                className="slider-track"
                style={{ transform: `translateX(${getTranslateX()}px)` }}
              >
                {products.map((p) => (
                  <div className="slider-card" key={p.product_id}>
                    <img src={p.image_url} alt={p.product_name} />
                    <h4>{p.product_name}</h4>
                    <p className="price">₱{p.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ARROW */}
            <button className="slider-arrow right" onClick={next}>
              ❯
            </button>

          </div>
        </section>

        {/* === TRANSACTION === */}
        <section className="cd-section" style={{ marginTop: "40px" }}>
          <h2>Transaction History</h2>

          <div className="cd-table-card">
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No transactions yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
