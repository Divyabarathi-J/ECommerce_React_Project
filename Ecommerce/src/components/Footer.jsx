
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer">
      <span>ShopKart · Frontend training project</span>
      <span>Product data and images: DummyJSON API</span>
      <Link to="/">Back to products ↑</Link>
    </footer>
  );
}
