import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import img from "../images/lpw-logo.png";
import Logged from "../components/Logged";
import { useQuery } from "react-query";
import { img_path } from "../API-utils/links";
import { getAllArtists } from "../API-utils/endpointsManageArtists";
import { getAllAlbums } from "../API-utils/endpointsManageMusic";
import { getAllSongs } from "../API-utils/endpointsManageSongs";

const Navigation = () => {
  const [artistsSearch, setArtistsSearch] = useState([]);
  const [albumsSearch, setAlbumsSearch] = useState([]);
  const [songsSearch, setSongsSearch] = useState([]);

  const { status: isAllArtists, data: AllArtists } = useQuery(
    "artists",
    getAllArtists,
    { retry: 0 }
  );

  const { status: isAllAlbums, data: AllAlbums } = useQuery(
    "albums",
    getAllAlbums,
    { retry: 0 }
  );

  const { status: isAllSongs, data: AllSongs } = useQuery(
    "songs",
    getAllSongs,
    { retry: 0 }
  );

  const handleSubmitSearch = (e) => e.preventDefault();

  const handleSearchChange = (e) => {
    if (isAllAlbums === "success") {
      const resultsArrayAlbums = AllAlbums.filter(
        (album) =>
          e.target.value !== "" &&
          album.title
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setAlbumsSearch(resultsArrayAlbums);
    }

    if (isAllSongs === "success") {
      const resultsArraySongs = AllSongs.filter(
        (song) =>
          e.target.value !== "" &&
          song.title
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setSongsSearch(resultsArraySongs);
    }

    if (isAllArtists === "success") {
      const resultsArrayArtists = AllArtists.filter(
        (artist) =>
          e.target.value !== "" &&
          artist.name
            .toLowerCase()
            .trim()
            .includes(e.target.value.toLowerCase().trim())
      );
      setArtistsSearch(resultsArrayArtists);
    }
  };

  const resultsOfSearching = () => {
    if (
      albumsSearch.length !== 0 ||
      songsSearch.length !== 0 ||
      artistsSearch.length !== 0
    ) {
      return (
        <section className="navigation-search__results">
          <div className="navigation-search__results-box">
            {albumsSearch.length !== 0 ? (
              <h2 className="navigation-search__results-box-title">Albumy</h2>
            ) : (
              ""
            )}
            {albumsSearch.map((album) => (
              <div
                key={album.id_music_album}
                className="navigation-search__results-box-item"
              >
                <NavLink
                  to={{
                    pathname: "/music-album/".concat(`${album.id_music_album}`),
                  }}
                  className="navigation-search__results-box-link"
                >
                  <img
                    src={img_path + album.cover}
                    alt="cover"
                    className="navigation-search__results-box-img"
                  />
                  <p>{album.title}</p>
                </NavLink>
              </div>
            ))}
          </div>
          <div className="navigation-search__results-box">
            {songsSearch.length !== 0 ? (
              <h2 className="navigation-search__results-box-title">Utwory</h2>
            ) : (
              ""
            )}
            {songsSearch.map((song) => (
              <div
                key={song.id_song}
                className="navigation-search__results-box-item"
              >
                <NavLink
                  to={{
                    pathname: "/song/".concat(`${song.id_song}`),
                  }}
                  className="navigation-search__results-box-link"
                >
                  <img
                    src={img_path + song.cover}
                    alt="cover"
                    className="navigation-search__results-box-img"
                  />
                  <div className="navigation-search__results-box-container">
                    <p>{song.title}</p>
                    <p className="navigation-search__results-box-artist-of-song">
                      {song.name}
                    </p>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
          <div className="navigation-search__results-box">
            {artistsSearch.length !== 0 ? (
              <h2 className="navigation-search__results-box-title">
                Wykonawcy
              </h2>
            ) : (
              ""
            )}
            {artistsSearch.map((artist) => (
              <div
                key={artist.id_artist}
                className="navigation-search__results-box-item"
              >
                <NavLink
                  to={{
                    pathname: "/artist/".concat(`${artist.id_artist}`),
                  }}
                  className="navigation-search__results-box-link"
                >
                  <p>{artist.name}</p>
                </NavLink>
              </div>
            ))}
          </div>
        </section>
      );
    }
  };

  return (
    <header className="header">
      <div className="header__wrapper">
        <div className="header__container">
          <div className="header__box">
            <NavLink to="/" exact="true" className="header__logo">
              <img src={img} alt="logo" />
            </NavLink>
            <form className="header__form" onSubmit={handleSubmitSearch}>
              <div className="header__form-box">
                <input
                  className="header__search-input"
                  placeholder="Szukaj albumów muzycznych, utworów, wykonawców"
                  type="text"
                  onChange={handleSearchChange}
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="icon-search"
                />
                {resultsOfSearching()}
              </div>
            </form>
          </div>
          <Logged />
        </div>
        <nav className="header__menu">
          <section className="subpage-choose">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "subpage-choose__type texts_selected"
                  : "subpage-choose__type"
              }
              to="/texts"
            >
              teksty
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "subpage-choose__type albums_selected"
                  : "subpage-choose__type"
              }
              to="/music-albums"
            >
              albumy
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "subpage-choose__type songs_selected"
                  : "subpage-choose__type"
              }
              to="/songs"
            >
              utwory
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "subpage-choose__type artists_selected"
                  : "subpage-choose__type"
              }
              to="/artists"
            >
              wykonawcy
            </NavLink>
          </section>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
