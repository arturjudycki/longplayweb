import React from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../API-utils/endpointsAuthUser";

const LoginSchemat = Yup.object().shape({
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

const ResetPassword = () => {
  const { token, email } = useParams();

  let content;

  const { isSuccess, mutate } = useMutation(resetPassword, {});

  if (isSuccess) {
    content = (
      <section className="popUpPassword">
        <div className="popUpPassword__200">
          <p>Zmiana hasła została pomyślnie dokonana</p>
        </div>
      </section>
    );
  }

  return (
    <div className="sign-wrapper sign-wrapper--wider">
      <p className="sign-change-password">
        Ustal nowe hasło dla Twojego konta.
      </p>
      {content}
      <Formik
        initialValues={{
          token,
          email,
          password: "",
          passwordConfirmation: "",
        }}
        validationSchema={LoginSchemat}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="sign-form">
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

            <div className="password-info">
              <p className="password-info__text">
                Pamiętaj by hasło zawierało:
              </p>
              <ul className="password-info__list">
                <li className="password-info__list-item">minimum 8 znaków</li>
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
              placeholder="Powtórz hasło"
              type="password"
              className="sign-form__input"
            />

            <div className="errors">
              <ErrorMessage name="passwordConfirmation" />
            </div>

            <button type="submit" className="sign-form__button">
              Zmień hasło
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
