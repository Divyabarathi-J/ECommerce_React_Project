
import { Link, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectTotalItems } from "../store/cartSlice";

export default function Navbar() {
  const count = useSelector(selectTotalItems);
  const wishlist = useSelector((state) => state.cart.wishlist);
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : "/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        E<span>Commerce</span>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 140 }}>
        <input
          className="search-input"
          style={{ margin: 0, background: "#303646", border: 0, color: "white" }}
          placeholder="⌕ Search products"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            const query = e.target.value.trim();
            navigate(query ? `/?search=${encodeURIComponent(query)}` : "/");
          }}
        />
      </form>

      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
        <Link to="/cart">
          🛒 Cart <span style={{ background: "#c2410c", padding: "4px 8px", borderRadius: 20 }}>{count}</span>
        </Link>
      </div>
    </nav>
  );
}
