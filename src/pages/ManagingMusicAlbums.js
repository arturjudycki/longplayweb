import React, { useState } from "react";
import { userAuth } from "../API-utils/endpointsAuthUser";
import {
  editInfoAlbum,
  editCoverOfAlbum,
  addAlbum,
  getAllAlbums,
} from "../API-utils/endpointsManageMusic";
import { img_path } from "../API-utils/links";
import AssignArtist from "../components/AssignArtist";
import ManagingSong from "../components/ManagingSong";
import { useQuery, useMutation } from "react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRecordVinyl,
  faGuitar,
  faPlus,
  faMagnifyingGlass,
  faPen,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState({});

  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
    return <img src={preview} alt="" className="previewImg" />;
  }
};

const LoginSchemat = Yup.object().shape({
  title: Yup.string().required("Tytuł jest wymagany!"),

  cover: Yup.mixed()
    .required("Dodanie zdjęcia albumu jest wymagane!")
    .test(
      "FILE_TYPE",
      "Nieodpowiedni typ pliku - tylko .png, .jpeg., .jpg",
      (value) =>
        value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
    )
    .test(
      "FILE_SIZE",
      "Rozmiar zdjęcia za duży - max 100kB",
      (value) => value && value.size < 102400
    ),

  release_date: Yup.date().required("Data wydania albumu jest wymagana!"),

  duration: Yup.string().required("Czas trwania płyty jest wymagany!"),

  genre: Yup.string().required("Przypisanie gatunku jest wymagane!"),

  record_label: Yup.string().required("Wytwórnia muzyczna jest wymagana!"),
});

const LoginSchematEditInfo = Yup.object().shape({
  title: Yup.string().required("Tytuł jest wymagany!"),

  release_date: Yup.date().required("Data wydania albumu jest wymagana!"),

  duration: Yup.string().required("Czas trwania płyty jest wymagany!"),

  genre: Yup.string().required("Przypisanie gatunku jest wymagane!"),

  record_label: Yup.string().required("Wytwórnia muzyczna jest wymagana!"),
});

const LoginSchematCoverAlbum = Yup.object().shape({
  cover: Yup.mixed()
    .required("Dodanie zdjęcia albumu jest wymagane!")
    .test(
      "FILE_TYPE",
      "Nieodpowiedni typ pliku - tylko .png, .jpeg., .jpg",
      (value) =>
        value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type)
    )
    .test(
      "FILE_SIZE",
      "Rozmiar zdjęcia za duży - max 100kB",
      (value) => value && value.size < 102400
    ),
});

