import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./PaymentMethods.scss";

import { LogoPaypal, LogoStripe } from "../../../../assets/images";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Footer from "../../../../components/Footer/Footer";
import { getAvailablePaymentMethods } from "../../../../api/getAvailablePaymentMethods";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getLinkToStripe } from "../../../../api/getLinkToStripe";
import { getLinkToPaypal } from "../../../../api/getLinkToPaypal";
import { getUserMetadata } from "../../../../api/getUserMetadata";

const PaymentMethods = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [isLoading, setIsLoading] = useState({
    ip: true,
    meta: true,
    paypal: false,
    stripe: false,
  });

  const [availableMethods, setAvailableMethods] = useState({
    paypal: false,
    stripe: false,
  });
  const [linkedMethods, setLinkedMethods] = useState({
    paypal: false,
    stripe: false,
  });

  useEffect(() => {
    // Check already linked methods
    (async () => {
      const { ok, data } = await getUserMetadata();

      if (ok) {
        const { stripe_account_id_state, paypal_account_id } = data.data.attributes;

        setLinkedMethods({ stripe_account_id_state, paypal_account_id });
      } else {
        toast.error(`${data.error.message}`);
      }

      setIsLoading((current) => ({ ...current, meta: false }));
    })();

    // Check available methods based on IP
    (async () => {
      const { ok, data } = await getAvailablePaymentMethods();

      if (ok) {
        const methods = data.data.data;

        setAvailableMethods((current) => ({ ...current, ...methods }));
      } else {
        toast.error(`${data.error.message}`);
      }

      setIsLoading((current) => ({ ...current, ip: false }));
    })();
  }, []);

  const linkToPaypal = async () => {
    setIsLoading((current) => ({ ...current, paypal: true }));

    const { ok, data } = await getLinkToPaypal();

    if (ok) {
      toast.success(dictionary.privateInstructor.payment[0][language]);
      window.location.reload();
    } else {
      toast.error(`${data.error.message}`);
    }

    setIsLoading((current) => ({ ...current, paypal: false }));
  };
  const linkToStripe = async () => {
    setIsLoading((current) => ({ ...current, stripe: true }));

    const { ok, data } = await getLinkToStripe();

    if (ok) {
      window.open(data.link.url, "_self");
    } else {
      toast.error(`${data.error.message}`);
      setIsLoading((current) => ({ ...current, stripe: false }));
    }
  };

  return (
    <div id="payment-methods" className="page">
      <PageTransition>
        <InstructorHeader />
        <div className="main">
          <h1>{dictionary.privateInstructor.payment[1][language]}</h1>

          {isLoading.meta || isLoading.ip ? (
            <SpinnerOfDoom standalone full />
          ) : (
            <>
              {(linkedMethods.paypal_account_id !== null || availableMethods.paypal) && (
                <div className="method">
                  <div className="image">
                    <LogoPaypal />
                  </div>

                  <div className="text">
                    <p>{dictionary.privateInstructor.payment[2][language]}</p>

                    {linkedMethods.paypal_account_id && (
                      <p>
                        {dictionary.privateInstructor.payment[3][language]}
                        <strong>{` ${linkedMethods.paypal_account_id}`}</strong>
                      </p>
                    )}
                  </div>

                  <button
                    className="action-button black"
                    onClick={linkToPaypal}
                    disabled={linkedMethods.paypal_account_id !== null || isLoading.paypal}
                  >
                    {isLoading.paypal && <SpinnerOfDoom />}
                    {linkedMethods.paypal_account_id !== null
                      ? dictionary.privateInstructor.payment[4][language]
                      : dictionary.privateInstructor.payment[5][language]}
                  </button>
                </div>
              )}

              {(linkedMethods.stripe_account_id_state === "completed" || availableMethods.stripe) && (
                <div className="method">
                  <div className="image">
                    <LogoStripe />
                  </div>

                  <button
                    className="action-button black"
                    onClick={linkToStripe}
                    disabled={linkedMethods.stripe_account_id_state === "completed" || isLoading.stripe}
                  >
                    {isLoading.stripe && <SpinnerOfDoom />}
                    {linkedMethods.stripe_account_id_state === "completed"
                      ? dictionary.privateInstructor.payment[4][language]
                      : dictionary.privateInstructor.payment[5][language]}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default PaymentMethods;
