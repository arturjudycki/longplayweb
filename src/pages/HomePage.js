import React from "react";
import { getNewestTexts } from "../API-utils/endpointsManageTexts";
import { getLastAlbums } from "../API-utils/endpointsManageMusic";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import articleImg from "../images/article.jpg";
import newsImg from "../images/news.png";
import rankingImg from "../images/ranking.jpg";
import interviewImg from "../images/interview.jpg";
import { img_path } from "../API-utils/links";

const HomePage = () => {
  let contentTexts;
  let contentAlbums;

  const displayReleaseYear = (releaseDate) => {
    let time = new Date(releaseDate);
    let year = time.getFullYear();

    return year;
  };

  const { status: isTexts, data: texts } = useQuery("texts", getNewestTexts, {
    retry: 0,
  });

  const { status: isAlbums, data: albums } = useQuery(
    "last-albums",
    getLastAlbums,
    {
      retry: 0,
    }
  );

  const displayTypeOfAlbum = (typeOfAlbum) => {
    if (typeOfAlbum === "studio_album") return "album studyjny";
    else if (typeOfAlbum === "live_album") return "album koncertowy";
    else if (typeOfAlbum === "compilation_album") return "album kompilacyjny";
    else if (typeOfAlbum === "EP") return "EP";
    else if (typeOfAlbum === "OST") return "OST";
  };

  const displayCorrectImage = (type) => {
    if (type === "article") {
      return articleImg;
    } else if (type === "news") {
      return newsImg;
    } else if (type === "ranking") {
      return rankingImg;
    } else {
      return interviewImg;
    }
  };

  const displayCorrectTypeOfText = (type) => {
    if (type === "article") {
      return "artykuł";
    } else if (type === "interview") {
      return "wywiad";
    } else return type;
  };

  if (isTexts === "loading") {
    contentTexts = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isTexts === "success") {
    contentTexts = texts
      .sort((a, b) => b.id_text - a.id_text)
      .map((text) => (
        <div className="textBox" key={text.id_text}>
          <NavLink
            to={{
              pathname: "/text/".concat(`${text.id_text}`),
            }}
            className="link-to-text"
          >
            <div className="textBox__item-imgBox">
              <div className="textBox__item-imgContainer">
                <img
                  src={displayCorrectImage(text.type_of_text)}
                  alt="text"
                  className="textBox__item-img"
                />
              </div>
              <p className="textBox__item-type-of-text">
                {displayCorrectTypeOfText(text.type_of_text)}
              </p>
            </div>

            <p className="textBox__item-title">{text.title}</p>
          </NavLink>
        </div>
      ));
  }

  if (isTexts === "loading") {
    contentAlbums = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isAlbums === "success") {
    contentAlbums = albums.map((album) => (
      <NavLink
        to={"/music-album/".concat(`${album.id_music_album}`)}
        className="link-to-artist"
        key={album.id_music_album}
      >
        <div className="last-rates__box">
          <div className="last-rates__box-img">
            <img
              src={img_path + album.cover}
              alt="cover"
              className="last-rates__img"
            />
          </div>
          <p className="last-rates__type">
            {displayTypeOfAlbum(album.type_of_album)}
          </p>
          <p className="last-rates__name">
            {album.title + " (" + displayReleaseYear(album.release_date) + ")"}
          </p>
        </div>
      </NavLink>
    ));
  }

  return (
    <div>
      <h1 className="textSlogan">Najnowsze teksty</h1>
      <section className="newest_texts">{contentTexts}</section>
      <div className="more-content">
        <NavLink to="/texts" className="">
          <button type="button" className="more-content__button">
            Zobacz więcej
          </button>
        </NavLink>
      </div>

      <hr />
      <h1 className="textSlogan">Ostatnio dodane pozycje do bazy albumów</h1>
      <section className="newest_texts">{contentAlbums}</section>
    </div>
  );
};

export default HomePage;
