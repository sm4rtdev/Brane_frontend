import React, { useContext } from "react";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { UserDataContext } from "../../../contexts/UserDataContext";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const Terms = () => {
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div id="policy-terms" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <h1>{dictionary.terms[0][language]}</h1>

          <div className="content">
            <p>
              {dictionary.terms[1][language]}
            </p>

            <h3>1. {dictionary.terms[2][language]}:</h3>

            <p>
              {dictionary.terms[3][language]}
            </p>

            <h3>2. {dictionary.terms[4][language]}:</h3>

            <p>
              {dictionary.terms[5][language]}
            </p>

            <h3>3. {dictionary.terms[6][language]}:</h3>

            <p>
              {dictionary.terms[7][language]}
            </p>

            <h3>4. {dictionary.terms[8][language]}:</h3>

            <p>
              {dictionary.terms[9][language]}
            </p>

            <h3>5. {dictionary.terms[10][language]}:</h3>

            <p>
              {dictionary.terms[11][language]}
            </p>

            <h3>6. {dictionary.terms[12][language]}:</h3>

            <p>
              {dictionary.terms[13][language]}
            </p>

            <h3>7. {dictionary.terms[14][language]}:</h3>

            <p>
              {dictionary.terms[15][language]}
            </p>

            <h3>8. {dictionary.terms[16][language]}:</h3>

            <p>
              {dictionary.terms[17][language]}
            </p>

            <h3>9. {dictionary.terms[18][language]}:</h3>

            <p>
              {dictionary.terms[19][language]}
            </p>

            <h3>10. {dictionary.terms[20][language]}:</h3>

            <p>
              {dictionary.terms[21][language]}
            </p>
          </div>
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default Terms;
