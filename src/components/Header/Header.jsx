import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Header.scss";

import { NotificationsOutline, LogOutOutline, CartOutline, LogoBrane, Trophy } from "../../assets/icons";

import HeaderDropdown from "../HeaderDropdown/HeaderDropdown";
import DynamicInput from "../DynamicInput/DynamicInput";
import MsgDropdown from "../MsgDropdown/MsgDropdown";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { UserDataContext } from "../../contexts/UserDataContext";
import { CartContext } from "../../contexts/CartContext";

const Header = ({ black, title, progress }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);
  const { cart } = useContext(CartContext);

  const [greetingText, setGreetingText] = useState("");
  const [dummy, setDummy] = useState({
    dummy: "",
  });

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime < 12) {
      setGreetingText(dictionary.header.greeting[0][language]);
    } else if (currentTime < 18) {
      setGreetingText(dictionary.header.greeting[1][language]);
    } else {
      setGreetingText(dictionary.header.greeting[2][language]);
    }
  }, []); //eslint-disable-line

  return (
    <div id="header" className={`page-header ${black ? "header-black" : ""}`}>
      <Link to="/" className="logo">
        <LogoBrane />
      </Link>
      {!userData.company &&
        !userData.institution &&
        (!black ? (
          <>
            <Link to="/search" className="dummy-search">
              <DynamicInput
                id={"dummy"}
                type="search"
                placeholder={dictionary.header.search[language]}
                state={[dummy, setDummy]}
                disabled
              />
            </Link>

            <nav>
              <Link className="link" to={"/courses/development"}>
                {dictionary.header.nav[1][language]}
              </Link>
              <Link className="link" to={"/conferences/development"}>
                {dictionary.header.nav[2][language]}
              </Link>
              <Link className="link" to={"/business"}>
                {dictionary.header.nav[3][language]}
              </Link>
              <Link className="link" to={"/teach"}>
                {dictionary.header.nav[4][language]}
              </Link>
            </nav>
          </>
        ) : (
          <>
            <h1 className="title">{title}</h1>
          </>
        ))}

      <div className="buttons-section desktop">
        {!black ? (
          <>
            <Link to="/notifications" className="small-button">
              <NotificationsOutline />
            </Link>

            {!userData.institution && !userData.company && <MsgDropdown />}

            {!userData.institution && (
              <div className="cart-noti-container">
                <Link to="/cart" className="small-button">
                  <CartOutline />
                </Link>
                {cart.length > 0 && <div className="noti">{cart.length < 10 ? cart.length : ""}</div>}
              </div>
            )}
          </>
        ) : (
          <>
            {progress !== null && progress > 0 && (
              <div className="trophy">
                <span>{progress}</span>
                <Trophy />
              </div>
            )}

            <Link to="/my-courses" className="small-button">
              <LogOutOutline />
            </Link>
          </>
        )}

        <HeaderDropdown
          greetingText={greetingText}
          {...((userData.company || userData.institution) && { company: true })}
          {...(userData.institution && { institution: true })}
        />
      </div>

      <div className="buttons-section mobile">
        <Link to="/notifications" className="small-button">
          <NotificationsOutline />
        </Link>

        {!userData.institution && (
          <div className="cart-noti-container">
            <Link to="/cart" className="small-button">
              <CartOutline />
            </Link>
            {cart.length > 0 && <div className="noti">{cart.length < 10 ? cart.length : ""}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
