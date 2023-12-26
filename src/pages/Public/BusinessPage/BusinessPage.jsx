import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./BusinessPage.scss";

import { Dots } from "../../../assets/images";

import PageTransition from "../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../components/DynamicInput/DynamicInput";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import CourseCard from "../../../components/CourseCard/CourseCard";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { getCoursesByCategory } from "../../../api/getCoursesByCategory";
import { DictionaryContext } from "../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { postNewBusiness } from "../../../api/postNewBusiness";

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
      toast.success(dictionary.business.success[language]);
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

        <div className="form-register" id="request-demo">
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

              <button className="action-button" onClick={handleClick} disabled={isLoading}>
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
                  return <CourseCard key={course.id} {...course} type="standard landing" landing />;
                })}
              </div>
            ) : (
              <SpinnerOfDoom standalone center />
            )}
          </div>
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default BusinessPage;
