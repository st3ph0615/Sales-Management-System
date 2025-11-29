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
  const [priceRange, setPriceRange] = useState([0, 10000]); // [min, max]
  const [sortBy, setSortBy] = useState("default"); // default | price_asc | price_desc | newest

  // Pagination / grid controls
  const [perPage, setPerPage] = useState(24);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/products/")
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

  // Derive filter options from products when available
  const { categories, colors, sizes, brands, priceMin, priceMax } = useMemo(() => {
    const cats = new Set();
    const cols = new Set();
    const szs = new Set();
    const brs = new Set();
    let min = Infinity;
    let max = -Infinity;

    products.forEach((p) => {
      if (p.category) cats.add(p.category);
      // flexible: expect product.color maybe comma-separated or array
      if (p.color) {
        if (Array.isArray(p.color)) p.color.forEach(c => cols.add(String(c).trim()));
        else String(p.color).split(",").forEach(c => cols.add(c.trim()));
      }
      // size
      if (p.size) {
        if (Array.isArray(p.size)) p.size.forEach(s => szs.add(String(s).trim()));
        else String(p.size).split(",").forEach(s => szs.add(s.trim()));
      }
      if (p.brand) brs.add(p.brand);
      const price = Number(p.price) || 0;
      if (!isNaN(price)) {
        if (price < min) min = price;
        if (price > max) max = price;
      }
    });

    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 1000;

    return {
      categories: Array.from(cats).sort(),
      colors: Array.from(cols).sort(),
      sizes: Array.from(szs).sort(),
      brands: Array.from(brs).sort(),
      priceMin: Math.floor(min),
      priceMax: Math.ceil(max),
    };
  }, [products]);

  // initialize priceRange from derived min/max
  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  // Utility toggles for Sets
  const toggleSet = (setRef, setter, value) => {
    const next = new Set(setRef);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  // Filter products according to selected filters
  const filtered = useMemo(() => {
    const minP = Number(priceRange[0]);
    const maxP = Number(priceRange[1]);

    let list = products.filter((p) => {
      // only active products
      if (p.is_active === false) return false;

      // search by name
      if (search && !p.product_name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // category filter
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) {
        return false;
      }

      // color filter (product may have p.color as string or array)
      if (selectedColors.size > 0) {
        const prodColors = [];
        if (p.color) {
          if (Array.isArray(p.color)) prodColors.push(...p.color.map(c => String(c).toLowerCase()));
          else prodColors.push(...String(p.color).split(",").map(s => s.trim().toLowerCase()));
        }
        const hasAnyColor = Array.from(selectedColors).some(c => prodColors.includes(c.toLowerCase()));
        if (!hasAnyColor) return false;
      }

      // size filter
      if (selectedSizes.size > 0) {
        const prodSizes = [];
        if (p.size) {
          if (Array.isArray(p.size)) prodSizes.push(...p.size.map(s => String(s).toLowerCase()));
          else prodSizes.push(...String(p.size).split(",").map(s => s.trim().toLowerCase()));
        }
        const hasAnySize = Array.from(selectedSizes).some(s => prodSizes.includes(s.toLowerCase()));
        if (!hasAnySize) return false;
      }

      // brand filter
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) {
        return false;
      }

      // price
      const price = Number(p.price) || 0;
      if (price < minP || price > maxP) return false;

      return true;
    });

    // sorting
    if (sortBy === "price_asc") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

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

  // display slice for pagination (optional)
  const displayed = filtered.slice(0, perPage);

  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">
        <div className="products-topbar">
          <div className="filters-left">
            <span className="filter-label">Filter by</span>

            {/* Category dropdown */}
            <div className="filter-group">
              <label>Categories</label>
              <div className="filter-options">
                {categories.length === 0 ? <small className="muted">No categories</small> :
                  categories.map(cat => (
                    <button
                      key={cat}
                      className={`pill ${selectedCategories.has(cat) ? "active" : ""}`}
                      onClick={() => toggleSet(selectedCategories, setSelectedCategories, cat)}
                    >
                      {cat}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Color dropdown */}
            <div className="filter-group">
              <label>Color</label>
              <div className="filter-options colors">
                {colors.length === 0 ? <small className="muted">No colors</small> :
                  colors.map(col => (
                    <button
                      key={col}
                      className={`color-dot ${selectedColors.has(col) ? "selected" : ""}`}
                      title={col}
                      onClick={() => toggleSet(selectedColors, setSelectedColors, col)}
                      style={{ backgroundColor: col.toLowerCase() }}
                    />
                  ))
                }
              </div>
            </div>

            {/* Size */}
            <div className="filter-group">
              <label>Size</label>
              <div className="filter-options">
                {sizes.length === 0 ? <small className="muted">No sizes</small> :
                  sizes.map(s => (
                    <button
                      key={s}
                      className={`pill ${selectedSizes.has(s) ? "active" : ""}`}
                      onClick={() => toggleSet(selectedSizes, setSelectedSizes, s)}
                    >
                      {s}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Brand */}
            <div className="filter-group">
              <label>Brand</label>
              <div className="filter-options">
                {brands.length === 0 ? <small className="muted">No brands</small> :
                  brands.map(b => (
                    <button
                      key={b}
                      className={`pill ${selectedBrands.has(b) ? "active" : ""}`}
                      onClick={() => toggleSet(selectedBrands, setSelectedBrands, b)}
                    >
                      {b}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Price range simple inputs */}
            <div className="filter-group price-range">
              <label>Price</label>
              <div className="price-inputs">
                <input
                  type="number"
                  min={priceMin}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value || priceMin), priceRange[1]])}
                />
                <span>—</span>
                <input
                  type="number"
                  max={priceMax}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value || priceMax)])}
                />
              </div>
            </div>
          </div>

          <div className="filters-right">
            <input
              className="prod-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default Sorting</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>

            <select className="perpage-select" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <section className="product-grid">
          {loading && <div className="muted">Loading products…</div>}
          {!loading && displayed.length === 0 && <div className="muted">No products found.</div>}

          <div className="grid">
            {displayed.map((p) => (
              <div className="grid-card" key={p.product_id}>
                <div className="grid-img-wrap">
                  <img src={p.image_url} alt={p.product_name} />
                </div>
                <div className="grid-info">
                  <h3 className="grid-title">{p.product_name}</h3>
                  <div className="grid-meta">
                    <div className="grid-price">₱{Number(p.price || 0).toFixed(2)}</div>
                    {p.stock_quantity !== undefined && <div className="grid-stock">{p.stock_quantity} in stock</div>}
                  </div>

                  {/* color swatches if available */}
                  {p.color && (
                    <div className="color-swatches">
                      {(
                        Array.isArray(p.color)
                          ? p.color
                          : String(p.color).split(",")
                      ).slice(0, 4).map((c, idx) => (
                        <span key={idx} className="swatch" title={c.trim()} style={{ backgroundColor: c.trim().toLowerCase() }} />
                      ))}
                    </div>
                  )}

                  <div className="grid-actions">
                    <Link to={`/customer/products/${p.product_id}`} className="btn primary">View</Link>
                    <button  className="btn outline">Add to cart</button>
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
