import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import "./Footer.scss";

import { LogoBlack } from "../../assets/images";

import DynamicInput from "../DynamicInput/DynamicInput";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const Footer = ({ unique, instructor, company }) => {
  const { toggleLanguage, language, dictionary } =
    useContext(DictionaryContext);

  const [inputs, setInputs] = useState({
    newsName: "",
    newsEmail: "",
  });

  return (
    <div
      id="footer"
      className={`${unique ? "unique" : ""} ${instructor ? "instructor" : ""} ${
        company ? "company" : ""
      }`}
    >
      <div className="column">
        <Link to="/" className="logo">
          <LogoBlack />
        </Link>

        <ul>
          <li>
            <Link to={"/blog"}>{dictionary.footer.first[0][language]}</Link>
          </li>
          <li>
            <Link to={"/contact"}>{dictionary.footer.first[1][language]}</Link>
          </li>
        </ul>

        <button className="change-lang" onClick={toggleLanguage}>
          {language === "en" ? "English" : "Español"}
        </button>
      </div>
      <div className="column">
        <h4>Brane</h4>

        <ul>
          <li>
            <Link to={"/courses"}>{dictionary.footer.second[0][language]}</Link>
          </li>
          <li>
            <Link to={"/business"}>
              {dictionary.footer.second[1][language]}
            </Link>
          </li>
          <li>
            <Link to={"/teach"}>{dictionary.footer.second[2][language]}</Link>
          </li>
          <li>
            <Link to={"/help"}>{dictionary.footer.second[3][language]}</Link>
          </li>
        </ul>
      </div>
      <div className="column">
        <h4>{dictionary.footer.third[0][language]}</h4>

        <ul>
          <li>
            <Link to={"/privacy"}>{dictionary.footer.third[1][language]}</Link>
          </li>
          <li>
            <Link to={"/terms"}>{dictionary.footer.third[2][language]}</Link>
          </li>
        </ul>
      </div>
      <div className="column">
        <div className="container">
          <h4>{dictionary.footer.fourth[0][language]}</h4>

          <div className="newsletter">
            <DynamicInput
              id="newsName"
              state={[inputs, setInputs]}
              placeholder={dictionary.footer.fourth[1][language]}
              noIcon
            />
            <DynamicInput
              id="newsEmail"
              type="email"
              state={[inputs, setInputs]}
              placeholder={dictionary.footer.fourth[2][language]}
              noIcon
            />

            <button className="action-button">
              {dictionary.footer.fourth[3][language]}
            </button>
          </div>
        </div>
      </div>

      {unique && (
        <Link to="/" className="logo extra">
          <LogoBlack />
        </Link>
      )}

      <div className="copyright">
        <p>
          Copyright © 2023 {dictionary.footer.copy[language]}{" "}
          <a
            href="https://miamisignaturedesigns.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            MSD Soft
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
