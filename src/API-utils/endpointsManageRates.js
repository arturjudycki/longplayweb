import { base_url } from "./baseUrl";

export const addRateAlbum = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/rate/addRateAlbum"), {
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

export const addRateSong = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/rate/addRateSong"), {
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

export const getRateAlbumByUser = async (music_album) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${music_album}`, "/getRateAlbumByUser")
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export const getRateSongByUser = async (song) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/rate/".concat(`${song}`, "/getRateSongByUser")),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export const getRateSongByUserTracklist = async (song) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${song}`, "/getRateSongByUserTracklist")
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

export const getAllRatesAlbumsByUser = async (username) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${username}`, "/getAllRatesAlbumsByUser")
    ),
    {
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

export const getAllRatesAlbumsByUserQuery = async (username, searchParams) => {
  let sort;
  let fav;
  let page;
  let qmark;
  let ampersand;
  let ampersand2;

  if (searchParams.has("sortBy")) {
    sort = true;
  } else {
    sort = false;
  }
  if (searchParams.has("favourite")) {
    fav = true;
  } else {
    fav = false;
  }

  if (searchParams.has("page")) {
    page = true;
  } else {
    page = false;
  }

  if (sort || fav || page) {
    qmark = "?";
  } else {
    qmark = "";
  }

  if ((sort && fav) || (sort && page) || (fav && page)) {
    ampersand = "&";
  } else {
    ampersand = "";
  }

  if (sort && fav && page) {
    ampersand2 = "&";
  } else {
    ampersand2 = "";
  }

  let sortValue;
  if (sort) {
    sortValue = "sortBy=".concat(`${searchParams.get("sortBy")}`);
  } else {
    sortValue = "";
  }

  let favouriteValue;
  if (fav) {
    favouriteValue = "favourite=".concat(`${searchParams.get("favourite")}`);
  } else {
    favouriteValue = "";
  }

  let pageValue;
  if (page) {
    pageValue = "page=".concat(`${searchParams.get("page")}`);
  } else {
    pageValue = "";
  }

  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(
        `${username}`,
        "/getAllRatesAlbumsByUserQuery",
        `${qmark}`,
        `${sortValue}`,
        `${ampersand}`,
        `${favouriteValue}`,
        `${ampersand2}`,
        `${pageValue}`
      )
    ),
    {
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

export const getAllRatesSongsByUser = async (username) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${username}`, "/getAllRatesSongsByUser")
    ),
    {
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

export const getAllRatesSongsByUserQuery = async (username, searchParams) => {
  let sort;
  let fav;
  let page;
  let qmark;
  let ampersand;
  let ampersand2;

  if (searchParams.has("sortBy")) {
    sort = true;
  } else {
    sort = false;
  }
  if (searchParams.has("favourite")) {
    fav = true;
  } else {
    fav = false;
  }

  if (searchParams.has("page")) {
    page = true;
  } else {
    page = false;
  }

  if (sort || fav || page) {
    qmark = "?";
  } else {
    qmark = "";
  }

  if ((sort && fav) || (sort && page) || (fav && page)) {
    ampersand = "&";
  } else {
    ampersand = "";
  }

  if (sort && fav && page) {
    ampersand2 = "&";
  } else {
    ampersand2 = "";
  }

  let sortValue;
  if (sort) {
    sortValue = "sortBy=".concat(`${searchParams.get("sortBy")}`);
  } else {
    sortValue = "";
  }

  let favouriteValue;
  if (fav) {
    favouriteValue = "favourite=".concat(`${searchParams.get("favourite")}`);
  } else {
    favouriteValue = "";
  }

  let pageValue;
  if (page) {
    pageValue = "page=".concat(`${searchParams.get("page")}`);
  } else {
    pageValue = "";
  }

  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(
        `${username}`,
        "/getAllRatesSongsByUserQuery",
        `${qmark}`,
        `${sortValue}`,
        `${ampersand}`,
        `${favouriteValue}`,
        `${ampersand2}`,
        `${pageValue}`
      )
    ),
    {
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

export const getStatisticsOfAlbum = async (music_album) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${music_album}`, "/getStatisticsOfAlbum")
    ),
    {
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

export const getStatisticsOfSong = async (song) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${song}`, "/getStatisticsOfSong")
    ),
    {
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

export const editRate = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/rate/editRate"), {
    method: "PATCH",
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

export const deleteRate = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/rate/deleteRate"), {
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

export const getStatisticsOfAllRatesByUser = async (username) => {
  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/rate/".concat(`${username}`, "/getStatisticsOfAllRatesByUser")
    ),
    {
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
