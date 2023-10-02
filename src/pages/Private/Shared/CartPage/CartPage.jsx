import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./CartPage.scss";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import BusinessHeader from "../../../../components/CustomHeaders/BusinessHeader";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Footer from "../../../../components/Footer/Footer";

import { postRequestPayment } from "../../../../api/postRequestPayment";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getSearchCoupon } from "../../../../api/getSearchCoupon";
import { CartContext } from "../../../../contexts/CartContext";
import { getCourseById } from "../../../../api/getCourseById";
import { ChevronForward } from "../../../../assets/icons";

const CartPage = () => {
  const { userData } = useContext(UserDataContext);
  const { cart } = useContext(CartContext);

  const [courses, setCourses] = useState(null);
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
        }
      };

      cart.forEach((id) => {
        getCourses(id);
      });
    } else {
      setCourses([]);
      setTotal(0);
    }
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
    // console.log(total);
    setTotal(total);
  }, [finalObject]);

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

    const { ok, data } = await postRequestPayment(obj);

    if (ok) {
      // console.log(data.url);

      window.location.href = data.url;
    } else {
      toast.error(`${data.error.message}`);
      setLoading(false);
    }
  };

  const checkCoupon = async () => {
    const { ok, data } = await getSearchCoupon(input.coupon);

    // console.log(data.data[0]);

    if (ok) {
      if (data.data.length > 0) {
        let temp = {
          id: data.data[0].id,
          cursos: data.data[0].attributes.cursos.data,
          valor: data.data[0].attributes.valor,
          nombre: data.data[0].attributes.nombre,
        };

        // console.log(temp.cursos);

        const subIds = new Set(temp.cursos.map(({ id }) => id));
        console.log(subIds);
        const result = [...finalObject.keys()].filter((i) =>
          subIds.has(finalObject[i].curso)
        );

        // console.log(result);

        setFinalObject((c) => {
          let copy = c.slice();

          result.forEach((index) => {
            copy[index].cupon = temp.nombre;
            copy[index].afterPrice = Number(
              (
                copy[index].price -
                (copy[index].price * Number(temp.valor)) / 100
              ).toFixed(2)
            );
          });

          return copy;
        });

        if (result.length > 0) {
          toast.success(`¡Descuento aplicado!`);
        } else {
          toast.warning(`El cupón ingresado no es válido`);
        }
      } else {
        toast.warning(`El cupón ingresado no es válido`);
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
              title={"Cart"}
            />
          </HeaderToggler>
        )}

        <div className="main">
          <div className="block">
            <h1>Mi carrito</h1>

            <Link to="/" className="action-button">
              Seguir comprando
              <ChevronForward />
            </Link>
          </div>

          <div className="shopping-list">
            {courses ? (
              courses.map((course) => {
                return (
                  <CourseCard
                    key={course.id}
                    {...course}
                    type={"related cart"}
                  />
                );
              })
            ) : (
              <SpinnerOfDoom standalone />
            )}
          </div>

          {courses && courses.length > 0 && (
            <div className="discount-section">
              {isCouponBoxOpen ? (
                <div className="coupon-box">
                  <DynamicInput
                    id="coupon"
                    state={[input, setInput]}
                    noIcon
                    label={"Ingresa tu cupón aquí"}
                  />
                  <button
                    className="action-button"
                    disabled={input.coupon.length === 0}
                    onClick={checkCoupon}
                  >
                    Consultar cupón
                  </button>
                </div>
              ) : (
                <button className="button" onClick={openCouponBox}>
                  ¿Tiene algún código de descuento?
                </button>
              )}
            </div>
          )}

          <div className="block">
            <span>Total</span>

            <strong>${total.toFixed(2)} USD</strong>
          </div>

          <p className="remember">
            Para completar la transacción, lo enviaremos a los servidores
            seguros de nuestro proveedor de pagos.
          </p>

          <button
            className="action-button"
            onClick={requestPayment}
            disabled={cart.length === 0 ? true : false || loading}
          >
            {loading ? (
              <>
                <SpinnerOfDoom />
                Cargando
              </>
            ) : (
              "Verificar"
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
