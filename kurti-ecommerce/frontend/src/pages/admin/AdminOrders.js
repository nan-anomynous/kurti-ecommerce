import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../styles/Admin.css";

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus } : o))
      );
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container admin-page">
      <h1 className="section-title" style={{ textAlign: "left" }}>Manage Orders</h1>

      {loading ? (
        <div className="loader">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders placed yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name}<br /><small>{order.user?.email}</small></td>
                  <td>{order.orderItems.length} item(s)</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.isPaid ? "✅" : "⏳"}</td>
                  <td>
                    <select
                      className="admin-order-select"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
