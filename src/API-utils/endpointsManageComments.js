import { base_url } from "./baseUrl";

export const addComment = async (values) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/comment/addComment"),
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

export const getComments = async (id_text) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/comment/".concat(`${id_text}/getComments`)),
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

export const editComment = async (values) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/comment/editComment"),
    {
      method: "PATCH",
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

export const deleteComment = async (values) => {
  const response = await fetch(
    "".concat(`${base_url}`, "/comment/deleteComment"),
    {
      method: "DELETE",
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
