
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, toggleWishlist } from "../store/cartSlice";

function ProductImage({ product }) {
  const images = [...(product.images || []), product.thumbnail].filter(
    (url, index, list) =>
      typeof url === "string" &&
      url.startsWith("https://") &&
      list.indexOf(url) === index
  );
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [product.id]);

  if (!images[index]) return <p>Product image unavailable</p>;

  return (
    <img
      src={images[index]}
      alt={product.title}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, wishlist } = useSelector((state) => state.cart);
  const { items: products, loading } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const saved = wishlist.some((p) => String(p.id) === id);
  const inCart = items.find((p) => String(p.id) === id);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setError("");
    setQuantity(1);

    const existing = products.find((p) => String(p.id) === id);

    if (existing) {
      setProduct(existing);
      return () => { active = false; };
    }

    if (loading) return () => { active = false; };

    fetch(`https://dummyjson.com/products/${encodeURIComponent(id)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Product not found");
        return response.json();
      })
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => { active = false; };
  }, [id, products, loading]);

  useEffect(() => {
    if (!product) return;

    try {
      const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updated = [
        product,
        ...recent.filter((p) => String(p.id) !== String(product.id)),
      ].slice(0, 8);

      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch {
      // Continue if browser storage is unavailable.
    }
  }, [product]);

  if (loading && !product)
    return <main className="message">Loading product...</main>;

  if (error)
    return (
      <main className="message">
        Product unavailable. <Link to="/">Back to products</Link>
      </main>
    );

  if (!product)
    return <main className="message">Loading product...</main>;

  return (
    <main className="details">
      <div><ProductImage product={product} /></div>

      <div className="details-info">
        <p><Link to="/">Products</Link> / {product.category}</p>
        <p className="product-brand">{product.brand || product.category}</p>
        <h1>{product.title}</h1>
        <p className="rating">
          ★ {product.rating || "New"} ({product.reviews?.length || 0} reviews)
        </p>
        <h2>${Number(product.price).toFixed(2)}</h2>
        <p>{product.description}</p>

        <hr />
        <p>Quantity</p>

        <div className="stepper">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))} disabled={quantity >= (product.stock || 99)}>+</button>
        </div>

        <button className="add-button" onClick={() => dispatch(addToCart({ product, quantity }))}>
          Add to cart
        </button>

        <Link className="add-button" style={{ marginLeft: 10, background: "white", color: "#1b1f2a", border: "1px solid #e4e7ee" }} to="/cart">
          Go to cart {inCart ? `(${inCart.quantity})` : ""}
        </Link>

        <button className="wishlist-detail" onClick={() => dispatch(toggleWishlist(product))}>
          {saved ? "♥ Remove from wishlist" : "♡ Add to wishlist"}
        </button>

        <p className="stock">♧ Free shipping on orders of $100 or more</p>
        <p className="stock">↻ 30-day easy returns</p>
      </div>
    </main>
  );
}
