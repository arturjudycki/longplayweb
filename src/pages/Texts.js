import React from "react";
import { getTexts } from "../API-utils/endpointsManageTexts";
import { useQuery } from "react-query";
import { NavLink, useSearchParams } from "react-router-dom";
import articleImg from "../images/article.jpg";
import newsImg from "../images/news.png";
import rankingImg from "../images/ranking.jpg";
import interviewImg from "../images/interview.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ props }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  let page_boxes = props.lengthTable / 9;
  page_boxes = Math.ceil(page_boxes);
  let array = [];
  for (let i = 1; i <= page_boxes; i++) {
    array.push(i);
  }

  const {
    status: isTexts,
    data: texts,
    refetch,
  } = useQuery(["all-texts", searchParams], () => getTexts(searchParams), {
    retry: 0,
  });

  const handleSearchParamsPagination = (arg) => {
    if (arg === 1) {
      searchParams.delete("page");
      setSearchParams(searchParams, { replace: true });
      refetch();
    } else {
      searchParams.set("page", arg);
      setSearchParams(searchParams, { replace: true });
      refetch();
    }
  };

  const pages = (
    <>
      <div
        className={
          !searchParams.has("page")
            ? "pagination__arrow pagination__arrow-none"
            : "pagination__arrow"
        }
        onClick={() => {
          let decrement = searchParams.get("page");
          decrement = parseInt(decrement);
          decrement -= 1;
          handleSearchParamsPagination(decrement);
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>

      {array.map((item, index) => {
        const value_index = index + 1;

        return (
          <div
            className={
              searchParams.get("page") === "" + value_index + "" ||
              (!searchParams.has("page") && value_index === 1)
                ? "pagination__item pagination__item-selected"
                : "pagination__item"
            }
            key={value_index}
            onClick={() => {
              handleSearchParamsPagination(value_index);
            }}
          >
            {value_index}
          </div>
        );
      })}

      <div
        className={
          (isTexts === "success" && texts.length[0].counts === 0) ||
          searchParams.get("page") === "" + page_boxes + "" ||
          parseInt(searchParams.get("page")) >= page_boxes ||
          (!searchParams.get("page") && 1 === page_boxes)
            ? "pagination__arrow pagination__arrow-none"
            : "pagination__arrow"
        }
        onClick={() => {
          let decrement;
          if (!searchParams.has("page")) {
            decrement = 2;
          } else {
            decrement = searchParams.get("page");
            decrement = parseInt(decrement);
            decrement += 1;
          }
          handleSearchParamsPagination(decrement);
        }}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </>
  );
  return <div className="pagination">{pages}</div>;
};

const Texts = () => {
  let contentTexts;
  const [searchParams, setSearchParams] = useSearchParams();

  const displayCorrectTypeOfText = (type) => {
    if (type === "article") {
      return "artykuł";
    } else if (type === "interview") {
      return "wywiad";
    } else return type;
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

  const handleSearchParams = (arg) => {
    if (arg === "article") {
      searchParams.set("typeOfText", "article");
      setSearchParams(searchParams, { replace: true });
      refetch();
    } else if (arg === "news") {
      searchParams.set("typeOfText", "news");
      setSearchParams(searchParams, { replace: true });
      refetch();
    } else if (arg === "ranking") {
      searchParams.set("typeOfText", "ranking");
      setSearchParams(searchParams, { replace: true });
      refetch();
    } else if (arg === "interview") {
      searchParams.set("typeOfText", "interview");
      setSearchParams(searchParams, { replace: true });
      refetch();
    } else {
      searchParams.delete("typeOfText");
      setSearchParams(searchParams, { replace: true });
      refetch();
    }
  };

  const {
    status: isTexts,
    data: texts,
    refetch,
  } = useQuery(["all-texts", searchParams], () => getTexts(searchParams), {
    retry: 0,
  });

  let lengthTable;

  if (isTexts === "success") {
    let textsTable = texts.texts;
    lengthTable = texts.length[0].counts;

    contentTexts = (
      <>
        {textsTable.length !== 0 ? (
          textsTable.map((text) => (
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
          ))
        ) : (
          <p className="nope-rates">brak tekstów</p>
        )}
      </>
    );
  }

  return (
    <div>
      <nav className="submenu-texts">
        <div
          onClick={() => {
            handleSearchParams("all");
          }}
          className={
            !searchParams.has("typeOfText")
              ? "submenu-texts__item submenu-texts__item-selected"
              : "submenu-texts__item"
          }
        >
          <p>wszystkie</p>
        </div>
        <div
          onClick={() => {
            handleSearchParams("article");
          }}
          className={
            searchParams.get("typeOfText") === "article"
              ? "submenu-texts__item submenu-texts__item-selected"
              : "submenu-texts__item"
          }
        >
          <p>artykuły</p>
        </div>
        <div
          onClick={() => {
            handleSearchParams("news");
          }}
          className={
            searchParams.get("typeOfText") === "news"
              ? "submenu-texts__item submenu-texts__item-selected"
              : "submenu-texts__item"
          }
        >
          <p>newsy</p>
        </div>
        <div
          onClick={() => {
            handleSearchParams("ranking");
          }}
          className={
            searchParams.get("typeOfText") === "ranking"
              ? "submenu-texts__item submenu-texts__item-selected"
              : "submenu-texts__item"
          }
        >
          <p>rankingi</p>
        </div>
        <div
          onClick={() => {
            handleSearchParams("interview");
          }}
          className={
            searchParams.get("typeOfText") === "interview"
              ? "submenu-texts__item submenu-texts__item-selected"
              : "submenu-texts__item"
          }
        >
          <p>wywiady</p>
        </div>
      </nav>
      <div className="textContainer">{contentTexts}</div>
      {lengthTable !== undefined ? <Pagination props={{ lengthTable }} /> : ""}
    </div>
  );
};

export default Texts;
