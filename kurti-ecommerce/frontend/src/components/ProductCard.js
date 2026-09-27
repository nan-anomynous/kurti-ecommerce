import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.images[0]} alt={product.name} />
        <span className={`product-tag ${product.type}`}>{product.type === "long" ? "Long" : "Short"}</span>
      </div>
      <div className="product-card-body">
        <h4>{product.name}</h4>
        <p className="product-color">{product.color}</p>
        <div className="product-price">
          {hasDiscount ? (
            <>
              <span className="price-discount">₹{product.discountPrice}</span>
              <span className="price-original">₹{product.price}</span>
            </>
          ) : (
            <span className="price-discount">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
