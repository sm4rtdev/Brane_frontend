import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getFromLocal, updateLocal } from "../helpers/localStorage";
import { CartContext } from "./CartContext";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    getFromLocal("cart") ? getFromLocal("cart") : []
  );

  useEffect(() => {
    updateLocal("cart", cart);
  }, [cart]);

  const addToCart = (courseID) => {
    const filtered = cart.filter((el) => el === courseID);

    if (filtered.length > 0) {
      return;
    } else {
      setCart((c) => {
        return [...new Set([...c, courseID])];
      });

      toast.success(`El curso ha sido añadido al carrito.`);
    }
  };

  const removeFromCart = (id) => {
    const filtered = cart.filter((el) => el !== id);

    // console.log(filtered);

    setCart(filtered);
    toast.success(`El curso ha sido eliminado del carrito.`);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
