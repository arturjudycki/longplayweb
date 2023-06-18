import React from "react";
import { NavLink } from "react-router-dom";

const ModalAboutLog = ({ toggleModal, props }) => {
  let modal = props.modal;
  return (
    <>
      {modal ? (
        <div className="modal modal--zIndex">
          <div
            onClick={() => {
              toggleModal();
            }}
            className="overlay"
          ></div>
          <div className="modal-content info-log-modal">
            <h1 className="info-log-modal__title">
              Zaloguj się i korzystaj w pełni z wortalu
            </h1>
            <NavLink to="/login" className="info-log-modal__link">
              Zaloguj się
            </NavLink>

            <NavLink to="/register" className="info-log-modal__link">
              Załóż konto
            </NavLink>
            <p
              onClick={() => {
                toggleModal();
              }}
              className="info-log-modal__close"
            >
              Nie teraz
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ModalAboutLog;
