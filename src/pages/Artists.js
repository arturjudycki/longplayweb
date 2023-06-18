import React, { useState } from "react";
import {
  getAllArtistsOrderBy,
  getCountOfArtists,
} from "../API-utils/endpointsManageArtists";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";

const Artists = () => {
  let contentArtists;
  let numberOfArtists;
  const [firstLetter, setFirstLetter] = useState("");
  const [artistSearch, setArtistsSearch] = useState([]);

  const { status: isAllArtists, data: AllArtists } = useQuery(
    "artists_asc",
    getAllArtistsOrderBy,
    { retry: 0 }
  );

  const { status: isNumberArtists, data: artists_amount } = useQuery(
    "artists_amount",
    getCountOfArtists,
    { retry: 0 }
  );

  if (isNumberArtists === "success") {
    numberOfArtists = (
      <div className="db-amount">
        {" "}
        Liczba wykonawców w bazie:
        <p className="db-amount__value">{artists_amount.amount}</p>
      </div>
    );
  }

  const handleSearchChange = (arg) => {
    if (isAllArtists === "success") {
      const resultsArray = AllArtists.filter((artist) =>
        artist.name[0].toLowerCase().includes(arg)
      );
      setFirstLetter(arg);
      setArtistsSearch(resultsArray);
    }
  };

  if (isAllArtists === "loading") {
    contentArtists = (
      <div className="spinner__box">
        <div className="spinner__load"></div>
      </div>
    );
  }

  if (isAllArtists === "success" && firstLetter === "") {
    contentArtists = AllArtists.map((artist) => (
      <div key={artist.id_artist}>
        <NavLink
          to={{
            pathname: "/artist/".concat(`${artist.id_artist}`),
          }}
          className="link-to-artist"
        >
          <p className="list-artists__name">{artist.name}</p>
        </NavLink>
      </div>
    ));
  }

  if (isAllArtists === "success" && firstLetter !== "") {
    if (artistSearch.length === 0) {
      contentArtists = (
        <div className="list-artists__nope">
          Brak w bazie wykonawców zaczynających się na tę literę
        </div>
      );
    } else {
      contentArtists = artistSearch.map((artist) => (
        <div key={artist.id_artist}>
          <NavLink
            to={{
              pathname: "/artist/".concat(`${artist.id_artist}`),
            }}
            className="link-to-artist"
          >
            <p className="list-artists__name">{artist.name}</p>
          </NavLink>
        </div>
      ));
    }
  }

  return (
    <div className="list-artists">
      {numberOfArtists}
      <div className="list-artists__title">Lista wykonawców</div>
      <div className="list-artists__line"></div>
      <div className="list-artists__choose-letter">
        <span
          onClick={() => {
            setFirstLetter("");
          }}
          style={
            firstLetter === "" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          wszyscy wykonawcy
        </span>
        <span
          onClick={() => {
            handleSearchChange("a");
          }}
          style={
            firstLetter === "a" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          A
        </span>
        <span
          onClick={() => {
            handleSearchChange("b");
          }}
          style={
            firstLetter === "b" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          B
        </span>
        <span
          onClick={() => {
            handleSearchChange("c");
          }}
          style={
            firstLetter === "c" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          C
        </span>
        <span
          onClick={() => {
            handleSearchChange("d");
          }}
          style={
            firstLetter === "d" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          D
        </span>
        <span
          onClick={() => {
            handleSearchChange("e");
          }}
          style={
            firstLetter === "e" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          E
        </span>
        <span
          onClick={() => {
            handleSearchChange("f");
          }}
          style={
            firstLetter === "f" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          F
        </span>
        <span
          onClick={() => {
            handleSearchChange("g");
          }}
          style={
            firstLetter === "g" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          G
        </span>
        <span
          onClick={() => {
            handleSearchChange("h");
          }}
          style={
            firstLetter === "h" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          H
        </span>
        <span
          onClick={() => {
            handleSearchChange("i");
          }}
          style={
            firstLetter === "i" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          I
        </span>
        <span
          onClick={() => {
            handleSearchChange("j");
          }}
          style={
            firstLetter === "j" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          J
        </span>
        <span
          onClick={() => {
            handleSearchChange("k");
          }}
          style={
            firstLetter === "k" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          K
        </span>
        <span
          onClick={() => {
            handleSearchChange("l");
          }}
          style={
            firstLetter === "l" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          L
        </span>
        <span
          onClick={() => {
            handleSearchChange("m");
          }}
          style={
            firstLetter === "m" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          M
        </span>
        <span
          onClick={() => {
            handleSearchChange("n");
          }}
          style={
            firstLetter === "n" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          N
        </span>
        <span
          onClick={() => {
            handleSearchChange("o");
          }}
          style={
            firstLetter === "o" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          O
        </span>
        <span
          onClick={() => {
            handleSearchChange("p");
          }}
          style={
            firstLetter === "p" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          P
        </span>
        <span
          onClick={() => {
            handleSearchChange("q");
          }}
          style={
            firstLetter === "q" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          Q
        </span>
        <span
          onClick={() => {
            handleSearchChange("r");
          }}
          style={
            firstLetter === "r" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          R
        </span>
        <span
          onClick={() => {
            handleSearchChange("s");
          }}
          style={
            firstLetter === "s" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          S
        </span>
        <span
          onClick={() => {
            handleSearchChange("t");
          }}
          style={
            firstLetter === "t" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          T
        </span>
        <span
          onClick={() => {
            handleSearchChange("u");
          }}
          style={
            firstLetter === "u" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          U
        </span>
        <span
          onClick={() => {
            handleSearchChange("v");
          }}
          style={
            firstLetter === "v" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          V
        </span>
        <span
          onClick={() => {
            handleSearchChange("w");
          }}
          style={
            firstLetter === "w" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          W
        </span>
        <span
          onClick={() => {
            handleSearchChange("x");
          }}
          style={
            firstLetter === "x" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          X
        </span>
        <span
          onClick={() => {
            handleSearchChange("y");
          }}
          style={
            firstLetter === "y" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          Y
        </span>
        <span
          onClick={() => {
            handleSearchChange("z");
          }}
          style={
            firstLetter === "z" ? { fontWeight: "600" } : { fontWeight: "400" }
          }
        >
          Z
        </span>
      </div>
      <div className="list-artists__line"></div>
      <div className="list-artists__box">{contentArtists}</div>
    </div>
  );
};

export default Artists;
