import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { img_path } from "../API-utils/links";
import StatisticsSong from "../components/StatisticsSong";
import RateSong from "../components/RateSong";
import { getSong } from "../API-utils/endpointsManageSongs";
import { useQuery } from "react-query";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { id_song } = useParams();

  let contentSong;

  const { status: isSong, data: song } = useQuery(
    ["song-data", id_song],
    () => getSong(id_song),
    { retry: 0 }
  );

  if (isSong === "error") {
    navigate("/404");
  }

  if (isSong === "loading") {
    contentSong = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isSong === "success") {
    contentSong = (
      <div className="song-page" key={song.id_song}>
        <div className="song-page__cover-statistics">
          <img
            src={img_path + song.cover}
            alt="cover"
            className="song-page__cover"
          />
          <div className="album-page__statistics">
            <StatisticsSong />
          </div>
        </div>
        <div className="song-page__box">
          <div className="song-page__item-title">{song.title}</div>
          <div className="song-page__container">
            <div>
              <NavLink
                to={{
                  pathname: "/music-album/".concat(`${song.music_album}`),
                }}
                className="song-page__link"
              >
                <p className="song-page__item-album">{song.album_title}</p>
              </NavLink>
              <NavLink
                to={{
                  pathname: "/artist/".concat(`${song.artist}`),
                }}
                className="song-page__link"
              >
                <p className="song-page__item-artist">{song.name}</p>
              </NavLink>
              <div className="song-page__box-info">
                <div className="song-page__box-info-item">
                  <p className="song-page__box-info-item-title">
                    Numer utworu na płycie
                  </p>
                  <p>{song.track_number}</p>
                </div>
                <div className="song-page__box-info-item">
                  <p className="song-page__box-info-item-title">
                    Czas trwania utworu
                  </p>
                  <p>{song.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RateSong />
      </div>
    );
  }

  return <section className="song-page">{contentSong}</section>;
};

export default ErrorPage;
