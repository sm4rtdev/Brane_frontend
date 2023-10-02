import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "@mui/material/Slider";

import "./SearchHeader.scss";

import {
  CartOutline,
  Filter,
  LogoBrane,
  NotificationsOutline,
} from "../../assets/icons";

import HeaderDropdown from "../HeaderDropdown/HeaderDropdown";
import DynamicInput from "../DynamicInput/DynamicInput";
import { UserDataContext } from "../../contexts/UserDataContext";
import { CartContext } from "../../contexts/CartContext";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const SearchHeader = ({ state, starRange, priceRange, general }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);
  const { cart } = useContext(CartContext);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const closeFiltersMenu = (e) => {
    if (e.target.id === "filters-menu") {
      setIsFilterMenuOpen(false);
    }
  };

  return (
    <div id="search-header" className="page-header">
      <Link to="/" className="logo">
        <LogoBrane />
      </Link>

      {!general && !userData.company && (
        <Link to="/search" className="small-button general">
          <p>{dictionary.searchHeader.button[language]}</p>
        </Link>
      )}

      <DynamicInput
        id="query"
        type="search"
        state={state}
        placeholder={dictionary.header.search[language]}
      />

      {!general && (
        <button
          className="small-button filter-btn"
          onClick={() => {
            setIsFilterMenuOpen(true);
          }}
        >
          <Filter />
        </button>
      )}

      <div className="buttons-section">
        <Link to="/notifications" className="small-button">
          <NotificationsOutline />
        </Link>
        <div className="cart-noti-container">
          <Link to="/cart" className="small-button">
            <CartOutline />
          </Link>
          {cart.length > 0 && (
            <div className="noti">{cart.length < 10 ? cart.length : ""}</div>
          )}
        </div>

        <HeaderDropdown company />
      </div>

      {isFilterMenuOpen && (
        <div id="filters-menu" onClick={closeFiltersMenu}>
          <div className="container">
            <strong>{dictionary.searchHeader.filters[0][language]}</strong>

            <h3>{dictionary.searchHeader.filters[1][language]}</h3>
            <div className="slider">
              <Slider
                value={starRange.value}
                onChange={starRange.handle}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                marks={starRange.marks}
                disableSwap
                step={0.5}
                min={0}
                max={5}
                sx={{
                  color: "#ffb200",
                  "& .MuiSlider-thumb::before": {
                    boxShadow: "none",
                  },
                }}
              />
            </div>

            <h3>{dictionary.searchHeader.filters[2][language]}</h3>
            <div className="slider">
              <Slider
                value={priceRange.value}
                onChange={priceRange.handle}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                disableSwap
                marks={priceRange.marks}
                step={1}
                min={0}
                max={300}
                sx={{
                  color: "#ffb200",
                  "& .MuiSlider-thumb::before": {
                    boxShadow: "none",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
