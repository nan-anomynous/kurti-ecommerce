import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Badaraa<span>.in</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/shop?type=long" onClick={() => setMenuOpen(false)}>Long Kurtis</Link>
          <Link to="/shop?type=short" onClick={() => setMenuOpen(false)}>Short Kurtis</Link>
          {userInfo?.role === "admin" && (
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
        </nav>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-icon">
            🛍️
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {userInfo ? (
            <div className="navbar-user">
              <span>Hi, {userInfo.name.split(" ")[0]}</span>
              <div className="navbar-dropdown">
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
