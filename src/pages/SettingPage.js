import React from "react";
import {
  userAuth,
  changeEmail,
  changePassword,
} from "../API-utils/endpointsAuthUser";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, Form, ErrorMessage } from "formik";

import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  email: Yup.string()
    .email("Niepoprawny e-mail!")
    .required("E-mail jest wymagany!"),
});

const LoginSchemat2 = Yup.object().shape({
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
});

const SettingPage = () => {
  const navigate = useNavigate();

  const { status, data } = useQuery("user", userAuth, { retry: 0 });
  const {
    isError: errorEmail,
    isSuccess: successEmail,
    mutate: change_email,
  } = useMutation(changeEmail, {});

  let contentEmail;
  let contentPassword;

  if (successEmail) {
    contentEmail = (
      <p className="successEmail">Email został pomyślnie zmieniony</p>
    );
  }
  if (errorEmail) {
    contentEmail = (
      <p className="errorEmail">
        Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
      </p>
    );
  }

  const {
    isError: errorPassword,
    isSuccess: successPassword,
    mutate: change_password,
  } = useMutation(changePassword, {});

  if (successPassword) {
    contentPassword = (
      <p className="successPassword">Hasło zostało pomyślnie zmienione</p>
    );
  }
  if (errorPassword) {
    contentPassword = (
      <p className="errorPassword">
        Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
      </p>
    );
  }

  if (status === "error") {
    navigate("/longplayweb");
  }

  if (status === "success") {
    return (
      <div className="settings">
        <h1 className="settings__title">Ustawienia</h1>
        <section className="settings__changeData">
          <h2 className="settings__changeData-title">Dane</h2>
          <div className="settings__box">
            <p className="settings__text settings__text--bold">E-mail</p>
            <p className="settings__text">{data.user.email}</p>
            <FontAwesomeIcon
              icon={faPen}
              onClick={() => {
                if (
                  document
                    .querySelector(".boxToChange--email")
                    .classList.contains("boxToChange--none")
                ) {
                  document
                    .querySelector(".boxToChange--email")
                    .classList.remove("boxToChange--none");
                } else {
                  document
                    .querySelector(".boxToChange--email")
                    .classList.add("boxToChange--none");
                }
              }}
              className="settings__faPen"
            />
            <div className="boxToChange boxToChange--email">
              {contentEmail}
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={LoginSchemat}
                onSubmit={(values) => {
                  change_email(values);
                }}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit} className="sign-change">
                    <Field
                      id="email"
                      name="email"
                      placeholder="Wprowadź nowy adres e-mail"
                      type="email"
                      className="sign-change__input"
                    />

                    <div className="errors">
                      <ErrorMessage name="email" />
                    </div>

                    <button
                      className="sign-change__button sign-change__button--cancel"
                      onClick={() => {
                        document
                          .querySelector(".boxToChange--email")
                          .classList.remove("boxToChange--none");
                      }}
                      type="button"
                    >
                      Anuluj
                    </button>

                    <button type="submit" className="sign-change__button">
                      Zapisz
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="settings__box">
            <p className="settings__text settings__text--bold">Hasło</p>
            <p className="settings__text">********</p>
            <FontAwesomeIcon
              icon={faPen}
              className="settings__faPen"
              onClick={() => {
                if (
                  document
                    .querySelector(".boxToChange--password")
                    .classList.contains("boxToChange--none")
                ) {
                  document
                    .querySelector(".boxToChange--password")
                    .classList.remove("boxToChange--none");
                } else {
                  document
                    .querySelector(".boxToChange--password")
                    .classList.add("boxToChange--none");
                }
              }}
            />
          </div>

          <div className="boxToChange boxToChange--password">
            {contentPassword}
            <Formik
              initialValues={{
                password: "",
                passwordConfirmation: "",
              }}
              validationSchema={LoginSchemat2}
              onSubmit={(values) => {
                change_password(values);
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="sign-change">
                  <Field
                    id="password"
                    name="password"
                    placeholder="Wprowadź nowe hasło"
                    type="password"
                    className="sign-change__input"
                  />

                  <div className="errors">
                    <ErrorMessage name="password" />
                  </div>

                  <div className="password-info">
                    <p className="password-info__text">
                      Pamiętaj by hasło zawierało:
                    </p>
                    <ul className="password-info__list">
                      <li className="password-info__list-item">
                        minimum 8 znaków
                      </li>
                      <li className="password-info__list-item">
                        przynajmniej jedną literę
                      </li>
                      <li className="password-info__list-item">
                        przynajmniej jedną cyfrę
                      </li>
                    </ul>
                  </div>

                  <Field
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    placeholder="Powtórz nowe hasło"
                    type="password"
                    className="sign-change__input"
                  />

                  <div className="errors">
                    <ErrorMessage name="passwordConfirmation" />
                  </div>

                  <button
                    className="sign-change__button sign-change__button--cancel"
                    onClick={() => {
                      document
                        .querySelector(".boxToChange--password")
                        .classList.remove("boxToChange--none");
                    }}
                    type="button"
                  >
                    Anuluj
                  </button>

                  <button type="submit" className="sign-change__button">
                    Zapisz
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </div>
    );
  }
};

export default SettingPage;
