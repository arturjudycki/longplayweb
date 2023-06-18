import React from "react";
import { userAuth } from "../API-utils/endpointsAuthUser";
import { useQuery, useMutation } from "react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createEditorAdmin } from "../API-utils/endpointsManageUsers";

import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  username: Yup.string()
    .required("Nazwa redaktora jest wymagana!")
    .min(5, "Nazwa redaktora musi składać się z conajmniej 5 znaków.")
    .max(20, "Nazwa redaktora może składać się maksymalnie z 20 znaków"),

  email: Yup.string()
    .email("Niepoprawny e-mail!")
    .required("E-mail jest wymagany!"),

  password: Yup.string()
    .required("Hasło jest wymagane!")
    .min(8, "Hasło musi zawierać minimum 8 znaków.")
    .matches(/^.*(?=.*\d).*$/, "Hasło musi zawierać przynajmniej jedną cyfrę.")
    .matches(
      /^.*((?=.*[a-z,A-Z])).*$/,
      "Hasło musi zawierać przynajmniej jedną literę."
    ),

  passwordConfirmation: Yup.string()
    .required("Pole jest wymagane!")
    .oneOf([Yup.ref("password")], "Podane hasła nie są identyczne"),

  first_name: Yup.string().required("Imię jest wymagane!"),

  last_name: Yup.string().required("Nazwisko jest wymagane!"),
});

const CreateAccountsEditor = () => {
  const navigate = useNavigate();
  let content;

  const { status, data } = useQuery("user", userAuth, { retry: 0 });
  const { isSuccess, isError, mutate } = useMutation(createEditorAdmin, {});

  if (isSuccess) {
    content = (
      <section className="popUp popUp--wider">
        <div class="popUp__register201">
          <p>Konto redaktora zostało pomyślnie utworzone.</p>
          <NavLink>
            <button
              onClick={() => {
                navigate("/create-accounts-editor");
                navigate(0);
              }}
              className="popUp__button"
            >
              Zamknij
            </button>
          </NavLink>
        </div>
      </section>
    );
  }

  if (isError) {
    content = (
      <p className="registerError">
        <p>Konto z tymi danymi już istnieje</p>
        <NavLink>
          <button
            onClick={() => {
              navigate("/create-accounts-editor");
              navigate(0);
            }}
            className="popUp__button"
          >
            Zamknij
          </button>
        </NavLink>
      </p>
    );
  }

  if (status === "error") {
    navigate("/");
  }

  if (status === "success") {
    if (data.user.user_type !== "admin") {
      navigate("/");
    } else {
      return (
        <div className="createAccount__wrapper">
          <section className="createAccount__choose">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "createAccount__choose-type editor_selected"
                  : "createAccount__choose-type"
              }
              to="/create-accounts-editor"
            >
              Utwórz konto redaktora
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "createAccount__choose-type admin_selected"
                  : "createAccount__choose-type"
              }
              to="/create-accounts-admin"
            >
              Utwórz konto admina
            </NavLink>
          </section>
          {content}
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              passwordConfirmation: "",
              first_name: "",
              last_name: "",
              user_type: "editor",
            }}
            validationSchema={LoginSchemat}
            onSubmit={(values) => {
              mutate(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="createAccount__form">
                <Field
                  id="username"
                  name="username"
                  placeholder="Nazwa redaktora"
                  type="text"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="username" />
                </div>

                <Field
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="email" />
                </div>

                <Field
                  id="password"
                  name="password"
                  placeholder="Hasło"
                  type="password"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="password" />
                </div>

                <Field
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  placeholder="Powtórz hasło"
                  type="password"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="passwordConfirmation" />
                </div>

                <Field
                  id="first_name"
                  name="first_name"
                  placeholder="Imię redaktora"
                  type="text"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="first_name" />
                </div>

                <Field
                  id="last_name"
                  name="last_name"
                  placeholder="Nazwisko redaktora"
                  type="text"
                  className="createAccount__form-input"
                />

                <div className="errors">
                  <ErrorMessage name="last_name" />
                </div>

                <button type="submit" className="createAccount__form-button">
                  Utwórz konto
                </button>
              </Form>
            )}
          </Formik>
        </div>
      );
    }
  }
};

export default CreateAccountsEditor;
