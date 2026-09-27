import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: userInfo?.name || "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [processing, setProcessing] = useState(false);

  const shippingPrice = itemsPrice > 999 ? 0 : 79;
  const totalPrice = itemsPrice + shippingPrice;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    return Object.values(address).every((val) => val.trim() !== "");
  };

  const handlePayment = async () => {
    if (!validateAddress()) {
      toast.warn("Please fill all address fields");
      return;
    }

    setProcessing(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const { data } = await api.post("/payment/create-order", {
        orderItems,
        shippingAddress: address,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "KurtiKraft",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            });
            clearCart();
            toast.success("Payment successful! Order placed.");
            navigate("/orders");
          } catch (error) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: userInfo?.email,
        },
        theme: { color: "#8a3b56" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setProcessing(false);
    }
  };

  return (
    <div className="container checkout-page">
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Shipping Address</h3>
          <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} />
          <input name="addressLine" placeholder="Address (House no, Street, Area)" value={address.addressLine} onChange={handleChange} />
          <div className="form-row">
            <input name="city" placeholder="City" value={address.city} onChange={handleChange} />
            <input name="state" placeholder="State" value={address.state} onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} />
          </div>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="checkout-item">
              <span>{item.name} ({item.size}) x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
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
          <button className="btn btn-primary checkout-btn" onClick={handlePayment} disabled={processing}>
            {processing ? "Processing..." : "Pay with Razorpay"}
          </button>
          <p className="secure-note">🔒 Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
