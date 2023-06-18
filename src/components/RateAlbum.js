import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAuth } from "../API-utils/endpointsAuthUser";
import {
  addRateAlbum,
  getRateAlbumByUser,
  editRate,
  deleteRate,
} from "../API-utils/endpointsManageRates";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Star, Favorite } from "@material-ui/icons";
import InfoToLog from "./InfoToLog";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  numerical_rating: Yup.number().required("Przyznaj albumowi liczbę gwiazdek!"),
  verbal_rating: Yup.string().max(
    160,
    "Opinia za długa, maksymalnie 160 znaków."
  ),
});

const RateAlbum = () => {
  const { id_music_album } = useParams();
  const queryClient = useQueryClient();

  const execute = useEffect;

  const displayPublicationDate = (publicationDate) => {
    let time = new Date(publicationDate);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return `${day}-${month}-${year}`;
  };

  const { status, data } = useQuery("user", userAuth, { retry: 0 });
  const { status: statusGetRateAlbum, data: rateAlbum } = useQuery(
    ["rate-album", id_music_album],
    () => getRateAlbumByUser(id_music_album),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  const [rateValueAlbum, setRateValueAlbum] = useState(null);
  const [hoverValue, setHoverValue] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [hoverFavorite, setHoverFavorite] = useState(false);

  const [modal, setModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleRateModal = () => {
    setRateModal(!rateModal);
  };

  const {
    isError: errorAdd,
    isSuccess: successAdd,
    mutate: add_rate,
  } = useMutation(addRateAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries(["rate-album"]);
      queryClient.invalidateQueries(["statistics-album"]);
    },
  });

  const { mutate: delete_rate } = useMutation(deleteRate, {
    onSuccess: () => {
      queryClient.invalidateQueries(["rate-album"]);
      queryClient.invalidateQueries(["statistics-album"]);
      setRateValueAlbum(null);
      setIsFavorite(false);
    },
  });

  const { mutate: edit_rate } = useMutation(editRate, {
    onSuccess: () => {
      queryClient.invalidateQueries(["rate-album"]);
      queryClient.invalidateQueries(["statistics-album"]);
    },
  });

  let contentRate;

  if (status === "error" || status === "loading") {
    contentRate = (
      <div className="rate__box">
        <div className="rate__container">
          <p className="rate__container-text">Ocena </p>
          <span className="rate__container-value">
            {rateValueAlbum === null && hoverValue !== null
              ? hoverValue + "/10"
              : ""}
            {rateValueAlbum !== null ? rateValueAlbum + "/10" : ""}
          </span>
          <Favorite
            className="heart-icon"
            onClick={() => {
              toggleModal();
            }}
            onMouseEnter={() => {
              setHoverFavorite(true);
            }}
            onMouseLeave={() => {
              setHoverFavorite(false);
            }}
            style={
              isFavorite || hoverFavorite
                ? { color: "#ffc200" }
                : { color: "#ddd" }
            }
          />
        </div>
        <div>
          {[...Array(10)].map((star, index) => {
            const value_rating = index + 1;

            return (
              <label key={index}>
                <input
                  type="radio"
                  className="star-input"
                  value={value_rating}
                  onClick={() => {
                    toggleModal();
                  }}
                />
                <Star
                  className="star-icon"
                  onMouseEnter={() => {
                    setHoverValue(value_rating);
                  }}
                  onMouseLeave={() => {
                    setHoverValue(null);
                  }}
                  style={
                    value_rating <= (rateValueAlbum || hoverValue)
                      ? { color: "#ffc200" }
                      : { color: "#ddd" }
                  }
                />
              </label>
            );
          })}
        </div>
        <form className="form__opinion">
          <textarea
            className="form__opinion-item"
            placeholder="Napisz swoją opinię"
            onClick={() => {
              toggleModal();
            }}
          ></textarea>
        </form>

        <button
          className="rate__box-button"
          type="submit"
          onClick={() => {
            toggleModal();
          }}
        >
          oceń
        </button>
      </div>
    );
  }
  if (status === "success") {
    if (statusGetRateAlbum === "loading") {
      contentRate = (
        <div className="spinner__box spinner__box--centerAlign">
          <div className="spinner__load"></div>
        </div>
      );
    }
    if (statusGetRateAlbum === "error") {
      contentRate = (
        <Formik
          initialValues={{
            favourites: false,
            numerical_rating: "",
            verbal_rating: "",
            music_album: id_music_album,
            user: data.user.id_user,
          }}
          validationSchema={LoginSchemat}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values) => {
            add_rate(values);
          }}
        >
          {({ handleSubmit, setErrors, values }) => (
            <Form onSubmit={handleSubmit} className="">
              <div
                className="rate__box"
                onDoubleClick={() => {
                  setRateValueAlbum(null);
                }}
              >
                <div className="rate__container">
                  <p className="rate__container-text">Ocena </p>
                  <span className="rate__container-value">
                    {rateValueAlbum === null && hoverValue !== null
                      ? hoverValue + "/10"
                      : ""}
                    {rateValueAlbum !== null ? rateValueAlbum + "/10" : ""}
                  </span>
                  <label className="heart-label">
                    <input
                      type="radio"
                      id="favourites"
                      name="favourites"
                      className="star-input"
                      onClick={() => {
                        if (values.favourites === false) {
                          values.favourites = true;
                        } else if (values.favourites === true) {
                          values.favourites = false;
                        }
                      }}
                    />
                    <Favorite
                      className="heart-icon"
                      onClick={() => {
                        setIsFavorite(!isFavorite);
                      }}
                      onMouseEnter={() => {
                        setHoverFavorite(true);
                      }}
                      onMouseLeave={() => {
                        setHoverFavorite(false);
                      }}
                      style={
                        isFavorite || hoverFavorite
                          ? { color: "#ffc200" }
                          : { color: "#ddd" }
                      }
                    />
                  </label>
                </div>
                <div>
                  {[...Array(10)].map((star, index) => {
                    const value_rating = index + 1;

                    return (
                      <label key={index}>
                        <Field
                          type="radio"
                          id="numerical_rating"
                          name="numerical_rating"
                          className="star-input"
                          value={value_rating}
                          onClick={() => {
                            setRateValueAlbum(value_rating);
                            setErrors({});
                          }}
                        />
                        <Star
                          className="star-icon"
                          onMouseEnter={() => {
                            setHoverValue(value_rating);
                          }}
                          onMouseLeave={() => {
                            setHoverValue(null);
                          }}
                          style={
                            value_rating <= (rateValueAlbum || hoverValue)
                              ? { color: "#ffc200" }
                              : { color: "#ddd" }
                          }
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="errors">
                  <ErrorMessage name="numerical_rating" />
                </div>
                <div className="form__opinion">
                  <Field
                    as="textarea"
                    id="verbal_rating"
                    name="verbal_rating"
                    className="form__opinion-item"
                    placeholder="Napisz swoją opinię"
                  />
                </div>
                <div className="errors">
                  <ErrorMessage name="verbal_rating" />
                </div>
                <button className="rate__box-button" type="submit">
                  oceń
                </button>
              </div>
            </Form>
          )}
        </Formik>
      );
    }
    if (statusGetRateAlbum === "success") {
      contentRate = (
        <>
          <div className="rate__box">
            <div className="rate__container">
              <p className="rate__container-text">Twoja ocena </p>
              <span className="rate__container-value">
                {rateAlbum.numerical_rating + "/10"}
              </span>
              <Favorite
                className="heart-icon heart-icon--noCursor"
                style={
                  rateAlbum.favourites
                    ? { color: "#ffc200" }
                    : { color: "#ddd" }
                }
              />
            </div>
            <div className="rate__change">
              <p className="rate__change-date">
                {displayPublicationDate(rateAlbum.rating_date)}
              </p>
            </div>
            <div>
              {[...Array(10)].map((star, index) => {
                const value_rating = index + 1;

                return (
                  <label key={index}>
                    <input
                      type="radio"
                      className="star-input"
                      value={value_rating}
                    />
                    <Star
                      className="star-icon star-icon--noCursor"
                      style={
                        value_rating <= rateAlbum.numerical_rating
                          ? { color: "#ffc200" }
                          : { color: "#ddd" }
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="form__opinion">
              {rateAlbum.verbal_rating === "" ? (
                ""
              ) : (
                <p className="form__opinion-item">{rateAlbum.verbal_rating}</p>
              )}
            </div>
            <div className="rate__edit-del">
              <div
                onClick={() => {
                  toggleRateModal();
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="" />
                <FontAwesomeIcon icon={faCircleXmark} className="" />
              </div>
            </div>
          </div>

          {rateModal ? (
            <div className="modal">
              <div
                onClick={() => {
                  toggleRateModal();
                }}
                className="overlay"
              ></div>
              <div className="modal-content modal-content--editArtist">
                <Formik
                  initialValues={{
                    id_rate: rateAlbum.id_rate,
                    favourites: rateAlbum.favourites,
                    numerical_rating: rateAlbum.numerical_rating,
                    verbal_rating: rateAlbum.verbal_rating,
                    music_album: rateAlbum.music_album,
                    user: rateAlbum.user,
                  }}
                  validationSchema={LoginSchemat}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={(values) => {
                    edit_rate(values);
                    toggleRateModal();
                  }}
                >
                  {({ handleSubmit, setErrors, values }) => (
                    <Form onSubmit={handleSubmit} className="">
                      <div className="rate__box">
                        <div className="rate__container">
                          <p className="rate__container-text"> Twoja ocena </p>
                          <span className="rate__container-value">
                            {rateValueAlbum === null && hoverValue !== null
                              ? hoverValue + "/10"
                              : ""}
                            {rateValueAlbum !== null
                              ? rateValueAlbum + "/10"
                              : ""}
                          </span>
                          {execute(() => {
                            if (rateAlbum.favourites === 1) {
                              setIsFavorite(true);
                            }
                            setRateValueAlbum(rateAlbum.numerical_rating);
                          }, [])}
                          <input
                            type="radio"
                            id="favourites"
                            name="favourites"
                            className="star-input"
                          />
                          <Favorite
                            className="heart-icon"
                            onClick={() => {
                              if (values.favourites === 0) {
                                values.favourites = 1;
                              } else if (values.favourites === 1) {
                                values.favourites = 0;
                              }
                              setIsFavorite(!isFavorite);
                            }}
                            onMouseEnter={() => {
                              setHoverFavorite(true);
                            }}
                            onMouseLeave={() => {
                              setHoverFavorite(false);
                            }}
                            style={
                              isFavorite || hoverFavorite
                                ? { color: "#ffc200" }
                                : { color: "#ddd" }
                            }
                          />
                        </div>
                        <div>
                          {[...Array(10)].map((star, index) => {
                            const value_rating = index + 1;

                            return (
                              <label key={index}>
                                <Field
                                  type="radio"
                                  id="numerical_rating"
                                  name="numerical_rating"
                                  className="star-input"
                                  value={value_rating}
                                  onClick={() => {
                                    setRateValueAlbum(value_rating);
                                    setErrors({});
                                  }}
                                />
                                <Star
                                  className="star-icon"
                                  onMouseEnter={() => {
                                    setHoverValue(value_rating);
                                  }}
                                  onMouseLeave={() => {
                                    setHoverValue(null);
                                  }}
                                  style={
                                    value_rating <=
                                    (rateValueAlbum || hoverValue)
                                      ? { color: "#ffc200" }
                                      : { color: "#ddd" }
                                  }
                                />
                              </label>
                            );
                          })}
                        </div>
                        <div className="errors">
                          <ErrorMessage name="numerical_rating" />
                        </div>
                        <div className="form__opinion">
                          <Field
                            as="textarea"
                            id="verbal_rating"
                            name="verbal_rating"
                            className="form__opinion-item form__opinion-item--height"
                            placeholder="Treść tekstu"
                            type="textarea"
                          />
                        </div>
                        <div className="errors">
                          <ErrorMessage name="verbal_rating" />
                        </div>
                      </div>
                      <button
                        className="rate__box-button rate__box-button--edit"
                        type="submit"
                      >
                        edytuj
                      </button>
                    </Form>
                  )}
                </Formik>
                <button
                  className="rate__box-button rate__box-button--position"
                  onClick={() => {
                    const values = { id_rate: rateAlbum.id_rate };
                    delete_rate(values);
                    toggleRateModal();
                  }}
                >
                  usuń
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      );
    }
  }

  return (
    <div className="rate">
      {contentRate}
      <InfoToLog toggleModal={toggleModal} props={{ modal }} />
    </div>
  );
};

export default RateAlbum;
