import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getArtistsByAlbumId,
  assignArtistToAlbum,
  deleteAssignArtist,
} from "../API-utils/endpointsManageMusic";
import { getAllArtists } from "../API-utils/endpointsManageArtists";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCirclePlus,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const DeleteAssign = ({ artistInfo, id_album }) => {
  const id_music_album = id_album;
  const id_artist = artistInfo.artist.id_artist;
  const queryClient = useQueryClient();
  const values = { id_music_album: id_music_album, id_artist: id_artist };

  const { mutate: delete_assign } = useMutation(deleteAssignArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries("artists");
    },
  });

  return (
    <>
      <div
        className="searched-artist__edit searched-artist__edit--top"
        onClick={() => {
          console.log(id_music_album);
          console.log(id_artist);
          delete_assign(values);
        }}
      >
        <p className="">Usuń</p>
        <FontAwesomeIcon icon={faTrash} className="delAssignIcon" />
      </div>
    </>
  );
};

const AddAssign = ({ artistInfo, id_album }) => {
  const id_music_album = id_album;
  const id_artist = artistInfo.artist.id_artist;
  const queryClient = useQueryClient();
  const values = { id_music_album: id_music_album, id_artist: id_artist };

  const { mutate: add_assign } = useMutation(assignArtistToAlbum, {
    onSuccess: () => {
      queryClient.invalidateQueries("artists");
    },
  });

  return (
    <>
      <div
        className="searched-artist__edit searched-artist__edit--top searched-artist__edit--alignCenter"
        onClick={() => {
          console.log(id_music_album);
          console.log(id_artist);
          add_assign(values);
        }}
      >
        <p className="">Przypisz wykonawcę</p>
        <FontAwesomeIcon icon={faCirclePlus} />
      </div>
    </>
  );
};

const AssignArtist = ({ props }) => {
  const id_music_album = props.album.id_music_album;

  const [assignModal, setAssignModal] = useState(false);
  const [artistsSearch, setArtistsSearch] = useState([]);

  let contentArtist;

  const toggleAssignModal = () => {
    setAssignModal(!assignModal);
  };

  const { status: isAllArtists, data: AllArtists } = useQuery(
    "artists",
    getAllArtists,
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
    if (artists.length === 0) {
      contentArtist = <p>Brak przypisanych wykonawców</p>;
    } else {
      contentArtist = artists.map((artist) => (
        <div key={artist.id_artist} className="assigned-artist">
          <NavLink
            to={{
              pathname: "/artist/".concat(`${artist.id_artist}`),
            }}
            className="link-to-artist"
          >
            <p className="album-page__artist-item">{artist.name}</p>
          </NavLink>
          <DeleteAssign artistInfo={{ artist }} id_album={id_music_album} />
        </div>
      ));
    }
  }

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
        <form className="search-artist" onSubmit={handleSubmitSearch}>
          <div className="search-artist__box">
            <input
              type="text"
              placeholder="Wyszukaj wykonawcę, aby go przypisać"
              className="search-artist__input search-artist__input--width"
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="icon-artists"
            />
          </div>
        </form>

        <section className="searched-artist">
          {artistsSearch.map((artist) => (
            <div
              className="searched-artist__box searched-artist__box--width"
              key={artist.id_artist}
            >
              <NavLink
                to={{
                  pathname: "/artist/".concat(`${artist.id_artist}`),
                }}
                className="link-to-artist"
              >
                <div className="searched-artist__name">{artist.name}</div>
              </NavLink>
              <AddAssign artistInfo={{ artist }} id_album={id_music_album} />
            </div>
          ))}
        </section>
      </>
    );
  };

  return (
    <>
      <div className="assign-link" onClick={toggleAssignModal}>
        <p className="assign-link__text">Przypisz wykonawcę</p>
        <FontAwesomeIcon icon={faUserPlus} />
      </div>
      {assignModal ? (
        <section className="assign-artist">
          <div className="modal modal--zIndex">
            <div
              onClick={() => {
                toggleAssignModal();
              }}
              className="overlay"
            ></div>
            <div className="modal-content modal-content--assign">
              <p className="assign-artist__title">Przypisani wykonawcy</p>
              {contentArtist}
              {searchingArtist()}
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  );
};

export default AssignArtist;
