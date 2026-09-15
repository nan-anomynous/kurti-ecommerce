import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/Admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/products?limit=1"),
          api.get("/orders"),
        ]);
        const orders = ordersRes.data;
        const revenue = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
        const pendingOrders = orders.filter((o) => o.orderStatus === "Processing").length;

        setStats({
          products: productsRes.data.total,
          orders: orders.length,
          revenue,
          pendingOrders,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container admin-page">
      <h1 className="section-title">Admin Dashboard</h1>

      {loading ? (
        <div className="loader">Loading stats...</div>
      ) : (
        <div className="admin-stats">
          <div className="stat-card">
            <p className="stat-label">Total Products</p>
            <h2>{stats.products}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Orders</p>
            <h2>{stats.orders}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Revenue</p>
            <h2>₹{stats.revenue}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending Orders</p>
            <h2>{stats.pendingOrders}</h2>
          </div>
        </div>
      )}

      <div className="admin-nav-cards">
        <Link to="/admin/products" className="admin-nav-card">
          <h3>📦 Manage Products</h3>
          <p>Add, edit, or remove kurtis from your store</p>
        </Link>
        <Link to="/admin/orders" className="admin-nav-card">
          <h3>🧾 Manage Orders</h3>
          <p>View orders and update their delivery status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
