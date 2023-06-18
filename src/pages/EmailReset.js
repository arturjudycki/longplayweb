import React from "react";
import { useQuery, useMutation } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { userAuth, sendLinkToEmail } from "../API-utils/endpointsAuthUser";

import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  email: Yup.string()
    .email("Niepoprawny e-mail!")
    .required("E-mail jest wymagany!"),
});

const EmailReset = () => {
  let content;
  let infoResetEmail;

  const { status: isLogged, data } = useQuery("user", userAuth, { retry: 0 });

  const { isError, isSuccess, mutate } = useMutation(sendLinkToEmail, {});

  if (isSuccess) {
    infoResetEmail = (
      <section className="popUpEmail">
        <div className="popUpEmail__200">
          <p>Sprawdź swój adres e-mail.</p>
          <p>Tam powinien znaleźć się link do zmiany hasła.</p>
        </div>
      </section>
    );
  }

  if (isError) {
    infoResetEmail = (
      <p className="loginError">
        Użytkownik o takim adresie e-mail nie istnieje
      </p>
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
          <p className="userLogged__text">
            Brak dostępu do tej funkcjonalności
          </p>
          <p className="userLogged__text">
            z poziomu zalogowanego użytkownika.
          </p>
        </section>
      );
    } else {
      content = (
        <div className="sign-wrapper sign-wrapper--wider">
          <p className="sign-change-password">
            Na podany adres e-mail zostanie przesłany link do zmiany hasła.
          </p>
          {infoResetEmail}
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={LoginSchemat}
            onSubmit={(values) => {
              mutate(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="sign-form">
                <Field
                  id="email"
                  name="email"
                  placeholder="E-mail"
                  type="email"
                  className="sign-form__input"
                />

                <div className="errors">
                  <ErrorMessage name="email" />
                </div>

                <button type="submit" className="sign-form__button">
                  Wyślij
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

export default EmailReset;
