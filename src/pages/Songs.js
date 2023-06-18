import { Star } from "@material-ui/icons";
import React from "react";
import { useQuery } from "react-query";
import { userAuth } from "../API-utils/endpointsAuthUser";
import { NavLink } from "react-router-dom";
import {
  getCountOfSongs,
  getTop100ListOfSongs,
} from "../API-utils/endpointsManageSongs";
import { getRateSongByUser } from "../API-utils/endpointsManageRates";
import { img_path } from "../API-utils/links";

const Rated = ({ props }) => {
  const song_id = props.song.id_song;
  const { status, data: rated_value } = useQuery(
    ["rated-song_value", song_id],
    () => getRateSongByUser(song_id),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  let contentRateValue;

  if (status === "success") {
    contentRateValue = (
      <div className="rated-value__content">{rated_value.numerical_rating}</div>
    );
  } else {
    contentRateValue = (
      <div className="rated-value__content">
        <Star />
      </div>
    );
  }

  return (
    <div className="rated-value rated-value--topRight">{contentRateValue}</div>
  );
};

const Songs = () => {
  let numberOfSongs;
  let top100Songs;

  const { status: isLogged, data } = useQuery("user", userAuth, { retry: 0 });

  const displayReleaseYear = (releaseDate) => {
    let time = new Date(releaseDate);
    let year = time.getFullYear();

    return year;
  };

  const { status: isNumberSongs, data: songs_amount } = useQuery(
    "songs_amount",
    getCountOfSongs,
    { retry: 0 }
  );

  if (isNumberSongs === "success") {
    numberOfSongs = (
      <div className="db-amount">
        {" "}
        Liczba utworów w bazie:
        <p className="db-amount__value">{songs_amount.amount}</p>
      </div>
    );
  }

  const { status: isTop100, data: songs_top } = useQuery(
    "songs_top",
    getTop100ListOfSongs,
    { retry: 0 }
  );

  if (isTop100 === "success") {
    let number = 0;
    top100Songs = songs_top.map((song) => (
      <div key={song.id_song} className="top__box">
        <div className="top__number">{++number}</div>
        <div className="top__cover">
          <NavLink
            to={"/song/".concat(`${song.id_song}`)}
            className="link-to-artist"
          >
            <img src={img_path + song.cover} alt="cover" className="top__img" />
            {isLogged === "success" ? <Rated props={{ song }} /> : ""}
          </NavLink>
        </div>
        <div className="top__info">
          <NavLink
            to={"/song/".concat(`${song.id_song}`)}
            className="link-to-artist"
          >
            <p className="top__item-title">{song.title}</p>
          </NavLink>
          <NavLink
            to={"/music-album/".concat(`${song.id_music_album}`)}
            className="link-to-artist"
          >
            <p className="top__item-ma-title">{song.ma_title}</p>
          </NavLink>
          <p className="top__item-year">
            {displayReleaseYear(song.release_date)}
          </p>
        </div>
        <div className="top__rates">
          <p className="top__rates-mean">
            <Star className="top-icon" /> {parseFloat(song.mean).toFixed(2)}
          </p>
          <p className="top__rates-counts">Liczba ocen</p>
          <p>{song.counts}</p>
        </div>
      </div>
    ));
  }

  return (
    <div>
      {numberOfSongs}
      <div className="title-ranking">Ranking top 100 - utwory</div>
      <div className="top">{top100Songs}</div>
    </div>
  );
};

export default Songs;
