import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products/featured");
        setFeatured(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">New Season Collection</p>
          <h1>Timeless Kurtis, <br />Modern Elegance</h1>
          <p className="hero-desc">
            Discover handpicked long and short kurtis crafted from premium fabrics,
            designed for everyday grace.
          </p>
          <div className="hero-actions">
            <Link to="/shop?type=long" className="btn btn-primary">Shop Long Kurtis</Link>
            <Link to="/shop?type=short" className="btn btn-outline">Shop Short Kurtis</Link>
          </div>
        </div>
      </section>

      <section className="container featured-section">
        <h2 className="section-title">Featured Picks</h2>
        <p className="section-subtitle">Our most loved styles this week</p>

        {loading ? (
          <div className="loader">Loading products...</div>
        ) : featured.length === 0 ? (
          <div className="empty-state">No featured products yet. Check back soon!</div>
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="promo-banner">
        <div className="container promo-inner">
          <div>
            <h2>Free Shipping on Orders Above ₹999</h2>
            <p>Easy returns within 7 days. Cash on delivery not available — secure prepaid checkout only.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">Explore Collection</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
