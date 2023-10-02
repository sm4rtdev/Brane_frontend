import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import "./styles/global.scss";

import WishlistModalProvider from "./contexts/WishlistModalProvider";
import ReviewModalProvider from "./contexts/ReviewModalProvider";
import CategoriesProvider from "./contexts/CategoriesProvider";
import DictionaryProvider from "./contexts/DictionaryProvider";
import UserDataProvider from "./contexts/UserDataProvider";
import CartProvider from "./contexts/CartProvider";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div id="app">
      <DictionaryProvider>
        <CartProvider>
          <UserDataProvider>
            <CategoriesProvider>
              <WishlistModalProvider>
                <ReviewModalProvider>
                  <AppRouter />
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </ReviewModalProvider>
              </WishlistModalProvider>
            </CategoriesProvider>
          </UserDataProvider>
        </CartProvider>
      </DictionaryProvider>
    </div>
  );
}

export default App;
