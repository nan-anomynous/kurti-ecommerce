import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setActiveImg(0);
      } catch (error) {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warn("Please select a size");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.warn("Please select a size");
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!product) return <div className="empty-state">Product not found.</div>;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const selectedStock = product.sizes.find((s) => s.size === selectedSize)?.stock ?? null;

  return (
    <div className="container product-detail">
      <div className="pd-gallery">
        <div className="pd-main-img">
          <img src={product.images[activeImg]} alt={product.name} />
        </div>
        <div className="pd-thumbs">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={i === activeImg ? "active" : ""}
              onClick={() => setActiveImg(i)}
            />
          ))}
        </div>
      </div>

      <div className="pd-info">
        <span className={`product-tag ${product.type}`}>{product.type === "long" ? "Long Kurti" : "Short Kurti"}</span>
        <h1>{product.name}</h1>
        <p className="pd-color">Color: {product.color}</p>

        <div className="pd-price">
          {hasDiscount ? (
            <>
              <span className="price-discount">₹{product.discountPrice}</span>
              <span className="price-original">₹{product.price}</span>
            </>
          ) : (
            <span className="price-discount">₹{product.price}</span>
          )}
        </div>

        <p className="pd-description">{product.description}</p>
        {product.fabric && <p className="pd-fabric"><strong>Fabric:</strong> {product.fabric}</p>}

        <div className="pd-sizes">
          <label>Select Size</label>
          <div className="size-options">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                className={`size-btn ${selectedSize === s.size ? "active" : ""} ${s.stock === 0 ? "disabled" : ""}`}
                disabled={s.stock === 0}
                onClick={() => setSelectedSize(s.size)}
              >
                {s.size}
              </button>
            ))}
          </div>
          {selectedSize && selectedStock !== null && (
            <p className="stock-info">
              {selectedStock > 0 ? `${selectedStock} left in stock` : "Out of stock"}
            </p>
          )}
        </div>

        <div className="pd-qty">
          <label>Quantity</label>
          <div className="qty-selector">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        <div className="pd-actions">
          <button className="btn btn-outline" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn btn-primary" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
