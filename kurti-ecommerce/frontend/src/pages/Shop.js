import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/Shop.css";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const type = searchParams.get("type") || "";
  const size = searchParams.get("size") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page };
        if (type) params.type = type;
        if (size) params.size = size;
        if (sort) params.sort = sort;

        const { data } = await api.get("/products", { params });
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [type, size, sort, page]);

  const updateFilter = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="container shop-page">
      <h1 className="section-title">Shop Kurtis</h1>

      <div className="shop-filters">
        <div className="filter-group">
          <label>Type</label>
          <select value={type} onChange={(e) => updateFilter("type", e.target.value)}>
            <option value="">All</option>
            <option value="long">Long Kurti</option>
            <option value="short">Short Kurti</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Size</label>
          <select value={size} onChange={(e) => updateFilter("size", e.target.value)}>
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)}>
            <option value="">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found matching your filters.</div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === page ? "active" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
