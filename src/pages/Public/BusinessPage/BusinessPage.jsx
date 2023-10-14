import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./BusinessPage.scss";

import {
  // BannerSmall1,
  // BannerSmall2,
  // BannerSmall3,
  // BXSBookmark,
  // BXSVideo,
  // BXSBook,
  // BXSBulb,
  // BGTeach,
  Dots,
} from "../../../assets/images";

// import { CheckmarkCircleOutline } from "../../../assets/icons";

import PageTransition from "../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../components/DynamicInput/DynamicInput";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { postNewBusiness } from "../../../api/postNewBusiness";
import CourseCard from "../../../components/CourseCard/CourseCard";
import { getCoursesByCategory } from "../../../api/getCoursesByCategory";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

// const plans = [
//   {
//     id: 0,
//     name: "Team",
//     users: 5,
//     price: 360,
//     demo: true,
//     items: [
//       "Access to 7,800+ courses",
//       "Analytics & Adoption Reports",
//       "Custom logo & URL",
//       "Mobile app access",
//     ],
//   },
//   {
//     id: 1,
//     name: "Business",
//     users: 20,
//     demo: true,
//     price: null,
//     items: [
//       "Access to 17,000+ courses*",
//       "Custom logo & URL",
//       "Create learning paths",
//       "Create and host proprietary courses",
//       "Create user groups",
//       "Custom topics",
//       "Advanced insights and analytics",
//       "International collection",
//       "Mobile app access",
//       "Eligible for Udemy Business Pro add-on*",
//     ],
//   },
//   {
//     id: 2,
//     name: "Leadership Development Programs",
//     users: null,
//     price: null,
//     demo: false,
//     items: [
//       "68+ leadership development courses tailored to drive outcomes",
//       "Executive content curated by universities and thought leaders",
//       "Expert faculty to guide and coach participants",
//       "AI-powered analytics and insights",
//       "Asynchronous learning with collaborative discussions",
//       "Live, synchronous events",
//       "Custom logo & URL",
//       "Mobile-enabled platform",
//     ],
//   },
// ];

