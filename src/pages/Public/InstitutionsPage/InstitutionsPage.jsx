import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./InstitutionsPage.scss";
import { Character1, Character2 } from "../../../assets/images";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const InstitutionsPage = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  return (
    <div id="institutions-page" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <>
          <div className="banner">
            <FancyImage src="/images/institutions-banner.jpg" noEffect />

            <div className="container">
              <h1>{dictionary.institutions.bannerTitle[language]}</h1>
              <p>{dictionary.institutions.bannerText[language]}</p>
              <a href="#how-to-start" className="action-button">
                {dictionary.institutions.bannerButton[language]}
              </a>
            </div>
            {/* <div className="bar">
              <div className="item">
                <strong>50</strong>
                <span>Available countries</span>
              </div>
              <div className="item">
                <strong>2</strong>
                <span>Languages</span>
              </div>
              <div className="item">
                <strong>180</strong>
                <span>Corporate customers</span>
              </div>
              <div className="item">
                <strong>3</strong>
                <span>Payment methods</span>
              </div>
            </div> */}
          </div>
          <div className="main">
            <div id="how-to-start">
              <h2>{dictionary.institutions.howTitle[language]}</h2>

              <div className="container">
                <div className="left">
                  <strong>
                    {dictionary.institutions.howList.title[language]}
                  </strong>
                  <ul>
                    {dictionary.institutions.howList.items.map(
                      (item, index) => {
                        return <li key={index}>{item[language]}</li>;
                      }
                    )}
                  </ul>
                </div>
                <div className="right">
                  <FancyImage src="/images/institutions-man.png" noEffect />
                </div>
              </div>
            </div>
          </div>

          <div className="become">
            <Character1 />

            <div className="container">
              <h2>{dictionary.institutions.becomeTitle[language]}</h2>
              <p>{dictionary.institutions.becomeText[language]}</p>

              <Link to="/ins-auth/login" className="action-button">
                {dictionary.institutions.becomeButton[language]}
              </Link>
            </div>

            <Character2 />
          </div>
        </>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default InstitutionsPage;
