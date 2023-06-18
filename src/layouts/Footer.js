import React from "react";
import { NavLink } from "react-router-dom";
import img from "../images/lpw-logo-footer.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__container-text">
          &copy; {new Date().getFullYear()}
        </p>
        <NavLink to="/" exact="true" className="footer__container-logo">
          <img src={img} alt="logo" />
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;
