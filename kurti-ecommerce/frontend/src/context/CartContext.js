import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images[0],
          price: product.discountPrice || product.price,
          size,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
