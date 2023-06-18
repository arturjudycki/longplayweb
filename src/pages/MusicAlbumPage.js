import React from "react";
import { useParams } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getAlbumById,
  getArtistsByAlbumId,
} from "../API-utils/endpointsManageMusic";
import { getSongsOfAlbum } from "../API-utils/endpointsManageSongs";
import { getRateSongByUserTracklist } from "../API-utils/endpointsManageRates";
import RateAlbum from "../components/RateAlbum";
import StatisticsAlbum from "../components/StatisticsAlbum";
import { Star } from "@material-ui/icons";
import { img_path } from "../API-utils/links";
import { useQuery } from "react-query";

const RateSongByUser = (props) => {
  const id_song = props.props;
  let contentRateSong;

  const { status: isSong, data: song } = useQuery(
    ["song-info-data", id_song],
    () => getRateSongByUserTracklist(id_song),
    { retry: 0, refetchOnWindowFocus: false }
  );

  if (isSong === "loading") {
    contentRateSong = "";
  }

  if (isSong === "success") {
    if (song === null) {
      contentRateSong = (
        <NavLink
          to={{
            pathname: "/song/".concat(`${id_song}`),
          }}
          className="tracklist__song-item tracklist__song-item--rate tracklist__song-item--no-rate"
        >
          <p>
            <Star className="tracklist__star" /> Oceń
          </p>
        </NavLink>
      );
    } else {
      contentRateSong = (
        <p className="tracklist__song-item tracklist__song-item--rate">
          <Star className="tracklist__star" /> {song.numerical_rating}
        </p>
      );
    }
  }

  return contentRateSong;
};

const MusicAlbumPage = () => {
  const { id_music_album } = useParams();
  const navigate = useNavigate();

  let content;

  let contentArtist;

  let contentSongs;

  const { status: isSongs, data: songs } = useQuery(
    ["songs-data", id_music_album],
    () => getSongsOfAlbum(id_music_album),
    { retry: 0 }
  );

  if (isSongs === "success") {
    contentSongs = songs
      .sort((a, b) => a.track_number - b.track_number)
      .map((song) => (
        <div className="tracklist__song-box" key={song.id_song}>
          <p className="tracklist__song-item tracklist__song-item--track-number">
            {song.track_number}
          </p>
          <p className="tracklist__song-item tracklist__song-item--title">
            <NavLink
              to={{
                pathname: "/song/".concat(`${song.id_song}`),
              }}
              className="tracklist__link"
            >
              {song.title}
            </NavLink>
          </p>

          <p className="tracklist__song-item tracklist__song-item--duration">
            {song.duration}
          </p>
          <RateSongByUser props={song.id_song} />
        </div>
      ));
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

  const displayTypeOfAlbum = (typeOfAlbum) => {
    if (typeOfAlbum === "studio_album") return "album studyjny";
    else if (typeOfAlbum === "live_album") return "album koncertowy";
    else if (typeOfAlbum === "compilation_album") return "album kompilacyjny";
    else if (typeOfAlbum === "EP") return "EP";
    else if (typeOfAlbum === "OST") return "OST";
  };

  const { status: isMusicAlbum, data: music_album } = useQuery(
    ["music-album-data", id_music_album],
    () => getAlbumById(id_music_album),
    { retry: 0 }
  );

  const { status: isArtists, data: artists } = useQuery(
    ["artists", id_music_album],
    () => getArtistsByAlbumId(id_music_album),
    { retry: 0 }
  );

  if (isArtists === "error") {
    contentArtist = "";
  }

  if (isArtists === "loading") {
    contentArtist = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isArtists === "success") {
    contentArtist = artists.map((artist) => (
      <div key={artist.id_artist}>
        <NavLink
          to={{
            pathname: "/artist/".concat(`${artist.id_artist}`),
          }}
          className="link-to-artist"
        >
          <p className="album-page__artist-item">{artist.name}</p>
        </NavLink>
      </div>
    ));
  }

  if (isMusicAlbum === "error") {
    navigate("/404");
  }

  if (isMusicAlbum === "loading") {
    content = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isMusicAlbum === "success") {
    content = (
      <>
        <main className="album-page">
          <section className="album-page__box">
            <div className="album-page__cover-statistics">
              <img
                src={img_path + music_album.cover}
                alt="cover-of-album"
                className="album-page__cover"
              />

              <div className="album-page__statistics">
                <StatisticsAlbum />
              </div>
            </div>

            <div className="album-page__box-info">
              <p className="album-page__type-album">
                {displayTypeOfAlbum(music_album.type_of_album)}
              </p>
              <p className="album-page__title">{music_album.title}</p>
              <p className="album-page__release-date">
                {displayPublicationDate(music_album.release_date)}
              </p>
              <div className="album-page__artist">{contentArtist}</div>
            </div>

            <RateAlbum />
          </section>
          <hr className="album-page__line" />

          <section className="album-page__box">
            <div className="album-page__box-details">
              <div className="album-page__box-details-item">
                <p className="album-page__box-details-item-text">
                  Czas trwania albumu
                </p>
                <p>{music_album.duration}</p>
              </div>
              <div className="album-page__box-details-item">
                <p className="album-page__box-details-item-text">Gatunki</p>
                <p>{music_album.genre}</p>
              </div>
              <div className="album-page__box-details-item">
                <p className="album-page__box-details-item-text">Wytwórnia</p>
                <p>{music_album.record_label}</p>
              </div>
            </div>
            <div className="tracklist">
              <h2 className="tracklist__title">Lista utworów</h2>
              <div className="tracklist__container">{contentSongs}</div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return <>{content}</>;
};

export default MusicAlbumPage;
