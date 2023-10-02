import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { BGPayment } from "../../../../assets/images";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";
import { removeFromLocal } from "../../../../helpers/localStorage";
import { CartContext } from "../../../../contexts/CartContext";

const SuccessfulPurchase = () => {
  const { clearCart } = useContext(CartContext);

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
          <strong>Felicidades!</strong>
          <p>Te has matriculado exitosamente en el curso</p>

          <BGPayment />

          <Link className="action-button" to={"/my-courses"}>
            Ver mis cursos
          </Link>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default SuccessfulPurchase;