const EditAlbum = ({ albumInfo }) => {
  const album = albumInfo.album;
  const navigate = useNavigate();

  const [editAlbumModal, setEditAlbumModal] = useState(false);
  const [editAlbumInfo, setEditAlbumInfo] = useState(true);
  const [editCoverAlbum, setEditCoverAlbum] = useState(false);
  const [infoEdit, setInfoEdit] = useState(false);
  const [coverEdit, setCoverEdit] = useState(false);

  let infoEditAlbum;
  let coverEditAlbum;

  const toggleEditAlbumModal = () => {
    setEditAlbumModal(!editAlbumModal);
  };

  const toggleEditArtistModalNavigate = () => {
    setEditAlbumModal(!editAlbumModal);
    navigate("/managing-music-albums");
    navigate(0);
  };

  const {
    isError: errorEditInfoAlbum,
    isSuccess: successEditInfoAlbum,
    mutate: edit_info_album,
  } = useMutation(editInfoAlbum, {
    onSuccess: () => {
      setTimeout(toggleEditArtistModalNavigate, 1500);
    },
  });

  if (successEditInfoAlbum) {
    infoEditAlbum = (
      <p className="edit-artist-info edit-artist-info--success">
        Album został pomyślnie edytowany
      </p>
    );
  }

  if (errorEditInfoAlbum) {
    infoEditAlbum = (
      <p className="edit-artist-info edit-artist-info--error">
        Wystąpił nieoczekiwanie błąd
      </p>
    );
  }

  const {
    isError: errorEditCoverAlbum,
    isSuccess: successErrorCoverAlbum,
    mutate: edit_cover_album,
  } = useMutation(editCoverOfAlbum, {
    onSuccess: () => {
      setTimeout(toggleEditArtistModalNavigate, 1500);
    },
  });

  if (successErrorCoverAlbum) {
    coverEditAlbum = (
      <p className="edit-artist-info edit-artist-info--success">
        Okładka została pomyślnie edytowana
      </p>
    );
  }

  if (errorEditCoverAlbum) {
    coverEditAlbum = (
      <p className="edit-artist-info edit-artist-info--error">
        Wystąpił nieoczekiwanie błąd
      </p>
    );
  }

  const displayPublicationDate = (publicationDate) => {
    let time = new Date(publicationDate);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return `${day}-${month}-${year}`;
  };

  const displayPublicationDate2 = (publicationDate) => {
    let time = new Date(publicationDate);
    let day = time.getDate();
    let month = time.getMonth();
    let year = time.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return Date.UTC(year, month, day);
  };

  return (
    <>
      <div
        className="searched-artist__edit searched-artist__edit--top"
        onClick={toggleEditAlbumModal}
      >
        <p className="searched-artist__edit-text">Edytuj</p>
        <FontAwesomeIcon icon={faPen} />
      </div>
      {editAlbumModal ? (
        <div className="modal modal--zIndex">
          <div
            onClick={() => {
              setInfoEdit(!infoEdit);
              setCoverEdit(!coverEdit);
              toggleEditAlbumModal();
            }}
            className="overlay"
          ></div>
          <div className="modal-content modal-content--editAlbum">
            <div className="edit-album__choose-box">
              <div
                onClick={() => {
                  if (editCoverAlbum) {
                    setEditCoverAlbum(!editCoverAlbum);
                    setEditAlbumInfo(!editAlbumInfo);
                  }
                }}
                className={
                  editAlbumInfo
                    ? "edit-album__choose-item edit-album__choose-item-active"
                    : "edit-album__choose-item"
                }
              >
                Edytuj dane albumu
              </div>
              <div
                onClick={() => {
                  if (editAlbumInfo) {
                    setEditCoverAlbum(!editCoverAlbum);
                    setEditAlbumInfo(!editAlbumInfo);
                  }
                }}
                className={
                  editCoverAlbum
                    ? "edit-album__choose-item edit-album__choose-item-active"
                    : "edit-album__choose-item"
                }
              >
                Edytuj okładkę albumu
              </div>
            </div>
            {editAlbumInfo ? (
              <div>
                <Formik
                  initialValues={{
                    id_music_album: album.id_music_album,
                    title: album.title,
                    release_date: new Date(
                      displayPublicationDate2(album.release_date)
                    ),
                    duration: album.duration,
                    type_of_album: album.type_of_album,
                    genre: album.genre,
                    record_label: album.record_label,
                  }}
                  validationSchema={LoginSchematEditInfo}
                  onSubmit={(values) => {
                    setInfoEdit(!infoEdit);
                    edit_info_album(values);
                  }}
                >
                  {({ handleSubmit }) => (
                    <section className="adding-music adding-music--marginTop">
                      {infoEdit ? infoEditAlbum : ""}
                      <Form
                        onSubmit={handleSubmit}
                        className="adding-music__form"
                      >
                        <Field
                          id="title"
                          name="title"
                          placeholder="Tytuł albumu"
                          type="text"
                          className="adding-music__form-input"
                        />
                        <div className="errors">
                          <ErrorMessage name="title" />
                        </div>

                        <label className="add-date add-date--flexBetween">
                          Data wydania albumu{" "}
                          <span>
                            {displayPublicationDate(album.release_date)}
                          </span>
                          <Field
                            id="release_date"
                            name="release_date"
                            placeholder="Data wydania albumu"
                            type="date"
                            className="adding-music__form-input adding-music__form-input-date"
                          />
                        </label>
                        <div className="errors">
                          <ErrorMessage name="release_date" />
                        </div>
                        <Field
                          id="duration"
                          name="duration"
                          placeholder="Czas trwania płyty"
                          type="text"
                          className="adding-music__form-input"
                        />
                        <div className="errors">
                          <ErrorMessage name="duration" />
                        </div>
                        <div className="radio-box__choose">
                          <label>
                            <Field
                              type="radio"
                              id="type_of_album"
                              name="type_of_album"
                              value="studio_album"
                              className="radio-box__choose-item"
                            />
                            Album studyjny
                          </label>
                          <label>
                            <Field
                              type="radio"
                              id="type_of_album"
                              name="type_of_album"
                              value="live_album"
                              className="radio-box__choose-item"
                            />
                            Album koncertowy
                          </label>
                          <label>
                            <Field
                              type="radio"
                              id="type_of_album"
                              name="type_of_album"
                              value="compilation_album"
                              className="radio-box__choose-item"
                            />
                            Album kompilacyjny
                          </label>
                          <br className="space-beetween-type-of-album"></br>
                          <label>
                            <Field
                              type="radio"
                              id="type_of_album"
                              name="type_of_album"
                              value="EP"
                              className="radio-box__choose-item"
                            />
                            EP - minialbum
                          </label>
                          <label>
                            <Field
                              type="radio"
                              id="type_of_album"
                              name="type_of_album"
                              value="OST"
                              className="radio-box__choose-item"
                            />
                            OST - ścieżka dźwiękowa
                          </label>
                        </div>
                        <Field
                          id="genre"
                          name="genre"
                          placeholder="Gatunek"
                          type="text"
                          className="adding-music__form-input"
                        />
                        <div className="errors">
                          <ErrorMessage name="genre" />
                        </div>
                        <Field
                          id="record_label"
                          name="record_label"
                          placeholder="Wytwórnia muzyczna"
                          type="text"
                          className="adding-music__form-input"
                        />
                        <div className="errors">
                          <ErrorMessage name="record_label" />
                        </div>
                        <button type="submit" className="add-button">
                          Edytuj album
                        </button>
                      </Form>
                    </section>
                  )}
                </Formik>
              </div>
            ) : (
              ""
            )}
            {editCoverAlbum ? (
              <div>
                <Formik
                  initialValues={{
                    id_music_album: album.id_music_album,
                    cover: "",
                  }}
                  validationSchema={LoginSchematCoverAlbum}
                  onSubmit={(values) => {
                    setCoverEdit(!coverEdit);
                    edit_cover_album(values);
                  }}
                >
                  {({ handleSubmit, values, setFieldValue }) => (
                    <section className="adding-music adding-music--marginTop">
                      {coverEdit ? coverEditAlbum : ""}
                      <Form
                        onSubmit={handleSubmit}
                        className="adding-music__form"
                      >
                        <div className="edit-cover">
                          <div>
                            <p className="edit-cover__current">
                              Obecna okładka
                            </p>
                            <img src={img_path + album.cover} alt="cover" />
                          </div>

                          <div className="add-cover">
                            <p>Dodaj nową okładkę albumu</p>

                            <div className="preview-image__box">
                              {values.cover && (
                                <PreviewImage file={values.cover} />
                              )}
                            </div>

                            <input
                              type="file"
                              id="cover"
                              name="cover"
                              className="file-cover"
                              onChange={(event) => {
                                setFieldValue(
                                  "cover",
                                  event.currentTarget.files[0]
                                );
                              }}
                            />
                            <div className="errors">
                              <ErrorMessage name="cover" />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="add-button add-button--end"
                        >
                          Edytuj okładkę
                        </button>
                      </Form>
                    </section>
                  )}
                </Formik>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const ManagingMusicAlbums = () => {
  const navigate = useNavigate();

  const [sectionAdd, setSectionAdd] = useState(true);
  const [sectionManage, setSectionManage] = useState(false);
  const [sectionSongs, setSectionSongs] = useState(false);
  const [albumsSearch, setAlbumsSearch] = useState([]);
  const [albumsSearch2, setAlbumsSearch2] = useState([]);
  const [infoAddAlbum, setInfoAddAlbum] = useState(false);

  const toggleInfoAddAlbum = () => {
    setInfoAddAlbum(!infoAddAlbum);
  };

  const { status: isLogged, data } = useQuery("user", userAuth, { retry: 0 });

  const { status: isAllAlbums, data: AllAlbums } = useQuery(
    "albums",
    getAllAlbums,
    { retry: 0 }
  );

  const {
    data: addedAlbum,
    isError: errorAddAlbum,
    isSuccess: successAddAlbum,
    mutate: add_album,
  } = useMutation(addAlbum, {});

  const infoSuccessAddAlbum = () => {
    return (
      <div className="infoAlbum">
        <p>Album został pomyślnie dodany.</p>
        <button
          className="add-button"
          onClick={() => {
            navigate("/managing-music-albums");
            navigate(0);
          }}
        >
          Zamknij
        </button>
      </div>
    );
  };

  const infoErrorAddAlbum = () => {
    return (
      <div className="infoAlbum">
        <p>Wystąpił nieoczekiwanie błąd.</p>
        <button
          className="add-button"
          onClick={() => {
            navigate("/managing-music-albums");
            navigate(0);
          }}
        >
          Zamknij
        </button>
      </div>
    );
  };

  const handleSubmitSearch = (e) => e.preventDefault();

  const handleSearchChange = (e) => {
    if (isAllAlbums === "success") {
      const resultsArray = AllAlbums.filter(
        (album) =>
          e.target.value !== "" &&
          album.title
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setAlbumsSearch(resultsArray);
    }
  };

  const handleSearchChange2 = (e) => {
    if (isAllAlbums === "success") {
      const resultsArray = AllAlbums.filter(
        (album) =>
          e.target.value !== "" &&
          album.title
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setAlbumsSearch2(resultsArray);
    }
  };

  const managingSongs = () => {
    return (
      <>
        <form className="search-artist" onSubmit={handleSubmitSearch}>
          <div className="search-artist__box">
            <input
              type="text"
              placeholder="Wyszukaj album, aby zarządzać utworami znajdującymi się na albumie"
              className="search-artist__input"
              onChange={handleSearchChange2}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon-artists"
            />
          </div>
        </form>

        <section className="searched-artist">
          {albumsSearch2.map((album) => (
            <div
              className="searched-artist__box searched-artist__box--spaceBetween"
              key={album.id_music_album}
            >
              <NavLink
                to={{
                  pathname: "/music-album/".concat(`${album.id_music_album}`),
                }}
                className="link-to-artist link-to-artist--display"
              >
                <img
                  src={img_path + album.cover}
                  alt="cover"
                  className="album-page__cover album-page__cover--smaller"
                />
                <div className="searched-artist__name">{album.title}</div>
              </NavLink>
              <ManagingSong props={{ album }} />
            </div>
          ))}
        </section>
      </>
    );
  };

  const searchingAlbum = () => {
    return (
      <>
        <form className="search-artist" onSubmit={handleSubmitSearch}>
          <div className="search-artist__box">
            <input
              type="text"
              placeholder="Wyszukaj album, aby go edytować lub przypisać do niego wykonawcę"
              className="search-artist__input"
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon-artists"
            />
          </div>
        </form>

        <section className="searched-artist">
          {albumsSearch.map((album) => (
            <div
              className="searched-artist__box searched-artist__box--spaceBetween"
              key={album.id_music_album}
            >
              <NavLink
                to={{
                  pathname: "/music-album/".concat(`${album.id_music_album}`),
                }}
                className="link-to-artist link-to-artist--display"
              >
                <img
                  src={img_path + album.cover}
                  alt="cover"
                  className="album-page__cover album-page__cover--smaller"
                />
                <div className="searched-artist__name">{album.title}</div>
              </NavLink>

              <EditAlbum albumInfo={{ album }} />
              <AssignArtist props={{ album }} />
            </div>
          ))}
        </section>
      </>
    );
  };

  const addingAlbum = () => {
    return (
      <Formik
        initialValues={{
          title: "",
          cover: "",
          release_date: "",
          duration: "",
          type_of_album: "studio_album",
          genre: "",
          record_label: "",
        }}
        validationSchema={LoginSchemat}
        onSubmit={(values, onSubmitProps) => {
          add_album(values);
          toggleInfoAddAlbum();
          onSubmitProps.resetForm();
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <section className="adding-music adding-music--marginTop">
            <Form onSubmit={handleSubmit} className="adding-music__form">
              <Field
                id="title"
                name="title"
                placeholder="Tytuł albumu"
                type="text"
                className="adding-music__form-input"
              />
              <div className="errors">
                <ErrorMessage name="title" />
              </div>

              <div className="add-cover">
                <p>Dodaj okładkę albumu</p>

                <div className="preview-image__box">
                  {values.cover && <PreviewImage file={values.cover} />}
                </div>

                <input
                  type="file"
                  id="cover"
                  name="cover"
                  className="file-cover"
                  onChange={(event) => {
                    setFieldValue("cover", event.currentTarget.files[0]);
                  }}
                />
              </div>
              <div className="errors">
                <ErrorMessage name="cover" />
              </div>

              <label className="add-date">
                Data wydania albumu
                <Field
                  id="release_date"
                  name="release_date"
                  placeholder="Data wydania albumu"
                  type="date"
                  className="adding-music__form-input adding-music__form-input-date"
                />
              </label>
              <div className="errors">
                <ErrorMessage name="release_date" />
              </div>
              <Field
                id="duration"
                name="duration"
                placeholder="Czas trwania płyty"
                type="text"
                className="adding-music__form-input"
              />
              <div className="errors">
                <ErrorMessage name="duration" />
              </div>
              <div className="radio-box__choose">
                <label>
                  <Field
                    type="radio"
                    id="type_of_album"
                    name="type_of_album"
                    value="studio_album"
                    className="radio-box__choose-item"
                  />
                  Album studyjny
                </label>
                <label>
                  <Field
                    type="radio"
                    id="type_of_album"
                    name="type_of_album"
                    value="live_album"
                    className="radio-box__choose-item"
                  />
                  Album koncertowy
                </label>
                <label>
                  <Field
                    type="radio"
                    id="type_of_album"
                    name="type_of_album"
                    value="compilation_album"
                    className="radio-box__choose-item"
                  />
                  Album kompilacyjny
                </label>
                <br className="space-beetween-type-of-album"></br>
                <label>
                  <Field
                    type="radio"
                    id="type_of_album"
                    name="type_of_album"
                    value="EP"
                    className="radio-box__choose-item"
                  />
                  EP - minialbum
                </label>
                <label>
                  <Field
                    type="radio"
                    id="type_of_album"
                    name="type_of_album"
                    value="OST"
                    className="radio-box__choose-item"
                  />
                  OST - ścieżka dźwiękowa
                </label>
              </div>
              <Field
                id="genre"
                name="genre"
                placeholder="Gatunek"
                type="text"
                className="adding-music__form-input"
              />
              <div className="errors">
                <ErrorMessage name="genre" />
              </div>
              <Field
                id="record_label"
                name="record_label"
                placeholder="Wytwórnia muzyczna"
                type="text"
                className="adding-music__form-input"
              />
              <div className="errors">
                <ErrorMessage name="record_label" />
              </div>
              <button type="submit" className="add-button">
                Dodaj album
              </button>
            </Form>
          </section>
        )}
      </Formik>
    );
  };

  if (isLogged === "error") {
    navigate("/longplayweb");
  }

  if (isLogged === "success") {
    if (data.user.user_type !== "admin") {
      navigate("/longplayweb");
    } else {
      return (
        <>
          <h1 className="managing-music__title">
            Administruj pozycjami muzycznymi
          </h1>
          <hr className="line--margin-top" />
          <section className="managing-music">
            <NavLink
              to="/managing-music-albums"
              className={({ isActive }) =>
                isActive
                  ? "heroUser__link heroUser__link--flexEvenly heroUser__link--selected"
                  : "heroUser__link heroUser__link--flexEvenly"
              }
            >
              <FontAwesomeIcon icon={faRecordVinyl} className="faRecordVinyl" />
              <p className="heroUser__settings-link">Albumy muzyczne/Utwory</p>
            </NavLink>
            <NavLink
              to="/managing-music-artists"
              className={({ isActive }) =>
                isActive
                  ? "heroUser__link heroUser__link--flexEvenly heroUser__link--selected"
                  : "heroUser__link heroUser__link--flexEvenly"
              }
            >
              <FontAwesomeIcon icon={faGuitar} className="faGuitar" />
              <p className="heroUser__settings-link">Wykonawcy</p>
            </NavLink>
          </section>
          <hr className="line--margin-bottom" />

          <main className="section-artist-choose">
            <div
              onClick={() => {
                if (sectionManage) {
                  setSectionManage(!sectionManage);
                  setSectionAdd(!sectionAdd);
                } else if (sectionSongs) {
                  setSectionAdd(!sectionAdd);
                  setSectionSongs(!sectionSongs);
                }
              }}
              className={
                sectionAdd
                  ? "section-artist-choose__item section-artist-choose__item-active"
                  : "section-artist-choose__item"
              }
            >
              <p>
                Dodanie nowego albumu
                <FontAwesomeIcon icon={faPlus} className="icon-artists" />
              </p>
            </div>
            <div
              onClick={() => {
                if (sectionAdd) {
                  setSectionManage(!sectionManage);
                  setSectionAdd(!sectionAdd);
                } else if (sectionSongs) {
                  setSectionManage(!sectionManage);
                  setSectionSongs(!sectionSongs);
                }
              }}
              className={
                sectionManage
                  ? "section-artist-choose__item section-artist-choose__item-active"
                  : "section-artist-choose__item"
              }
            >
              <p>
                Zarządzanie dodanym albumem
                <FontAwesomeIcon icon={faGears} className="icon-artists" />
              </p>
            </div>
            <div
              onClick={() => {
                if (sectionAdd) {
                  setSectionSongs(!sectionSongs);
                  setSectionAdd(!sectionAdd);
                } else if (sectionManage) {
                  setSectionSongs(!sectionSongs);
                  setSectionManage(!sectionManage);
                }
              }}
              className={
                sectionSongs
                  ? "section-artist-choose__item section-artist-choose__item-active"
                  : "section-artist-choose__item"
              }
            >
              <p>
                Zarządzanie utworami
                <FontAwesomeIcon icon={faGears} className="icon-artists" />
              </p>
            </div>
          </main>
          {sectionManage && searchingAlbum()}
          {sectionAdd && addingAlbum()}
          {sectionSongs && managingSongs()}

          {infoAddAlbum ? (
            <div className="modal">
              <div
                onClick={() => {
                  navigate("/managing-music-albums");
                  navigate(0);
                }}
                className="overlay"
              ></div>
              <div className="modal-content">
                {errorAddAlbum && infoErrorAddAlbum()}
                {successAddAlbum && infoSuccessAddAlbum()}
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      );
    }
  }
};

export default ManagingMusicAlbums;
