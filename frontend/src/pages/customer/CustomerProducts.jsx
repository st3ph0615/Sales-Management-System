// --- your imports remain unchanged ---
import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import "./CustomerProducts.css";

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("default");

  const [perPage, setPerPage] = useState(24);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // derive filter lists
  const { categories, colors, sizes, brands, priceMin, priceMax } = useMemo(() => {
    const cats = new Set();
    const cols = new Set();
    const szs = new Set();
    const brs = new Set();
    let min = Infinity;
    let max = -Infinity;

    products.forEach((p) => {
      if (p.category) cats.add(p.category);
      if (p.color) {
        if (Array.isArray(p.color)) p.color.forEach((c) => cols.add(String(c).trim()));
        else String(p.color)
          .split(",")
          .forEach((c) => cols.add(c.trim()));
      }
      if (p.size) {
        if (Array.isArray(p.size)) p.size.forEach((s) => szs.add(String(s).trim()));
        else String(p.size)
          .split(",")
          .forEach((s) => szs.add(s.trim()));
      }
      if (p.brand) brs.add(p.brand);

      const price = Number(p.price) || 0;
      min = Math.min(min, price);
      max = Math.max(max, price);
    });

    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 1000;

    return {
      categories: Array.from(cats).sort(),
      colors: Array.from(cols).sort(),
      sizes: Array.from(szs).sort(),
      brands: Array.from(brs).sort(),
      priceMin: Math.floor(min),
      priceMax: Math.ceil(max),
    };
  }, [products]);

  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  const toggleSet = (setRef, setter, value) => {
    const next = new Set(setRef);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    const minP = Number(priceRange[0]);
    const maxP = Number(priceRange[1]);

    let list = products.filter((p) => {
      if (p.is_active === false) return false;
      if (search && !p.product_name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (selectedCategories.size > 0 && !selectedCategories.has(p.category))
        return false;

      if (selectedColors.size > 0) {
        const prodColors = Array.isArray(p.color)
          ? p.color.map((c) => c.toLowerCase())
          : String(p.color)
              .split(",")
              .map((c) => c.trim().toLowerCase());

        const match = Array.from(selectedColors).some((c) =>
          prodColors.includes(c.toLowerCase())
        );
        if (!match) return false;
      }

      if (selectedSizes.size > 0) {
        const prodSizes = Array.isArray(p.size)
          ? p.size.map((s) => s.toLowerCase())
          : String(p.size)
              .split(",")
              .map((s) => s.trim().toLowerCase());

        const match = Array.from(selectedSizes).some((s) =>
          prodSizes.includes(s.toLowerCase())
        );
        if (!match) return false;
      }

      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;

      const price = Number(p.price) || 0;
      if (price < minP || price > maxP) return false;

      return true;
    });

    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest")
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return list;
  }, [
    products,
    search,
    selectedCategories,
    selectedColors,
    selectedSizes,
    selectedBrands,
    priceRange,
    sortBy,
  ]);

  const displayed = filtered.slice(0, perPage);

  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">
        {/* filters header stays unchanged */}
        
        <section className="product-grid">
          {loading && <div className="muted">Loading products…</div>}
          {!loading && displayed.length === 0 && (
            <div className="muted">No products found.</div>
          )}

          <div className="grid">
            {displayed.map((p) => (
              <div className="grid-card" key={p.product_id}>
                <div className="grid-img-wrap">
                  <img src={p.image_url} alt={p.product_name} />
                </div>

                <div className="grid-info">
                  <h3 className="grid-title">{p.product_name}</h3>
                  <div className="grid-meta">
                    <div className="grid-price">
                      ₱{Number(p.price || 0).toFixed(2)}
                    </div>
                    {p.stock_quantity !== undefined && (
                      <div className="grid-stock">{p.stock_quantity} in stock</div>
                    )}
                  </div>

                  {p.color && (
                    <div className="color-swatches">
                      {(Array.isArray(p.color)
                        ? p.color
                        : String(p.color).split(",")
                      )
                        .slice(0, 4)
                        .map((c, idx) => (
                          <span
                            key={idx}
                            className="swatch"
                            title={c.trim()}
                            style={{ backgroundColor: c.trim().toLowerCase() }}
                          />
                        ))}
                    </div>
                  )}

                  {/* 🚫 Removed Add to Cart */}
                  <div className="grid-actions">
                    <Link
                      to={`/customer/products/${p.product_id}`}
                      className="btn primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
