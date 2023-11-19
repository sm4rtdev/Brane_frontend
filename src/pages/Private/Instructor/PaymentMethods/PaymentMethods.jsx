
import React, { useState } from "react";
import "./PaymentMethods.scss";
import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import { LogoPaypal, LogoStripe } from "../../../../assets/images";
import { getLinkAccount } from "../../../../api/getLinkStripeAccount";
import { toast } from "react-toastify";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";

const PaymentMethods = () => {
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [loadingPaypal, setLoadingPaypal] = useState(false);

  const getLink = async (pasarela) => {
    if (pasarela === "stripe") {
      setLoadingStripe(true);
    } else if (pasarela === "paypal") {
      setLoadingPaypal(true);
    }

    const { ok, data } = await getLinkAccount(pasarela);
    if (ok) {
      if(pasarela === "stripe"){
        window.location = data.link.url;
      }else{
        // muestro un toast indicando que se vinculo correctamente el email

        toast.success(`Se vinculó correctamente paypal al email ${data.email}`);
      }
      
    } else {
      toast.error(`${data.error.message}`);
    }

    if (pasarela === "stripe") {
      setLoadingStripe(false);
    } else if (pasarela === "paypal") {
      setLoadingPaypal(false);
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
              onClick={() => getLink("stripe")}
              disabled={loadingStripe}
            >
              {loadingStripe ? (
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
            <button
              className="small-button"
              onClick={() => getLink("paypal")}
              disabled={loadingPaypal}
            >
              {loadingPaypal ? (
                <>
                  <SpinnerOfDoom />
                  Cargando...
                </>
              ) : (
                "Conectar"
              )}
            </button>
          </div>
        </div>
        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default PaymentMethods;