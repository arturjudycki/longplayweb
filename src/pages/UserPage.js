import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate, NavLink } from "react-router-dom";
import InfoAccount from "../components/InfoAccount";
import { userAuth, userData } from "../API-utils/endpointsAuthUser";
import {
  getAllRatesAlbumsByUser,
  getAllRatesSongsByUser,
  getStatisticsOfAllRatesByUser,
} from "../API-utils/endpointsManageRates";
import { useQuery } from "react-query";
import { Star, Favorite } from "@material-ui/icons";
import { img_path } from "../API-utils/links";

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  let userIsLogged = false;
  let user_info;
  let content;
  let contentStats;
  let contentLastRates;

  const displayReleaseYear = (releaseDate) => {
    let time = new Date(releaseDate);
    let year = time.getFullYear();

    return year;
  };

  const { status, data } = useQuery("user", userAuth, { retry: 0 });
  const { status: isUser, data: user } = useQuery(
    ["user-data", username],
    () => userData(username),
    { retry: 0 }
  );

  const { status: isStats, data: stats } = useQuery(
    ["user-stats", username],
    () => getStatisticsOfAllRatesByUser(username),
    { retry: 0 }
  );

  const { status: isRatesAlbums, data: ratesAlbums } = useQuery(
    ["rates-albums", username],
    () => getAllRatesAlbumsByUser(username),
    { retry: 0, refetchOnWindowFocus: false }
  );

  const { status: isRatesSongs, data: ratesSongs } = useQuery(
    ["rates-songs", username],
    () => getAllRatesSongsByUser(username),
    { retry: 0, refetchOnWindowFocus: false }
  );

  if (status === "success") {
    if (data.user.username === username) {
      userIsLogged = true;
    }
  }

  if (isUser === "error") {
    navigate("/404");
  }
  if (isUser === "success") {
    user_info = user;
    content = <InfoAccount person={{ userIsLogged, user_info }} />;
  }

  if (isStats === "success") {
    contentStats = (
      <div className="stats">
        <section className="stats__box">
          <h2 className="stats__title">Wszystkie oceny</h2>

          <div className="stats__container">
            <div className="stats__item">
              <h3 className="stats__item-title">Oceny</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.num_rates}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Ulubione</h3>
              <p className="stats__item-value">
                <Favorite className="icon-user-page" />
                {stats.num_fav}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Średnia ocen</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.avg_rates !== null
                  ? parseFloat(stats.avg_rates).toFixed(2)
                  : "BRAK"}
              </p>
            </div>
          </div>
        </section>
        <section className="stats__box">
          <h2 className="stats__title">Albumy</h2>
          <div className="stats__container">
            <div className="stats__item">
              <h3 className="stats__item-title">Oceny</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.num_rates_ma}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Ulubione</h3>
              <p className="stats__item-value">
                <Favorite className="icon-user-page" />
                {stats.num_fav_ma}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Średnia ocen</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.avg_ma !== null
                  ? parseFloat(stats.avg_ma).toFixed(2)
                  : "BRAK"}
              </p>
            </div>
          </div>
        </section>
        <section className="stats__box">
          <h2 className="stats__title">Utwory</h2>

          <div className="stats__container">
            <div className="stats__item">
              <h3 className="stats__item-title">Oceny</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.num_rates_s}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Ulubione</h3>
              <p className="stats__item-value">
                <Favorite className="icon-user-page" />
                {stats.num_fav_s}
              </p>
            </div>
            <div className="stats__item">
              <h3 className="stats__item-title">Średnia ocen</h3>
              <p className="stats__item-value">
                <Star className="icon-user-page" />
                {stats.avg_s !== null
                  ? parseFloat(stats.avg_s).toFixed(2)
                  : "BRAK"}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isRatesAlbums === "success" && isRatesSongs === "success") {
    const resultArray = ratesAlbums.concat(ratesSongs);
    const resultSliceArray = resultArray.slice(0, 8);
    contentLastRates = (
      <div className="last-rates">
        {resultSliceArray.length !== 0 ? (
          resultSliceArray
            .sort((a, b) => new Date(b.rating_date) - new Date(a.rating_date))
            .map((rate) => (
              <NavLink
                to={
                  rate.song === null
                    ? "/music-album/".concat(`${rate.id}`)
                    : "/song/".concat(`${rate.id}`)
                }
                className="link-to-artist"
                key={rate.id_rate}
              >
                <div className="last-rates__box">
                  <div className="last-rates__box-img">
                    <img
                      src={img_path + rate.cover}
                      alt="cover"
                      className="last-rates__img"
                    />
                    <p className="last-rates__value">{rate.numerical_rating}</p>
                  </div>
                  <p className="last-rates__type">
                    {rate.song === null ? "ALBUM" : "UTWÓR"}
                  </p>
                  <p className="last-rates__name">
                    {rate.title +
                      " (" +
                      displayReleaseYear(rate.release_date) +
                      ")"}
                  </p>
                </div>
              </NavLink>
            ))
        ) : (
          <div className="last-rates__nope">
            Nie oceniono jeszcze żadnej pozycji
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {content}
      <section className="managing-music">
        <NavLink
          end
          to={"/user/".concat(`${username}`)}
          className={({ isActive }) =>
            isActive
              ? "heroUser__choose-link heroUser__choose-link--selected"
              : "heroUser__choose-link"
          }
        >
          <p className="heroUser__settings-link">Profil główny</p>
        </NavLink>
        <NavLink
          end
          to={"/user/".concat(`${username}`, "/albums")}
          className={({ isActive }) =>
            isActive
              ? "heroUser__choose-link heroUser__choose-link--selected"
              : "heroUser__choose-link"
          }
        >
          <p className="heroUser__settings-link">Oceny albumów</p>
        </NavLink>
        <NavLink
          end
          to={"/user/".concat(`${username}`, "/songs")}
          className={({ isActive }) =>
            isActive
              ? "heroUser__choose-link heroUser__choose-link--selected"
              : "heroUser__choose-link"
          }
        >
          <p className="heroUser__settings-link">Oceny utworów</p>
        </NavLink>
      </section>

      {contentStats}

      <h2 className="last-rates__title">Ostatnio ocenione pozycje</h2>
      {contentLastRates}
    </>
  );
};

export default UserPage;
