import React from "react";
import { Link } from "react-router-dom";

import { BGPaymentFail } from "../../../../assets/images";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";

const PaymentFailure = () => {
  return (
    <div className="page post-payment">
      <PageTransition margin>
        <Header type={"discover"} />

        <div className="main">
          <strong>El pago ha fallado</strong>
          <p>
            No te preocupes, puedes volver a intentarlo en cualquier momento.
          </p>

          <BGPaymentFail />

          <Link to={"/"} className="action-button">
            Ir al inicio
          </Link>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default PaymentFailure;
