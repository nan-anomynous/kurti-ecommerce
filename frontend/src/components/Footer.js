import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3>Badaraa.in</h3>
          <p>Elegant ethnic wear crafted for the modern woman. Long & short kurtis in premium fabrics.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <p>Long Kurtis</p>
          <p>Short Kurtis</p>
          <p>New Arrivals</p>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <p>Shipping & Returns</p>
          <p>Track Order</p>
          <p>Contact Us</p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Badaraa.in. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
