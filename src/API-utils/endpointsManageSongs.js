import { base_url } from "./baseUrl";

export const addSong = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/song/addSong"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values, null, 2),
  });

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  }
};

export const getSongsOfAlbum = async (id_music_album) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/song/".concat(`${id_music_album}`, "/getSongsOfAlbum")
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  } else {
    return response.json();
  }
};

export const getSong = async (id_song) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/song/".concat(`${id_song}`, "/getSong")),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  } else {
    return response.json();
  }
};

export const getAllSongs = async () => {
  const response = await fetch("".concat(`${base_url}`, "/song/getAllSongs"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  } else {
    return response.json();
  }
};

export const getCountOfSongs = async () => {
  const response = await fetch(
    "".concat(`${base_url}`, "/song/getCountOfSongs"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  } else {
    return response.json();
  }
};

export const getTop100ListOfSongs = async () => {
  const response = await fetch(
    "".concat(`${base_url}`, "/song/getTop100ListOfSongs"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  } else {
    return response.json();
  }
};

export const editSong = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/song/editSong"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values, null, 2),
  });

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  }
};

export const deleteSong = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/song/deleteSong"), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values, null, 2),
  });

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  }
};
