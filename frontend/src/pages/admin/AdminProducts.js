import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../styles/Admin.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 100 } });
      setProducts(data.products);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="container admin-page">
      <div className="admin-header-row">
        <h1 className="section-title" style={{ marginBottom: 0 }}>Manage Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">+ Add New Kurti</Link>
      </div>

      {loading ? (
        <div className="loader">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products yet. Add your first kurti!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Sizes/Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.images[0]} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td style={{ textTransform: "capitalize" }}>{p.type}</td>
                  <td>₹{p.discountPrice || p.price}</td>
                  <td>{p.sizes.map((s) => `${s.size}:${s.stock}`).join(", ")}</td>
                  <td>{p.isFeatured ? "✅" : "—"}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/products/edit/${p._id}`}>
                        <button className="edit-btn">Edit</button>
                      </Link>
                      <button className="delete-btn" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                    </div>
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

export default AdminProducts;
