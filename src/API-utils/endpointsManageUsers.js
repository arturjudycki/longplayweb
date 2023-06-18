import { base_url } from "./baseUrl";

export const createEditorAdmin = async (values) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/user/createEditorAdmin"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values, null, 2),
    }
  );

  if (!response.ok) {
    return Promise.reject({
      msg: response.statusText,
      status: response.status,
    });
  }
};

export const getEditorUsers = async (values) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/user/getEditorUsers"),
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

export const grantAdmin = async (values) => {
  const response = await fetch("".concat(`${base_url}`, "/user/grantAdmin"), {
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
