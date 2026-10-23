
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
  selectTotalItems,
  selectTotalPrice,
} from "../store/cartSlice";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
export default function Cart() {
    const [recent, setRecent] = useState([]);

useEffect(() => {
  try {
    setRecent(JSON.parse(localStorage.getItem("recentlyViewed") || "[]"));
  } catch {
    setRecent([]);
  }
}, []);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const count = useSelector(selectTotalItems);
  const subtotal = useSelector(selectTotalPrice);
  const discount = subtotal * 0.05;
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const total = subtotal - discount + shipping;

  return (
    <main className="cart-page">
      <div className="section-heading">
        <h1>Your cart ({count} items)</h1>
        {items.length > 0 && (
          <Link to="/" style={{ fontSize: 13, textDecoration: "underline" }}>
            Continue shopping
          </Link>
        )}
      </div>

      {!items.length ? (
        <section className="empty-cart">
          <div style={{ fontSize: 40, color: "#c2410c" }}>🛒</div>
          <h1>Your cart is empty</h1>
          <p>
            Looks like you haven't added anything yet. Browse the products and
            add your favourites.
          </p>
          <Link to="/" className="add-button">
            Browse products
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            <div
              style={{
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e4e7ee",
              }}
            >
              <strong style={{ fontSize: 12 }}>PRODUCT</strong>
              <button
                className="text-button"
                onClick={() => dispatch(clearCart())}
              >
                Clear cart
              </button>
            </div>

            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link to={`/product/${item.id}`}>
                  {(item.thumbnail || item.images?.[0]) && (
                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                    />
                  )}
                </Link>

                <div className="cart-item-info">
                  <h3>
                    <Link to={`/product/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="product-brand">{item.brand || item.category}</p>
                  <p style={{ color: "#5b6170", fontSize: 12 }}>
                    ${Number(item.price).toFixed(2)} each
                  </p>

                  <div className="stepper">
                    <button
                      onClick={() => dispatch(decrease(item.id))}
                      aria-label={`Decrease ${item.title} quantity`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increase(item.id))}
                      aria-label={`Increase ${item.title} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>

                <strong>
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </strong>
              </article>
            ))}
          </section>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <p><span>Items</span><strong>{count}</strong></p>
            <p>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <p className="discount-row">
              <span>Discount (5%)</span>
              <strong>−${discount.toFixed(2)}</strong>
            </p>
            <p>
              <span>Shipping</span>
              <strong style={{ color: shipping ? "#1b1f2a" : "#1f6f5a" }}>
                {shipping ? `$${shipping.toFixed(2)}` : "FREE"}
              </strong>
            </p>
            <hr />
            <p className="total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </p>
            <button
              className="add-button checkout-button"
              onClick={() => alert("Demo checkout — no payment processed.")}
            >
              Proceed to checkout
            </button>
            <p style={{ color: "#5b6170", fontSize: 11 }}>
              Your cart is saved. Refresh and it stays.
            </p>
          </aside>
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
