import React from "react";
import { NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="error-page">
      <h1 className="error-page__title">
        Strona o podanym adresie URL nie istnieje.
      </h1>
      <p className="error-page__info">
        Odwiedź{" "}
        <NavLink className="error-page__link" to="/">
          stronę startową wortalu
        </NavLink>
      </p>
    </section>
  );
};

export default ErrorPage;
