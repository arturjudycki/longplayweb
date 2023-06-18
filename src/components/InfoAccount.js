import React from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPerson,
  faHammer,
  faNewspaper,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

const InfoAccount = ({ person }) => {
  const { user } = person.user_info;
  const { username } = useParams();
  const urlUser = "/user/".concat(`${username}`);

  const displayName = () => {
    if (user.user_type === "admin" || user.user_type === "editor") {
      if (user.first_name !== null && user.last_name !== null) {
        return (
          <p className="heroUser__names">
            {"".concat(`${user.first_name}`, " ", `${user.last_name}`)}
          </p>
        );
      }
    }
  };

  return (
    <section className="heroUser">
      {user.user_type === "admin" && person.userIsLogged ? (
        <div className="heroUser__links">
          <NavLink
            to="/create-accounts-editor"
            className="heroUser__link heroUser__link--flexStart"
          >
            <FontAwesomeIcon icon={faPerson} className="faPerson" />
            <p className="heroUser__settings-link">Utwórz konta</p>
          </NavLink>
          <NavLink
            to="/grant-permission"
            className="heroUser__link heroUser__link--flexStart"
          >
            <FontAwesomeIcon icon={faHammer} className="faHammer" />
            <p className="heroUser__settings-link">Nadaj prawo admina</p>
          </NavLink>
          <NavLink
            to="/managing-texts"
            className="heroUser__link heroUser__link--flexStart"
          >
            <FontAwesomeIcon icon={faNewspaper} className="faNewspaper" />
            <p className="heroUser__settings-link">
              Panel do administrowania tekstami
            </p>
          </NavLink>
          <NavLink
            to="/managing-music-albums"
            className="heroUser__link heroUser__link--flexStart"
          >
            <FontAwesomeIcon icon={faMusic} className="faMusic" />
            <p className="heroUser__settings-link">
              Panel do administrowania pozycjami muzycznymi
            </p>
          </NavLink>
        </div>
      ) : (
        ""
      )}

      {user.user_type === "editor" && person.userIsLogged ? (
        <div className="heroUser__links">
          <NavLink
            to="/managing-texts"
            className="heroUser__link heroUser__link--flexStart"
          >
            <FontAwesomeIcon icon={faNewspaper} className="faNewspaper" />
            <p className="heroUser__settings-link">
              Panel do administrowania tekstami
            </p>
          </NavLink>
        </div>
      ) : (
        ""
      )}

      {person.userIsLogged ? (
        <NavLink to="/settings-user" className="heroUser__settings">
          <FontAwesomeIcon icon={faGear} className="faGear" />
          <p className="heroUser__settings-link">Ustawienia profilu</p>
        </NavLink>
      ) : (
        ""
      )}
      <NavLink
        to={{
          pathname: urlUser,
        }}
        className="heroUser__username"
      >
        {user.username}
        {displayName()}
      </NavLink>
    </section>
  );
};

export default InfoAccount;
