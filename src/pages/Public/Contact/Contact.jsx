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
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const Contact = () => {
  const { dictionary, language } = useContext(DictionaryContext);

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
              title={dictionary.contact[0][language]}
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
          <h1>{dictionary.contact[0][language]}</h1>

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
              label={dictionary.contact[1][language]}
            />
            <DynamicInput
              id={"name"}
              state={[inputs, setInputs]}
              placeholder="Jhon Doe"
              label={dictionary.contact[2][language]}
              noIcon
            />
            <DynamicInput
              id={"affair"}
              state={[inputs, setInputs]}
              placeholder={dictionary.contact[3][language]}
              label={dictionary.contact[3][language]}
              noIcon
            />
            <DynamicInput
              id={"message"}
              state={[inputs, setInputs]}
              noIcon
              label={dictionary.contact[4][language]}
              multiline
              placeholder={dictionary.contact[4][language]}
            />

            <button
              className="action-button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {dictionary.contact[5][language]}
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
