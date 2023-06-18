import React from "react";
import { useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { useNavigate } from "react-router-dom";
import { getTextByIdText } from "../API-utils/endpointsManageTexts";
import { useQuery } from "react-query";

const TextPage = () => {
  const { id_text } = useParams();
  const navigate = useNavigate();

  let content;

  const { status: isText, data: text } = useQuery(
    ["text-data", id_text],
    () => getTextByIdText(id_text),
    { retry: 0 }
  );

  const displayCorrectTypeOfText = (type) => {
    if (type === "article") {
      return "artykuł";
    } else if (type === "interview") {
      return "wywiad";
    } else return type;
  };

  const displayPublicationDate = (publicationDate) => {
    let time = new Date(publicationDate);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  if (isText === "error") {
    navigate("/404");
  }

  if (isText === "loading") {
    content = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isText === "success") {
    content = (
      <>
        <p className="text-item text-item__type-of-text">
          {displayCorrectTypeOfText(text.type_of_text)}
        </p>
        <div className="text-item text-item__info">
          <p>
            Autor:{" "}
            <em>
              {text.first_name} {text.last_name}
            </em>
          </p>
          <p className="">
            Data dodania:{" "}
            <em>{displayPublicationDate(text.publication_date)}</em>
          </p>
        </div>
        <p className="text-item text-item__title-page">{text.title}</p>

        <pre className="text-item text-item__content">{text.content}</pre>
      </>
    );
  }

  return (
    <>
      {content}
      <Comments info={{ id_text }} />
    </>
  );
};

export default TextPage;
