import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./DiscoverPage.scss";

import { BGNeedHelp } from "../../../../assets/images";
import BannerHomeStudent from "../../../../assets/images/banner-home-student.jpg";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Categories from "../../../../components/Categories/Categories";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";
import Carousel from "./Carousel";
import { getAllCourses } from "../../../../api/getAllCourses";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import { UserDataContext } from "../../../../contexts/UserDataContext";

const DiscoverPage = () => {
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      const { ok, data } = await getAllCourses();

      // console.log(data.data);

      if (ok) {
        let groupByCategory = Object.values(
          data.data.reduce((acc, current) => {
            acc[current.attributes.categoria.data.id] =
              acc[current.attributes.categoria.data.id] ?? [];
            acc[current.attributes.categoria.data.id].push(current);
            return acc;
          }, {})
        );

        // console.log(groupByCategory);

        setCourses(groupByCategory);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourses();
  }, []);

  return (
    <PageTransition {...(!userData.company && { margin: true })}>
      <div id="discover-page" className="page">
        <Header />

        {userData.company ? (
          <div className="catalogue">
            <h1>Catálogo de Cursos</h1>
          </div>
        ) : (
          <div className="banner">
            <FancyImage src={BannerHomeStudent} />
          </div>
        )}

        <div className="main">
          <div className="padding">
            <Categories />
          </div>

          {courses ? (
            courses.map((group, index) => {
              return <Carousel group={group} key={index} />;
            })
          ) : (
            <SpinnerOfDoom standalone />
          )}

          <div className="padding">
            <div className="help">
              <BGNeedHelp />

              <div className="content">
                <strong>¿Necesitas ayuda?</strong>
                <p>
                  ¡Estamos aquí para ayudarte! Visita nuestro centro de ayuda
                  donde aclaramos las dudas más frecuentes de nuestra comunidad
                </p>

                <Link className="action-button black" to="/help">
                  Centro de ayuda
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer unique {...(userData.company && { company: true })} />
      </div>
    </PageTransition>
  );
};

export default DiscoverPage;
