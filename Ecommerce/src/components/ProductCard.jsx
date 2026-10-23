
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, toggleWishlist } from "../store/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);
  const saved = wishlist.some((p) => String(p.id) === String(product.id));

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
        />
      </Link>

      <button
        className={`wishlist-button ${saved ? "saved" : ""}`}
        onClick={() => dispatch(toggleWishlist(product))}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      >
        {saved ? "♥" : "♡"}
      </button>

      <p className="product-brand">{product.brand || product.category}</p>
      <Link to={`/product/${product.id}`} className="product-title">
        {product.title}
      </Link>
      <p className="rating">★ {product.rating || "New"}</p>

      <div className="product-bottom">
        <strong>${Number(product.price).toFixed(2)}</strong>
        <button
          className="add-button"
          onClick={() => dispatch(addToCart(product))}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
