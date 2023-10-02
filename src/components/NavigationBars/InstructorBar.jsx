import React from "react";
import { Link } from "react-router-dom";

import {
  ChatboxEllipsesOutline,
  PlayCircleOutline,
  PricetagOutline,
  CashOutline,
  VideocamOutline,
} from "../../assets/icons";

const InstructorBar = () => {
  return (
    <div className="navigation-bar instructor">
      <div className="container">
        <Link to="/create-course">
          <PlayCircleOutline />
          <span>Crear</span>
        </Link>
        <Link to="/create-conference">
          <VideocamOutline />
          <span>Conferencia</span>
        </Link>
        <Link to="/messages">
          <ChatboxEllipsesOutline />
          <span>Mensajes</span>
        </Link>
        <Link to={`/coupons`}>
          <PricetagOutline />
          <span>Cupones</span>
        </Link>
        <Link to={`/payments`}>
          <CashOutline />
          <span>Pagos</span>
        </Link>
      </div>
    </div>
  );
};

export default InstructorBar;
