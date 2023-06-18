import { base_url } from "./baseUrl";

export const createText = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/text/createText"), {
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

export const updateText = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/text/updateText"), {
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

export const getTextsByIdUserSearch = async () => {
  const response = await fetch(
    "".concat(`${base_url}`, "/text/getTextsByIdUserSearch"),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (response.ok) {
    return response.json();
  }
  return Promise.reject({
    msg: response.statusText,
    status: response.status,
  });
};

export const getTextsByIdUser = async (searchParams) => {
  let qmark;
  let pageValue;
  if (searchParams.has("page")) {
    qmark = "?";
    pageValue = "page=".concat(`${searchParams.get("page")}`);
  } else {
    qmark = "";
    pageValue = "";
  }

  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/text/getTextsByIdUser",
      `${qmark}`,
      `${pageValue}`
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (response.ok) {
    return response.json();
  }
  return Promise.reject({
    msg: response.statusText,
    status: response.status,
  });
};

export const getTextByIdText = async (id_text) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/text/".concat(`${id_text}`)),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    return response.json();
  }
  return Promise.reject({
    msg: response.statusText,
    status: response.status,
  });
};

export const getNewestTexts = async () => {
  const response = await fetch("".concat(`${base_url}`, "/text/newestTexts"), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  }
  return Promise.reject({
    msg: response.statusText,
    status: response.status,
  });
};

export const getTexts = async (searchParams) => {
  let qmark = "";
  let ampersand = "";
  let typeOfTextValue = "";
  let pageValue = "";

  if (searchParams.has("typeOfText")) {
    typeOfTextValue = "type_of_text=".concat(
      `${searchParams.get("typeOfText")}`
    );
  } else {
    typeOfTextValue = "";
  }

  if (searchParams.has("page")) {
    pageValue = "page=".concat(`${searchParams.get("page")}`);
  } else {
    pageValue = "";
  }

  if (typeOfTextValue !== "" || pageValue !== "") {
    qmark = "?";
  }
  if (typeOfTextValue !== "" && pageValue !== "") {
    ampersand = "&";
  }

  const response = await fetch(
    "".concat(
      `${base_url}`,
      "/text/getTexts",
      `${qmark}`,
      `${typeOfTextValue}`,
      `${ampersand}`,
      `${pageValue}`
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    return response.json();
  }
  return Promise.reject({
    msg: response.statusText,
    status: response.status,
  });
};
