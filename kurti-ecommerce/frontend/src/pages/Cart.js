import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 79;
  const totalPrice = itemsPrice + shippingPrice;

  const handleCheckout = () => {
    if (!userInfo) {
      navigate("/login?redirect=checkout");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any kurtis yet.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20, display: "inline-block" }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="section-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>Size: {item.size}</p>
                <p className="cart-item-price">₹{item.price}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item.productId, item.size)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
