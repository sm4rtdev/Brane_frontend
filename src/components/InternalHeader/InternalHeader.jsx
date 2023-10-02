import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./InternalHeader.scss";

import {
  ShareSocialOutline,
  ChevronForward,
  SearchOutline,
  CloseOutline,
  CartOutline,
  Settings,
} from "../../assets/icons";

import DynamicInput from "../DynamicInput/DynamicInput";
import { shareCurrentPage } from "../../helpers/shareCurrentPage";
import { UserDataContext } from "../../contexts/UserDataContext";
import { CartContext } from "../../contexts/CartContext";

const InternalHeader = ({
  options = {
    backButton: false,
    bigTitle: false,
    longTitle: false,
    titleAlignLeft: false,
    share: false,
    cart: false,
    search: false,
  },
  title,
  queryState,
  openOptionsMenu,
}) => {
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { userData } = useContext(UserDataContext);

  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarOpen((c) => !c);
  };

  return (
    <div id="internal-header" className="page-header">
      {options.backButton && (
        <Link to={-1} className="back-button small-button">
          <ChevronForward />
        </Link>
      )}

      {!isSearchBarOpen ? (
        title && (
          <div
            className={`title ${
              options.bigTitle || options.longTitle ? "big" : ""
            } ${options.titleAlignLeft ? "left" : ""}`}
          >
            {options.bigTitle ? <h1>{title}</h1> : <p>{title}</p>}
          </div>
        )
      ) : (
        <DynamicInput id="query" type="search" state={queryState} />
      )}

      {options.share && (
        <button
          className="small-button"
          onClick={() => {
            shareCurrentPage(location);
          }}
        >
          <ShareSocialOutline />
        </button>
      )}

      {options.search && (
        <button className="small-button" onClick={toggleSearchBar}>
          {isSearchBarOpen ? <CloseOutline /> : <SearchOutline />}
        </button>
      )}

      {!userData.institution && options.cart && (
        <div className="cart-noti-container">
          <Link to="/cart" className="small-button">
            <CartOutline />
          </Link>
          {cart.length > 0 && (
            <div className="noti">{cart.length < 10 ? cart.length : ""}</div>
          )}
        </div>
      )}

      {openOptionsMenu !== undefined && (
        <button onClick={openOptionsMenu} className="small-button">
          <Settings />
        </button>
      )}
    </div>
  );
};

export default InternalHeader;
