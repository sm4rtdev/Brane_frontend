import React, { useState } from "react";

import "./PaymentMethods.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import { LogoPaypal, LogoStripe } from "../../../../assets/images";
import { getLinkStripeAccount } from "../../../../api/getLinkStripeAccount";
import { toast } from "react-toastify";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";

const PaymentMethods = () => {
  const [loading, setLoading] = useState(false);

  const getLink = async () => {
    setLoading(true);

    const { ok, data } = await getLinkStripeAccount();

    // console.log("Link", data);

    if (ok) {
      window.location = data.link.url;
    } else {
      toast.error(`${data.error.message}`);
      setLoading(false);
    }
  };

  return (
    <div id="payment-methods" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="main">
          <h1>Métodos de pago</h1>

          <div className="method">
            <div className="image">
              <LogoStripe />
            </div>

            <button
              className="small-button"
              onClick={getLink}
              disabled={loading}
            >
              {loading ? (
                <>
                  <SpinnerOfDoom />
                  Cargando...
                </>
              ) : (
                "Conectar"
              )}
            </button>
          </div>
          <div className="method">
            <div className="image">
              <LogoPaypal />
            </div>

            <button className="small-button">Conectar</button>
          </div>
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default PaymentMethods;
