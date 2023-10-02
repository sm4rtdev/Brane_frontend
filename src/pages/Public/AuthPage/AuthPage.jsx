import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import "./AuthPage.scss";

import { InsBGLogin, InsBGSignup, BGSignup } from "../../../assets/images";

import BGLogin from "../../../assets/images/bg-login.jpg";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import Footer from "../../../components/Footer/Footer";

const AuthPage = ({ institutions }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID Token: " + response.credential);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "683261810889-md5inc98mrldse6hf10fupo4ct1l8f3i.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
  }, []);

  return (
    <PageTransition>
      <div id="auth-page" className="main-transition">
        <PublicHeader />

        <div className="main">
          <div className="auth-background">
            {!institutions ? (
              currentPath === "login" ? (
                <img src={BGLogin} alt="" />
              ) : (
                <BGSignup />
              )
            ) : currentPath === "login" ? (
              <InsBGLogin />
            ) : (
              <InsBGSignup />
            )}
          </div>

          <Outlet />
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AuthPage;
