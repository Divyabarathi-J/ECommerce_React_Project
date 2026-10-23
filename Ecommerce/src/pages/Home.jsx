
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { fetchProducts, categories, matchesCategory } from "../store/productsSlice";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const { items, loading, error } = useSelector((state) => state.products);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("0");
  const [inStock, setInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!items.length) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params]);

 

  const brands = useMemo(
    () => [...new Set(items.map((p) => p.brand).filter(Boolean))].sort(),
    [items]
  );

  const products = useMemo(() => {
    const result = items.filter((p) => {
      const text = `${p.title} ${p.brand || ""} ${p.description || ""} ${p.category || ""}`.toLowerCase();

      return (
        text.includes(search.trim().toLowerCase()) &&
        matchesCategory(p, category) &&
        (brand === "all" || p.brand === brand) &&
        (minPrice === "" || p.price >= Number(minPrice)) &&
        (maxPrice === "" || p.price <= Number(maxPrice)) &&
        p.rating >= Number(rating) &&
        (!inStock || p.stock > 0)
      );
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [items, search, category, sort, brand, minPrice, maxPrice, rating, inStock]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("default");
    setBrand("all");
    setMinPrice("");
    setMaxPrice("");
    setRating("0");
    setInStock(false);
  };

  return (
    <main className="home">
      

      <section className="hero">
        <h1>{category === "all" ? "All Products" : categories.find((c) => c.value === category)?.name || category}</h1>
        <span>Showing {products.length} of {items.length} products</span>
      </section>

      <section className="collection">
        <div className="section-heading">
          <div>
            <h2>Products</h2>
            <span>Browse and filter our collection</span>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>
        </div>

        <div className="filter-row">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              style={category === c.value ? { background: "#1b1f2a", color: "white" } : {}}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="advanced-filters">
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <label className="stock-filter">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            In stock
          </label>

          <button className="filter-toggle" onClick={() => setShowFilters((open) => !open)}>
            ⚙ Filters {showFilters ? "−" : "+"}
          </button>

          {showFilters && (
            <div className="filter-panel">
              <label>
                Min Price ($)
                <input type="number" min="0" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </label>

              <label>
                Max Price ($)
                <input type="number" min="0" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </label>

              <label>
                Rating
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="0">All ratings</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="4.5">4.5+ stars</option>
                </select>
              </label>

              <button className="reset-filters" onClick={resetFilters}>Clear filters</button>
            </div>
          )}
        </div>

        {loading && <p className="message">Loading products...</p>}

        {error && (
          <div className="message">
            <p>Unable to load products: {error}</p>
            <button className="add-button" onClick={() => dispatch(fetchProducts())}>Try again</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="message">No products match these filters. Try changing your selection.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </main>
  );
}
