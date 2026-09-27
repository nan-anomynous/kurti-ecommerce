import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loader">Loading orders...</div>;

  return (
    <div className="container orders-page">
      <h1 className="section-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">You haven't placed any orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`order-status status-${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-items">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p className="order-item-meta">Size: {item.size} × {item.quantity}</p>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>{order.isPaid ? "✅ Paid" : "⏳ Payment Pending"}</span>
                <strong>Total: ₹{order.totalPrice}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
