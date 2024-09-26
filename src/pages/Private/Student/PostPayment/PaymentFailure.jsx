import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { BGPaymentFail } from "../../../../assets/images";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const PaymentFailure = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  return (
    <div className="page post-payment">
      <PageTransition margin>
        <Header type={"discover"} />

        <div className="main">
          <strong>{dictionary.payment[0][language]}</strong>
          <p>
            {dictionary.payment[1][language]}
          </p>

          <BGPaymentFail />

          <Link to={"/"} className="action-button">
            {dictionary.payment[2][language]}
          </Link>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default PaymentFailure;