const BusinessPage = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    businessName: "",
    businessEmail: "",
    password: "",
  });

  const register = async () => {
    const obj = {
      data: {
        nombre: inputs.businessName,
        email: inputs.businessEmail,
        password: inputs.password,
      },
    };

    const { ok, data } = await postNewBusiness(obj);

    if (ok) {
      toast.success(
        "¡Éxito, nos comunicaremos con usted cuando revisemos su solicitud!"
      );
    } else {
      toast.error(`${data.error.message}`);
    }
    setIsLoading(false);
  };

  const handleClick = (e) => {
    e.preventDefault();

    setIsLoading(true);
    register();
  };

  const [courses, setCourses] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Design");

  useEffect(() => {
    setCourses(null);

    const getCourses = async () => {
      const { ok, data } = await getCoursesByCategory(selectedCategory);

      // console.log(data.data);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourses();
  }, [selectedCategory]);

  return (
    <div id="business-page" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}
        <div className="main">
          <div className="banner">
            <FancyImage src="/images/business.jpg" noEffect />

            <div className="container">
              <h1>{dictionary.business.banner[0][language]}</h1>
              <p>{dictionary.business.banner[1][language]}</p>
              <a href="#request-demo" className="action-button">
                {dictionary.business.banner[2][language]}
              </a>
            </div>
          </div>
        </div>

        {/* <div className="post-banner">
          <BGTeach className="gray-bg" />

          <Dots className="dots" />
          <Dots className="dots" />

          <h2>In your demo, learn more about:</h2>
          <div className="container">
            <div className="card">
              <BannerSmall1 />
              <p>Global instructors</p>
            </div>
            <div className="card">
              <BannerSmall2 />
              <p>Admin functionality</p>
            </div>
            <div className="card">
              <BannerSmall3 />
              <p>17,000+ top courses</p>
            </div>
          </div>
        </div> */}

        <div className="form-register" id="request-demo">
          {/* <svg height="1" width="1">
            <clipPath id="blob" clipPathUnits="objectBoundingBox">
              <path d="M24.6,-43.8C29.8,-39.6,30.7,-28.9,42.4,-20.5C54,-12.1,76.5,-6.1,83.8,4.2C91.1,14.5,83.1,28.9,73.3,40.5C63.5,52.1,59.8,60.7,39.2,59.2C26.7,57.7,13.4,46.1,-0.4,46.8C-14.2,47.5,-28.3,60.5,-41.2,62.2C-54,63.9,-65.6,54.2,-66.1,41.9C-66.5,29.7,-55.9,14.8,-56.4,-0.3C-57,-15.4,-68.6,-30.9,-65.8,-39C-62.9,-47.2,-45.6,-48.1,-32.2,-47.7C-18.9,-47.2,-9.4,-45.4,0.1,-45.6C9.7,-45.8,19.3,-48,24.6,-43.8Z" />
            </clipPath>
          </svg> */}

          <div className="form-container">
            <form>
              <h2>{dictionary.business.formRegister[0][language]}</h2>

              <DynamicInput
                id={"businessName"}
                state={[inputs, setInputs]}
                noIcon
                label={dictionary.business.formRegister[1][language]}
                placeholder="ACME"
              />
              <DynamicInput
                id={"businessEmail"}
                type={"email"}
                noIcon
                state={[inputs, setInputs]}
                label={dictionary.business.formRegister[2][language]}
                placeholder="company@email.com"
              />
              <DynamicInput
                id={"password"}
                type={"password"}
                noIcon
                state={[inputs, setInputs]}
                label={dictionary.business.formRegister[3][language]}
                placeholder="********"
              />

              <button
                className="action-button"
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <SpinnerOfDoom />
                    {dictionary.business.formRegister[4][language]}
                  </>
                ) : (
                  dictionary.business.formRegister[5][language]
                )}
              </button>
            </form>
          </div>

          <FancyImage src={"/images/demo-image.png"} noEffect />
        </div>

        <div className="main">
          <div className="what-do-we-do">
            <div className="container">
              <div className="left">
                <strong>{dictionary.business.what[0][language]}</strong>
                <ul>
                  <li>{dictionary.business.what[1][language]}</li>
                  <li>{dictionary.business.what[2][language]}</li>
                  <li>{dictionary.business.what[3][language]}</li>
                </ul>
              </div>
              <div className="right">
                <FancyImage src="/images/teams.jpg" noEffect />

                <Dots />
              </div>
            </div>
          </div>

          <div className="courses">
            <h2>{dictionary.business.courses[0][language]}</h2>

            <div className="categories">
              <span
                onClick={() => {
                  setSelectedCategory("Design");
                }}
                className={selectedCategory === "Design" ? "selected" : ""}
              >
                {dictionary.business.courses[1][language]}
              </span>
              <span
                onClick={() => {
                  setSelectedCategory("Development");
                }}
                className={selectedCategory === "Development" ? "selected" : ""}
              >
                {dictionary.business.courses[2][language]}
              </span>
              <span
                onClick={() => {
                  setSelectedCategory("Marketing");
                }}
                className={selectedCategory === "Marketing" ? "selected" : ""}
              >
                Marketing
              </span>
            </div>

            {courses ? (
              <div className="grid">
                {courses.map((course) => {
                  return (
                    <CourseCard
                      key={course.id}
                      {...course}
                      type="standard landing"
                      landing
                    />
                  );
                })}
              </div>
            ) : (
              <SpinnerOfDoom standalone center />
            )}
          </div>

          {/* <div className="plans">
            <h2>Plans</h2>

            <div className="container">
              {plans.map((plan) => {
                return (
                  <div
                    key={plan.id}
                    className={`plan ${!plan.demo ? "special" : ""}`}
                  >
                    <h3>{plan.name}</h3>
                    {plan.users && <span>Up to {plan.users} users</span>}

                    <strong>
                      {plan.price
                        ? `$${plan.price}/yr`
                        : "Contact sales for pricing"}
                    </strong>

                    <a href="#request-demo" className={`action-button`}>
                      {!plan.demo ? "Contact sales" : "Request demo"}
                    </a>

                    <ul className="list">
                      {plan.items.map((item, index) => {
                        return (
                          <li key={index}>
                            <CheckmarkCircleOutline />
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default BusinessPage;
