import React from "react";
import { useQuery, useMutation } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { userAuth, logoutAuth } from "../API-utils/endpointsAuthUser";
import { NavLink, useNavigate } from "react-router-dom";

const Logged = () => {
  const navigate = useNavigate();

  const { status, data } = useQuery("user", userAuth, { retry: 0 });

  const logout = useMutation(logoutAuth, {
    onSuccess: () => {
      navigate("/longplayweb");
      navigate(0);
    },
  });

  const handleLogout = () => {
    logout.mutate();
  };

  let content;

  if (status === "loading") {
    content = <div></div>;
  }
  if (status === "error") {
    content = (
      <div className="header__logged">
        <FontAwesomeIcon
          icon={faArrowRightToBracket}
          className="faRightToBracket"
        />
        <NavLink to="/login" exact="true" className="header__logged-container">
          Zaloguj się <br />
          Zarejestruj się
        </NavLink>
      </div>
    );
  }
  if (status === "success") {
    const urlUser = "/user/".concat(`${data.user.username}`);

    content = (
      <div className="header__logged">
        <div className="header__logged-box">
          <div className="header__logged-account">
            <FontAwesomeIcon icon={faUser} className="faRightToBracket" />
            <NavLink
              to={{
                pathname: urlUser,
              }}
              className="header__logged-account-name"
            >
              {data.user.username}
            </NavLink>
          </div>

          <div onClick={handleLogout} className="header__loggedOut">
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="faArrowRightFromBracket"
            />
            <p className="header__loggedOut-text">Wyloguj się</p>
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default Logged;
