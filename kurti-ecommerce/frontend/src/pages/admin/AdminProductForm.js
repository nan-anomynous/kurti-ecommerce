import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../styles/Admin.css";

const emptySize = { size: "M", stock: 0 };

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "long",
    price: "",
    discountPrice: "",
    color: "",
    fabric: "",
    images: [""],
    sizes: [{ ...emptySize }],
    isFeatured: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setForm({
            name: data.name,
            description: data.description,
            type: data.type,
            price: data.price,
            discountPrice: data.discountPrice || "",
            color: data.color,
            fabric: data.fabric || "",
            images: data.images.length ? data.images : [""],
            sizes: data.sizes.length ? data.sizes : [{ ...emptySize }],
            isFeatured: data.isFeatured,
          });
        } catch (error) {
          toast.error("Failed to load product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageField = (index) =>
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...form.sizes];
    newSizes[index][field] = field === "stock" ? Number(value) : value;
    setForm({ ...form, sizes: newSizes });
  };

  const addSizeField = () => setForm({ ...form, sizes: [...form.sizes, { ...emptySize }] });
  const removeSizeField = (index) =>
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        images: form.images.filter((img) => img.trim() !== ""),
      };

      if (payload.images.length === 0) {
        toast.warn("Please add at least one image URL");
        setSaving(false);
        return;
      }

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="container admin-page">
      <h1 className="section-title" style={{ textAlign: "left" }}>
        {isEdit ? "Edit Kurti" : "Add New Kurti"}
      </h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <div className="form-grid-2">
          <div>
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="long">Long Kurti</option>
              <option value="short">Short Kurti</option>
            </select>
          </div>
          <div>
            <label>Color</label>
            <input name="color" value={form.color} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label>Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
          </div>
          <div>
            <label>Discount Price (₹, optional)</label>
            <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" />
          </div>
        </div>

        <label>Fabric (optional)</label>
        <input name="fabric" value={form.fabric} onChange={handleChange} placeholder="e.g. Cotton, Rayon, Georgette" />

        <label>Image URLs</label>
        {form.images.map((img, i) => (
          <div className="image-url-row" key={i}>
            <input
              value={img}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {form.images.length > 1 && (
              <button type="button" onClick={() => removeImageField(i)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="add-size-btn" onClick={addImageField}>+ Add Image URL</button>

        <label>Sizes & Stock</label>
        {form.sizes.map((s, i) => (
          <div className="size-stock-row" key={i}>
            <select value={s.size} onChange={(e) => handleSizeChange(i, "size", e.target.value)}>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="Stock qty"
              value={s.stock}
              onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
            />
            {form.sizes.length > 1 && (
              <button type="button" onClick={() => removeSizeField(i)}>✕</button>
            )}
          </div>
        ))}
        <button type="button" className="add-size-btn" onClick={addSizeField}>+ Add Size</button>

        <div className="checkbox-row">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} id="featured" />
          <label htmlFor="featured" style={{ marginBottom: 0, textTransform: "none", fontWeight: 400 }}>
            Show on homepage as Featured
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
