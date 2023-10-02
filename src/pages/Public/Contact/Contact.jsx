import React, { useContext, useState } from "react";

import "./Contact.scss";

import {
  ChevronForward,
  LogoFacebook,
  LogoTwitter,
  LogoWhatsapp,
} from "../../../assets/icons";

import { Dots } from "../../../assets/images";

import PageTransition from "../../../components/PageTransition/PageTransition";
import InternalHeader from "../../../components/InternalHeader/InternalHeader";
import HeaderToggler from "../../../components/HeaderToggler/HeaderToggler";
import DynamicInput from "../../../components/DynamicInput/DynamicInput";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import { UserDataContext } from "../../../contexts/UserDataContext";

const Contact = () => {
  const { userData } = useContext(UserDataContext);
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    affair: "",
    message: "",
  });

  return (
    <div id="contact-page" className="page">
      <PageTransition margin>
        {userData.jwt ? (
          <HeaderToggler>
            <InternalHeader
              options={{
                backButton: true,
                bigTitle: true,
              }}
              title={"Contact"}
            />
          </HeaderToggler>
        ) : (
          <PublicHeader />
        )}

        <div className="banner">
          <Dots />
          <Dots />

          <FancyImage src="/images/customer-service.png" />
        </div>
        <div className="main">
          <h1>Contáctanos</h1>

          <div className="social">
            <button>
              <LogoWhatsapp />
              WhatsApp
              <ChevronForward />
            </button>
            <button>
              <LogoFacebook />
              Facebook
              <ChevronForward />
            </button>
            <button>
              <LogoTwitter />
              Twitter
              <ChevronForward />
            </button>
          </div>

          <form>
            <DynamicInput
              id={"email"}
              state={[inputs, setInputs]}
              type="email"
              label={"Correo electrónico"}
            />
            <DynamicInput
              id={"name"}
              state={[inputs, setInputs]}
              placeholder="Jhon Doe"
              label={"Nombre"}
              noIcon
            />
            <DynamicInput
              id={"affair"}
              state={[inputs, setInputs]}
              placeholder="Asunto"
              label={"Asunto"}
              noIcon
            />
            <DynamicInput
              id={"message"}
              state={[inputs, setInputs]}
              noIcon
              label={"Mensaje"}
              multiline
              placeholder={"Hola!..."}
            />

            <button
              className="action-button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Enviar
            </button>
          </form>
        </div>

        <Footer
          unique
          {...(userData.mode === "instructor" && { instructor: true })}
        />
      </PageTransition>
    </div>
  );
};

export default Contact;
