import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./CartPage.scss";

import LogoCardnet from "../../../../assets/images/logo-cardnet.png";
import { LogoPaypal, LogoStripe } from "../../../../assets/images";
import { ChevronForward, LogoBrane } from "../../../../assets/icons";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import BusinessHeader from "../../../../components/CustomHeaders/BusinessHeader";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Footer from "../../../../components/Footer/Footer";

import { postRequestPaymentCardnet } from "../../../../api/postRequestPaymentCardnet";
import { postRequestPaymentStripe } from "../../../../api/postRequestPaymentStripe";
import { postRequestPaymentPaypal } from "../../../../api/postRequestPaymentPaypal";
import { postRequestPaymentBrane } from "../../../../api/postRequestPaymentBrane";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCurrentCredits } from "../../../../api/getCurrentCredits";
import { getSearchCoupon } from "../../../../api/getSearchCoupon";
import { CartContext } from "../../../../contexts/CartContext";
import { getCourseById } from "../../../../api/getCourseById";

const CartPage = () => {
  const navigate = useNavigate();

  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);
  const { cart, removeFromCart } = useContext(CartContext);

  const [courses, setCourses] = useState(null);

  const [myCredits, setMyCredits] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCouponBoxOpen, setIsCouponBoxOpen] = useState(false);
  const [input, setInput] = useState({
    coupon: "",
  });
  const [loading, setLoading] = useState(false);
  const [finalObject, setFinalObject] = useState([]);

  useEffect(() => {
    if (cart.length > 0) {
      setCourses(null);

      const getCourses = async (id) => {
        const { ok, data } = await getCourseById(id);

        if (ok) {
          if (data.data !== null && data.data.length > 0) {
            setCourses((c) => {
              if (!c) {
                return [data.data[0]];
              } else {
                let array = c.slice(0);

                let skip = false;

                for (let i = 0; i < array.length; i++) {
                  const element = array[i];

                  if (element.id === data.data[0].id) {
                    skip = true;

                    break;
                  }
                }

                if (!skip) {
                  array.push(data.data[0]);
                }

                return array;
              }
            });
          } else {
            removeFromCart(id, true);

            setCourses((c) => {
              if (!c) {
                return [];
              } else {
                return c;
              }
            });
          }
        }
      };

      //Get my credits
      (async () => {
        const { ok, data } = await getCurrentCredits();

        if (ok) {
          setMyCredits(data.quantity);
        }
      })();

      cart.forEach((id) => {
        getCourses(id);
      });
    } else {
      setCourses([]);
      setTotal(0);
    }

    //eslint-disable-next-line
  }, [cart]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      const coursesWithCoupon = courses.map((course) => {
        return {
          curso: course.id,
          cupon: "",
          price: course.attributes.precio,
          afterPrice: course.attributes.precio,
        };
      });

      setFinalObject(coursesWithCoupon);
    }
  }, [courses]);

  useEffect(() => {
    let total = 0;

    finalObject.forEach((course) => {
      total = total + course.afterPrice;
    });
    setTotal(total);
  }, [finalObject]);

  const [selectedProvider, setSelectedProvider] = useState(null);

  const requestPayment = async () => {
    setLoading(true);

    let newArray = finalObject.map((el) => {
      const clone = Object.assign({}, el);
      delete clone.price;
      delete clone.afterPrice;
      return clone;
    });

    const obj = {
      data: {
        cursos: newArray,
        redirect: false,
      },
    };

    const paymentProviders = {
      paypal: postRequestPaymentPaypal,
      stripe: postRequestPaymentStripe,
      cardnet: postRequestPaymentCardnet,
      brane: postRequestPaymentBrane,
    };

    const { ok, data } = await paymentProviders[selectedProvider](obj);

    if (ok) {
      console.log(data, selectedProvider);

      if (selectedProvider === "cardnet") {
        // Crear un formulario oculto
        const form = document.createElement("form");
        form.method = "post";
        form.action = data.url;
        form.target = "_self";

        // Agregar el campo 'session' al formulario
        const sessionInput = document.createElement("input");
        sessionInput.type = "hidden";
        sessionInput.name = "SESSION";
        sessionInput.value = data.session;
        form.appendChild(sessionInput);

        // Agregar el formulario al documento y enviarlo
        document.body.appendChild(form);
        form.submit();
      } else if (selectedProvider === "brane") {
        navigate("/successful-purchase");
      } else {
        window.location.href = data.url;
      }
    } else {
      toast.error(`${data.error.message}`);
      setLoading(false);
    }
  };

  const checkCoupon = async () => {
    const { ok, data } = await getSearchCoupon(input.coupon);

    if (ok) {
      if (data.data.length > 0) {
        let temp = {
          id: data.data[0].id,
          cursos: data.data[0].attributes.cursos.data,
          valor: data.data[0].attributes.valor,
          nombre: data.data[0].attributes.nombre,
        };

        const subIds = new Set(temp.cursos.map(({ id }) => id));
        const result = [...finalObject.keys()].filter((i) => subIds.has(finalObject[i].curso));

        setFinalObject((c) => {
          let copy = c.slice();

          result.forEach((index) => {
            copy[index].cupon = temp.nombre;
            copy[index].afterPrice = Number(
              (copy[index].price - (copy[index].price * Number(temp.valor)) / 100).toFixed(2)
            );
          });

          return copy;
        });

        if (result.length > 0) {
          toast.success(dictionary.cartPage[0][language]);
        } else {
          toast.warning(dictionary.cartPage[1][language]);
        }
      } else {
        toast.warning(dictionary.cartPage[1][language]);
      }
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const openCouponBox = () => {
    setIsCouponBoxOpen(true);
  };

  return (
    <div id="cart-page" className="page">
      <PageTransition {...(!userData.company && { margin: true })}>
        {userData.company ? (
          <BusinessHeader />
        ) : (
          <HeaderToggler>
            <InternalHeader
              options={{
                backButton: true,
                bigTitle: true,
              }}
              title={dictionary.cartPage[2][language]}
            />
          </HeaderToggler>
        )}

        <div className="main">
          <div className="block">
            <h1>{dictionary.cartPage[2][language]}</h1>

            <Link to="/" className="action-button">
              {dictionary.cartPage[3][language]}
              <ChevronForward />
            </Link>
          </div>

          <div className="shopping-list">
            {courses ? (
              courses.map((course) => {
                return <CourseCard key={course.id} {...course} type={"related cart"} />;
              })
            ) : (
              <SpinnerOfDoom standalone />
            )}
          </div>

          {courses && courses.length > 0 && (
            <div className="discount-section">
              {isCouponBoxOpen ? (
                <div className="coupon-box">
                  <DynamicInput id="coupon" state={[input, setInput]} noIcon label={dictionary.cartPage[4][language]} />
                  <button className="action-button" disabled={input.coupon.length === 0} onClick={checkCoupon}>
                    {dictionary.cartPage[5][language]}
                  </button>
                </div>
              ) : (
                <button className="button" onClick={openCouponBox}>
                  {dictionary.cartPage[6][language]}
                </button>
              )}
            </div>
          )}

          <div className="block">
            <span>Total</span>

            <strong>${total.toFixed(2)} USD</strong>
          </div>

          <div className="providers">
            <button
              className={`option ${selectedProvider === "paypal" ? "selected" : ""}`}
              onClick={() => setSelectedProvider("paypal")}
            >
              <LogoPaypal />
            </button>
            <button
              className={`option ${selectedProvider === "stripe" ? "selected" : ""}`}
              onClick={() => setSelectedProvider("stripe")}
            >
              <LogoStripe />
            </button>
            <button
              className={`option ${selectedProvider === "cardnet" ? "selected" : ""}`}
              onClick={() => setSelectedProvider("cardnet")}
            >
              <img src={LogoCardnet} alt="cardnet" />
            </button>
            {myCredits > 0 && (
              <button
                className={`option ${selectedProvider === "brane" ? "selected" : ""}`}
                onClick={() => setSelectedProvider("brane")}
              >
                <LogoBrane />
                {dictionary.cartPage[9][language]}
              </button>
            )}
          </div>

          <p className="remember">{dictionary.cartPage[7][language]}</p>

          <button
            className="action-button"
            onClick={requestPayment}
            disabled={!selectedProvider || cart.length === 0 ? true : false || loading}
          >
            {loading ? (
              <>
                <SpinnerOfDoom />
                {dictionary.spinnerOfDoom[language]}
              </>
            ) : (
              dictionary.cartPage[8][language]
            )}
          </button>
        </div>

        <Footer
          unique
          {...(userData.company && { company: true })}
          {...(userData.mode === "instructor" && { instructor: true })}
        />
      </PageTransition>
    </div>
  );
};

export default CartPage;
