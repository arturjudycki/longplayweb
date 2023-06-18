import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  faFileAudio,
  faMagnifyingGlass,
  faPlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getAllArtists } from "../API-utils/endpointsManageArtists";
import {
  addSong,
  getSongsOfAlbum,
  editSong,
  deleteSong,
} from "../API-utils/endpointsManageSongs";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  track_number: Yup.number().required("Numer utworu na albumie jest wymagany!"),

  title: Yup.string().required("Tytuł jest wymagany!"),

  duration: Yup.string().required("Czas trwania utworu jest wymagany!"),

  id_artist: Yup.number().required("Wykonawca jest wymagany!"),
});

const EditSong = ({ props }) => {
  const song = props.song;
  const [editSongModal, setEditSongModal] = useState(false);
  const [artistsSearch, setArtistsSearch] = useState([]);
  const [idArtist, setIdArtist] = useState();
  let [artistName, setArtistName] = useState("");

  let infoEditSong;

  const clearInfoEditSong = () => {
    infoEditSong = "";
  };

  const toggleEditSongModal = () => {
    setEditSongModal(!editSongModal);
  };

  const { status: isAllArtists, data: AllArtists } = useQuery(
    "artists",
    getAllArtists,
    { retry: 0 }
  );

  const queryClient = useQueryClient();

  const {
    isError: errorEditInfoSong,
    isSuccess: successEditInfoSong,
    mutate: edit_song,
  } = useMutation(editSong, {
    onSuccess: () => {
      setTimeout(toggleEditSongModal, 1500);
      setTimeout(queryClient.invalidateQueries(["songs-data"]), 1500);
      setTimeout(clearInfoEditSong(), 1500);
    },
  });

  if (successEditInfoSong) {
    infoEditSong = (
      <p className="edit-artist-info edit-artist-info--success">
        Utwór został pomyślnie edytowany
      </p>
    );
  }

  if (errorEditInfoSong) {
    infoEditSong = (
      <p className="edit-artist-info edit-artist-info--error">
        Wystąpił nieoczekiwanie błąd
      </p>
    );
  }

  const handleSubmitSearch2 = (e) => e.preventDefault();

  const handleSearchChange2 = (e) => {
    if (isAllArtists === "success") {
      const resultsArray = AllArtists.filter(
        (artist) =>
          e.target.value !== "" &&
          artist.name
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setArtistsSearch(resultsArray);
    }
  };

  const searchingArtist2 = () => {
    return (
      <>
        <div
          className="search-artist search-artist--margin"
          onSubmit={handleSubmitSearch2}
        >
          <div className="search-artist__box">
            <input
              type="text"
              placeholder="Wyszukaj wykonawcę, aby go dodać"
              className="search-artist__input search-artist__input--w"
              onChange={handleSearchChange2}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon-artists icon-artists--search-song"
            />
          </div>
        </div>

        <section className="searched-artist">
          {artistsSearch.map((artist) => (
            <div className="song__search-artist" key={artist.id_artist}>
              <NavLink
                to={{
                  pathname: "/artist/".concat(`${artist.id_artist}`),
                }}
                className="link-to-artist"
              >
                <div className="song__search-artist-item song__search-artist-item--artist">
                  {artist.name}
                </div>
              </NavLink>
              <div
                onClick={() => {
                  setIdArtist(artist.id_artist);
                  setArtistName(artist.name);
                }}
                className="song__search-artist-item song__search-artist-item--paddingLeft"
              >
                <p>Dodaj</p>
                <FontAwesomeIcon icon={faPlus} className="icon-artists" />
              </div>
            </div>
          ))}
        </section>
      </>
    );
  };

  return (
    <>
      <div
        className="searched-artist__edit searched-artist__edit--top"
        onClick={() => {
          setEditSongModal(!editSongModal);
          setIdArtist(song.artist);
          setArtistName(song.name);
        }}
      >
        <p className="searched-artist__edit-text">Edytuj</p>
        <FontAwesomeIcon icon={faPen} />
      </div>
      {editSongModal ? (
        <div className="modal modal--zIndex">
          <div
            onClick={() => {
              setEditSongModal(!editSongModal);
            }}
            className="overlay"
          ></div>
          <div className="modal-content modal-content--editSong">
            {infoEditSong}
            <Formik
              initialValues={{
                id_song: song.id_song,
                track_number: song.track_number,
                title: song.title,
                duration: song.duration,
                id_music_album: song.music_album,
                id_artist: idArtist,
              }}
              enableReinitialize={true}
              validationSchema={LoginSchemat}
              onSubmit={(values) => {
                edit_song(values);
              }}
            >
              {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit} className="song__form">
                  <div className="song__choose-author">
                    <span className="song__author">
                      Wykonawca: {artistName}
                    </span>
                    <p>Wyszykaj wykonawcę, by go edytować </p>
                  </div>
                  <div className="errors">
                    <ErrorMessage name="id_artist" />
                  </div>
                  {searchingArtist2()}
                  <label>
                    <p>Numer utworu na albumie</p>
                    <Field
                      id="track_number"
                      name="track_number"
                      placeholder="Numer utworu na albumie"
                      type="number"
                      className="song__form-item"
                    />
                  </label>

                  <div className="errors">
                    <ErrorMessage name="track_number" />
                  </div>

                  <label>
                    <p>Tytuł utworu</p>
                    <Field
                      id="title"
                      name="title"
                      placeholder="Tytuł utworu"
                      type="text"
                      className="song__form-item"
                    />
                  </label>

                  <div className="errors">
                    <ErrorMessage name="title" />
                  </div>

                  <label>
                    <p>Czas trwania utworu</p>
                    <Field
                      id="duration"
                      name="duration"
                      placeholder="Czas trwania utworu"
                      type="text"
                      className="song__form-item"
                    />
                  </label>

                  <div className="errors">
                    <ErrorMessage name="duration" />
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      console.log(values);
                    }}
                    className="createAccount__form-button"
                  >
                    Edytuj utwór
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const DeleteSong = ({ props }) => {
  const song = props.song;

  const [deleteModal, setDeleteModal] = useState("");

  const { mutate: delete_song } = useMutation(deleteSong, {
    onSuccess: () => {
      queryClient.invalidateQueries(["songs-data"]);
    },
  });

  const queryClient = useQueryClient();

  return (
    <>
      <div
        className="searched-artist__edit searched-artist__edit--top"
        onClick={() => {
          setDeleteModal(!deleteModal);
        }}
      >
        <p className="searched-artist__edit-text">Usuń</p>
        <FontAwesomeIcon icon={faTrash} />
      </div>
      {deleteModal ? (
        <div className="modal modal--zIndex">
          <div
            onClick={() => {
              setDeleteModal(!deleteModal);
            }}
            className="overlay"
          ></div>
          <div className="modal-content modal-content--deleteSong">
            <p>Czy na pewno chcesz usunąć?</p>
            <button
              className="button-song"
              onClick={() => {
                let values = { id_song: song.id_song };
                delete_song(values);
              }}
            >
              Tak
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const ManagingSong = ({ props }) => {
  const id_music_album = props.album.id_music_album;
  const [songModal, setSongModal] = useState(false);
  const [artistsSearch, setArtistsSearch] = useState([]);

  let contentSongs;

  const queryClient = useQueryClient();

  const { mutate: add_song } = useMutation(addSong, {
    onSuccess: () => {
      queryClient.invalidateQueries(["songs-data"]);
    },
  });

  const [idArtist, setIdArtist] = useState();
  let [artistName, setArtistName] = useState("");

  const { status: isSongs, data: songs } = useQuery(
    ["songs-data", id_music_album],
    () => getSongsOfAlbum(id_music_album),
    { retry: 0 }
  );

  if (isSongs === "loading") {
    contentSongs = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isSongs === "success") {
    if (songs.length === 0) {
      contentSongs = <p className="songs__none">Brak dodanych utworów</p>;
    } else {
      contentSongs = songs
        .sort((a, b) => a.track_number - b.track_number)
        .map((song) => (
          <div className="song__box-item-r" key={song.id_song}>
            <div className="song__item-c">{song.track_number}</div>
            <div className="song__item-c">{song.title}</div>
            <div className="song__item-c song__item-c--narrower">
              {song.duration}
            </div>
            <div className="song__item-c">{song.name}</div>
            <div className="song__item-c">
              <EditSong props={{ song }} />
            </div>
            <div className="song__item-c">
              <DeleteSong props={{ song }} />
            </div>
          </div>
        ));
    }
  }

  const { status: isAllArtists, data: AllArtists } = useQuery(
    "artists",
    getAllArtists,
    { retry: 0 }
  );

  const handleSubmitSearch = (e) => e.preventDefault();

  const handleSearchChange = (e) => {
    if (isAllArtists === "success") {
      const resultsArray = AllArtists.filter(
        (artist) =>
          e.target.value !== "" &&
          artist.name
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setArtistsSearch(resultsArray);
    }
  };

  const searchingArtist = () => {
    return (
      <>
        <div
          className="search-artist search-artist--margin"
          onSubmit={handleSubmitSearch}
        >
          <div className="search-artist__box">
            <input
              type="text"
              placeholder="Wyszukaj wykonawcę, aby go dodać"
              className="search-artist__input search-artist__input--w"
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon-artists"
            />
          </div>
        </div>

        <section className="searched-artist">
          {artistsSearch.map((artist) => (
            <div className="song__search-artist" key={artist.id_artist}>
              <NavLink
                to={{
                  pathname: "/artist/".concat(`${artist.id_artist}`),
                }}
                className="link-to-artist"
              >
                <div className="song__search-artist-item song__search-artist-item--artist">
                  {artist.name}
                </div>
              </NavLink>
              <div
                onClick={() => {
                  setIdArtist(artist.id_artist);
                  setArtistName(artist.name);
                }}
                className="song__search-artist-item song__search-artist-item--paddingLeft"
              >
                <p>Dodaj</p>
                <FontAwesomeIcon icon={faPlus} className="icon-artists" />
              </div>
            </div>
          ))}
        </section>
      </>
    );
  };

  return (
    <>
      <div
        className="assign-link"
        onClick={() => {
          setSongModal(!songModal);
        }}
      >
        <p className="assign-link__text">Zarządzaj utworami</p>
        <FontAwesomeIcon icon={faFileAudio} className="faFileAudio" />
      </div>
      {songModal ? (
        <div className="modal modal--zIndex">
          <div
            onClick={() => {
              setSongModal(!songModal);
            }}
            className="overlay"
          ></div>
          <div className="modal-content modal-content--songs">
            <div className="song__box-item-r song__box-item-r-title">
              <p className="song__item-c">Numer utworu na płycie</p>
              <p className="song__item-c">Tytuł utworu</p>
              <p className="song__item-c song__item-c--narrower">
                Czas trwania
              </p>
              <p className="song__item-c">Wykonawca</p>
              <p className="song__item-c">Edytuj dane</p>
              <p className="song__item-c">Usuń utwór</p>
            </div>
            {contentSongs}
            <Formik
              initialValues={{
                track_number: "",
                title: "",
                duration: "",
                id_music_album: id_music_album,
                id_artist: idArtist,
              }}
              enableReinitialize={true}
              validationSchema={LoginSchemat}
              onSubmit={(values) => {
                add_song(values);
              }}
            >
              {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit} className="song__form">
                  <div className="song__choose-author">
                    <p>Wybierz najpierw wykonawcę </p>
                    <span> Wykonawca: {artistName} </span>
                  </div>
                  <div className="errors">
                    <ErrorMessage name="id_artist" />
                  </div>
                  {searchingArtist()}
                  <Field
                    id="track_number"
                    name="track_number"
                    placeholder="Numer utworu na albumie"
                    type="number"
                    className="song__form-item"
                  />

                  <div className="errors">
                    <ErrorMessage name="track_number" />
                  </div>

                  <Field
                    id="title"
                    name="title"
                    placeholder="Tytuł utworu"
                    type="text"
                    className="song__form-item"
                  />

                  <div className="errors">
                    <ErrorMessage name="title" />
                  </div>

                  <Field
                    id="duration"
                    name="duration"
                    placeholder="Czas trwania utworu"
                    type="text"
                    className="song__form-item"
                  />

                  <div className="errors">
                    <ErrorMessage name="duration" />
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      console.log(values);
                    }}
                    className="createAccount__form-button"
                  >
                    Dodaj utwór
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ManagingSong;
