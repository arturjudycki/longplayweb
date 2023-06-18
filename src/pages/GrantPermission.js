import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../API-utils/endpointsAuthUser";
import { useQuery, useMutation } from "react-query";
import { getEditorUsers, grantAdmin } from "../API-utils/endpointsManageUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const GrantPermissionPage = () => {
  let EditorsArray;
  let contentEditors;
  let messageRespond;
  const navigate = useNavigate();

  const [idClick, setIdClick] = useState();
  const [idRes, setIdRes] = useState();

  const { status: isLogged, data } = useQuery("user", userAuth, { retry: 0 });

  const { status, data: editors } = useQuery("editors", getEditorUsers, {
    retry: 0,
  });

  const { isError, isSuccess, mutate } = useMutation(grantAdmin, {});

  if (isSuccess) {
    messageRespond = (
      <p className="grant-permission-page__success">Przyznano prawo admina</p>
    );
  }
  if (isError) {
    messageRespond = (
      <p className="grant-permission-page__error">
        Operacja się nie powiodła. Spróbuj ponownie.
      </p>
    );
  }

  if (status === "success") {
    console.log(editors);
    console.log(Array.isArray(editors));
    EditorsArray = Object.keys(editors).map((editor) => editors[editor]);
    console.log(EditorsArray[0].id_user);

    contentEditors = EditorsArray[0].map((editor) => (
      <div className="table__editors-r" key={editor.id_user}>
        <p className="table__editors-c">{editor.username}</p>
        <p className="table__editors-c">
          {editor.first_name} {editor.last_name}
        </p>
        <p className="table__editors-c table__editors-c--center">
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => {
              if (idClick === editor.id_user) {
                setIdClick(-1);
                setIdRes(-1);
              } else {
                setIdClick(editor.id_user);
                setIdRes(-1);
              }
            }}
            className="faPlus"
          />
        </p>
        {idClick === editor.id_user ? (
          <p className="table__editors-c table__editors-c-confirmation">
            Czy na pewno chcesz nadać prawo admina?
            <button
              className="confirm-grant-admin__button"
              onClick={() => {
                mutate({ id_user: editor.id_user });
                setIdRes(editor.id_user);
                console.log(editor.id_user);
              }}
            >
              TAK
            </button>
          </p>
        ) : (
          ""
        )}
        {idClick === editor.id_user && idRes === editor.id_user
          ? messageRespond
          : ""}
      </div>
    ));
  }

  if (isLogged === "error") {
    navigate("/longplayweb");
  }

  if (isLogged === "success") {
    if (data.user.user_type !== "admin") {
      navigate("/longplayweb");
    } else {
      return (
        <section className="grant-permission-page">
          <h1 className="grant-permission-page__title">Nadawanie praw</h1>
          <p className="grant-permission-page__text">Redaktorzy</p>
          <section className="table__editors">
            <div className="table__editors-r table__editors-r--title">
              <p className="table__editors-c">Nazwa redaktora</p>
              <p className="table__editors-c">Dane redaktora</p>
              <p className="table__editors-c">Przyznaj prawo admina</p>
            </div>
            {contentEditors}
          </section>
        </section>
      );
    }
  }
};

export default GrantPermissionPage;
