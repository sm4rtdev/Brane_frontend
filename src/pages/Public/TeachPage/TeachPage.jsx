import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./TeachPage.scss";

import subhero from "../../../assets/images/subhero.jpg";

import PageTransition from "../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../components/SpinnerOfDoom/SpinnerOfDoom";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { getUpdateRole } from "../../../api/getUpdateRole";

const TeachPage = () => {
  const { userData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  const becomeAnInstructor = async () => {
    setLoading(true);

    const { ok, data } = await getUpdateRole();

    // console.log(data.data);

    if (ok) {
      toast.success(`Exito`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error(`${data.error.message}`);
    }

    setLoading(false);
  };

  return (
    <div id="teach-page" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <>
          <div className="banner">
            <FancyImage src="/images/banner-teach.jpg" noEffect />

            <div className="container">
              <h1>Conviértete en instructor</h1>
              <p>
                Vuélvete parte de la comunidad de instructores y tenga a
                millones de personas en todo el mundo.
              </p>
              <a href="#how-to-start" className="action-button">
                Más información
              </a>
            </div>
          </div>
          <div className="main">
            <div id="how-to-start">
              <h2>Como empezar</h2>

              <div className="container">
                <div className="left">
                  <strong>Diseña tu curso</strong>
                  <ul>
                    <li>
                      Disponer de acceso a una computadora y acceso a internet.
                    </li>
                    <li>
                      Recibirás ayuda para gestionar tus primeros contenidos.
                    </li>
                    <li>Genera ingresos de manera recurrente.</li>
                  </ul>
                </div>
                <div className="right">
                  <FancyImage src={subhero} noEffect />
                </div>
              </div>
            </div>
          </div>

          <div className="become">
            <div className="container">
              <h2>Vuélvete un instructor hoy</h2>
              <p>
                Se parte de nuestra comunidad de instructores y accede a
                millones de estudiantes en todo el mundo.
              </p>
              {userData.info ? (
                <button
                  className="action-button"
                  onClick={becomeAnInstructor}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <SpinnerOfDoom /> Cargando...
                    </>
                  ) : (
                    "Empieza ya!"
                  )}
                </button>
              ) : (
                <Link to="/auth/login" className="action-button">
                  Empieza ya!
                </Link>
              )}
            </div>

            <FancyImage src={"/images/bottom-teach.png"} />
          </div>
        </>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default TeachPage;
