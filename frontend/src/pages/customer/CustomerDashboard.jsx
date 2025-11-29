import CustomerSidebar from "./CustomerSidebar";
import { useEffect, useState } from "react";
import "./CustomerPages.css";

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        console.log("PRODUCTS:", data);
        setProducts(data);
      })
      .catch((err) => console.error("Product fetch failed:", err));
  }, []);

        const [slidePosition, setSlidePosition] = useState(0);

const cardWidth = 260; // card width + margin
const visibleCards = 3; // show 3 at a time

const moveSlide = (direction) => {
  const totalCards = products.length;
  const maxPosition = -(cardWidth * (totalCards - visibleCards));

  setSlidePosition((prev) => {
    let next = prev + direction * -cardWidth;

    // Prevent sliding too far left or right
    if (next > 0) next = 0; 
    if (next < maxPosition) next = maxPosition;

    return next;
  });
};


        



  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">

        {/* Search Bar */}
        <div className="cd-search-container">
          <input className="cd-search" placeholder="Search" />
        </div>

        {/* Greeting */}
        <h1 className="cd-greeting">
          Hi, {user?.email?.split("@")[0] || "Customer"}
        </h1>

       
<section className="featured-section">
  <h2>Featured Products</h2>

  <div className="slider-wrapper">

    <button className="slider-arrow left" onClick={() => moveSlide(-1)}>
      ←
    </button>

    <div className="slider-window">
      <div
        className="slider-track"
        id="sliderTrack"
        style={{ transform: `translateX(${slidePosition}px)` }}
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

    {/* RIGHT ARROW placed at the 4th product */}
    <button className="slider-arrow arrow-4th" onClick={() => moveSlide(1)}>
      →
    </button>

  </div>
</section>





        <section className="cd-section" style={{ marginTop: "40px"}}>
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
