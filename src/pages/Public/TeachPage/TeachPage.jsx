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
import { DictionaryContext } from "../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { getUpdateRole } from "../../../api/getUpdateRole";

const TeachPage = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const { userData } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);

  const becomeAnInstructor = async () => {
    setLoading(true);

    const { ok, data } = await getUpdateRole();

    if (ok) {
      toast.success(dictionary.login.done[language]);
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
              <h1>{dictionary.teach.banner[0][language]}</h1>
              <p>{dictionary.teach.banner[1][language]}</p>
              <a href="#how-to-start" className="action-button">
                {dictionary.teach.banner[2][language]}
              </a>
            </div>
          </div>
          <div className="main">
            <div id="how-to-start">
              <h2>{dictionary.teach.how[0][language]}</h2>

              <div className="container">
                <div className="left">
                  <strong>{dictionary.teach.how[1][language]}</strong>
                  <ul>
                    <li>{dictionary.teach.how[2][language]}</li>
                    <li>{dictionary.teach.how[3][language]}</li>
                    <li>{dictionary.teach.how[4][language]}</li>
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
              <h2>{dictionary.teach.become[0][language]}</h2>
              <p>{dictionary.teach.become[1][language]}</p>
              {userData.info ? (
                <button className="action-button" onClick={becomeAnInstructor} disabled={loading}>
                  {loading ? (
                    <>
                      <SpinnerOfDoom /> {dictionary.teach.become[2][language] + "..."}
                    </>
                  ) : (
                    dictionary.teach.become[3][language]
                  )}
                </button>
              ) : (
                <Link to="/auth/login" className="action-button">
                  {dictionary.teach.become[3][language]}
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
