import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { BGPayment } from "../../../../assets/images";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";
import { removeFromLocal } from "../../../../helpers/localStorage";
import { CartContext } from "../../../../contexts/CartContext";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const SuccessfulPurchase = () => {
  const { clearCart } = useContext(CartContext);
  const { dictionary, language } = useContext(DictionaryContext);

  useEffect(() => {
    removeFromLocal("cart");
    clearCart();

    //eslint-disable-next-line
  }, []);

  return (
    <div className="page post-payment">
      <PageTransition margin>
        <Header type={"discover"} />

        <div className="main">
          <strong>{dictionary.payment[3][language]}</strong>
          <p>{dictionary.payment[4][language]}</p>

          <BGPayment />

          <Link className="action-button" to={"/my-courses"}>
            {dictionary.payment[5][language]}
          </Link>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default SuccessfulPurchase;
