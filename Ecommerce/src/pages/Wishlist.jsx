
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, toggleWishlist } from "../store/cartSlice";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart.wishlist);
  const cartItems = useSelector((state) => state.cart.items);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("recentlyViewed") || "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  const moveToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      dispatch(addToCart({ product, quantity: 1 }));
    } else {
      dispatch(addToCart(product));
    }

    dispatch(toggleWishlist(product));
  };

  return (
    <main className="cart-page">
      <div className="section-heading">
        <div>
          <h1>My wishlist</h1>
          <span>{wishlist.length} saved products</span>
        </div>
        <Link to="/" style={{ fontSize: 13, textDecoration: "underline" }}>
          Continue shopping
        </Link>
      </div>

      {!wishlist.length ? (
        <section className="empty-cart">
          <h1>Your wishlist is empty</h1>
          <p>Save products you love and find them here later.</p>
          <Link to="/" className="add-button">Browse products</Link>
        </section>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
              <button className="text-button" onClick={() => dispatch(toggleWishlist(product))}>
                Remove from wishlist
              </button>
              <button className="text-button" onClick={() => moveToCart(product)}>
                Move to cart
              </button>
            </div>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <section className="collection recently-viewed">
          <div className="section-heading">
            <div>
              <h2>Recently Viewed</h2>
              <span>Products you've explored</span>
            </div>
          </div>
          <div className="product-grid">
            {recent.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
