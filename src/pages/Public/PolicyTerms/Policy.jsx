import React, { useContext } from "react";

import "./PolicyTerms.scss";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const Policy = () => {
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div id="policy-terms" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <h1>{dictionary.policy[0][language]}</h1>

          <div className="content">
            <p>
              {dictionary.policy[1][language]}
            </p>

            <h3>1. {dictionary.policy[2][language]}:</h3>

            <p>
              {dictionary.policy[3][language]}
            </p>

            <p className="uppercase">
              {dictionary.policy[4][language]}{" "}
              <strong>
                {dictionary.policy[5][language]}
              </strong>
            </p>

            <h3>2. {dictionary.policy[6][language]}:</h3>

            <p>
              {dictionary.policy[7][language]}
            </p>

            <h3>3. {dictionary.policy[8][language]}:</h3>

            <p>
              {dictionary.policy[9][language]}
            </p>

            <h2>{dictionary.policy[10][language]}:</h2>

            <p>
              {dictionary.policy[11][language]}
            </p>

            <h3>1. {dictionary.policy[12][language]}:</h3>

            <p>
              {dictionary.policy[13][language]}
            </p>

            <h3>2. COOKIES:</h3>

            <p>
              {dictionary.policy[14][language]}
            </p>

            <h3>3. {dictionary.policy[15][language]}:</h3>

            <p>
              {dictionary.policy[16][language]}
            </p>

            <h2>{dictionary.policy[17][language]}:</h2>

            <p>
              {dictionary.policy[18][language]}
            </p>

            <h2>{dictionary.policy[19][language]}:</h2>

            <p>
              {dictionary.policy[20][language]}
            </p>

            <h2>{dictionary.policy[21][language]}:</h2>

            <p>
              {dictionary.policy[22][language]}
            </p>

            <h3>1. {dictionary.policy[23][language]}:</h3>

            <p>
              {dictionary.policy[24][language]}
            </p>

            <h3>2. {dictionary.policy[25][language]}:</h3>

            <p>
              {dictionary.policy[26][language]}
            </p>

            <h3>3. {dictionary.policy[27][language]}:</h3>

            <p>
              {dictionary.policy[28][language]}
            </p>
          </div>
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default Policy;
