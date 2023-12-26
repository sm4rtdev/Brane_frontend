import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getFromLocal, updateLocal } from "../helpers/localStorage";
import { DictionaryContext } from "./DictionaryContext";
import { CartContext } from "./CartContext";

const CartProvider = ({ children }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [cart, setCart] = useState(getFromLocal("cart") ? getFromLocal("cart") : []);

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

      toast.success(dictionary.cartProvider[0][language]);
    }
  };

  const removeFromCart = (id, silent) => {
    const filtered = cart.filter((el) => el !== id);

    setCart(filtered);

    if (!silent) {
      toast.success(dictionary.cartProvider[1][language]);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>;
};

export default CartProvider;
