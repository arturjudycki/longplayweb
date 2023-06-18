import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { userAuth, loginAuth } from "../API-utils/endpointsAuthUser";

const LoginSchemat = Yup.object().shape({
  username: Yup.string().required("Nazwa użytkownika jest wymagana!"),
  password: Yup.string().required("Hasło jest wymagane!"),
});

const Login = () => {
  const navigate = useNavigate();

  let infoLogin;
  let content;

  const { status: isLogged, data } = useQuery("user", userAuth, {
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const { isError, mutate } = useMutation(loginAuth, {
    onSuccess: () => {
      navigate("/longplayweb");
      navigate(0);
    },
  });

  if (isError) {
    infoLogin = (
      <p className="loginError">Twoje dane logowania są nieprawidłowe</p>
    );
  }

  if (isLogged === "loading") {
    content = (
      <div className="spinner__box spinner__box--center">
        <div className="spinner__load"></div>
      </div>
    );
  } else {
    if (isLogged === "success") {
      content = (
        <section className="userLogged__box">
          <p className="userLogged__text">Jesteś już zalogowany.</p>
        </section>
      );
    } else {
      content = (
        <div className="sign-wrapper">
          <section className="sign-choose">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sign-choose__type login_selected"
                  : "sign-choose__type"
              }
              to="/login"
            >
              Zaloguj się
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sign-choose__type register_selected"
                  : "sign-choose__type"
              }
              to="/register"
            >
              Załóż konto
            </NavLink>
          </section>
          {infoLogin}
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={LoginSchemat}
            onSubmit={(values) => {
              mutate(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="sign-form">
                <Field
                  id="username"
                  name="username"
                  placeholder="Nazwa użytkownika"
                  type="text"
                  className="sign-form__input"
                />

                <div className="errors">
                  <ErrorMessage name="username" />
                </div>

                <Field
                  id="password"
                  name="password"
                  placeholder="Hasło"
                  type="password"
                  className="sign-form__input"
                />

                <div className="errors">
                  <ErrorMessage name="password" />
                </div>

                <NavLink
                  to="/send-link-to-reset-password"
                  className="sign-form__remindPassword"
                >
                  Zapomniałeś hasła?
                </NavLink>
                <button type="submit" className="sign-form__button">
                  Zaloguj się
                </button>
              </Form>
            )}
          </Formik>
        </div>
      );
    }
  }

  return <>{content}</>;
};

export default Login;
