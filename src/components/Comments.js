import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { userAuth } from "../API-utils/endpointsAuthUser";
import {
  addComment,
  getComments,
  editComment,
  deleteComment,
} from "../API-utils/endpointsManageComments";
import InfoToLog from "./InfoToLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { Formik, Field, Form, ErrorMessage } from "formik";

import * as Yup from "yup";

const LoginSchemat = Yup.object().shape({
  content_comment: Yup.string().required("Komentarz nie może być pusty!"),
});

const EditComment = ({ commentInfo }) => {
  const { id_comment, content_comment } = commentInfo.comment;
  const [editForm, setEditForm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: edit_comment } = useMutation(editComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments-data"]);
    },
  });

  const toggleEditForm = () => {
    setEditForm(!editForm);
  };

  return (
    <>
      <>
        <span className="comments__box-edit" onClick={toggleEditForm}>
          <FontAwesomeIcon icon={faPen} className="comments__box-icon-edit" />
          Edytuj
        </span>
      </>
      {editForm ? (
        <div className="modal">
          <div onClick={toggleEditForm} className="overlay"></div>
          <div className="modal-content">
            <Formik
              initialValues={{
                content_comment: content_comment,
                id_comment: id_comment,
              }}
              validationSchema={LoginSchemat}
              onSubmit={(values) => {
                edit_comment(values);
                toggleEditForm();
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="comments__editBox">
                  <div className="comments__addContainer">
                    <Field
                      as="textarea"
                      id="content_comment"
                      name="content_comment"
                      placeholder="Dodaj komentarz"
                      className="comments__form-input-edit"
                    />
                  </div>
                  <div className="errors">
                    <ErrorMessage name="content_comment" />
                  </div>
                  <button
                    type="button"
                    className="button-modal button-modal--marginRight"
                    onClick={toggleEditForm}
                  >
                    anuluj
                  </button>
                  <button
                    type="submit"
                    className="button-modal button-modal--margin"
                  >
                    zapisz
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const DeleteComment = ({ commentInfo }) => {
  const id_comment = commentInfo.comment;
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);

  let infoDelete;

  const {
    isError: errorDelete,
    isSuccess: successDelete,
    mutate: delete_comment,
  } = useMutation(deleteComment, {});

  if (successDelete) {
    infoDelete = (
      <p className="comment-del comment-del--success">
        Komentarz został usunięty
      </p>
    );
  }
  if (errorDelete) {
    infoDelete = (
      <p className="comment-del comment-del--error">
        Nastąpił błąd. Spróbuj ponownie.
      </p>
    );
  }

  const toggleModal = () => {
    setModal(!modal);
    if (successDelete) {
      queryClient.invalidateQueries(["comments-data"]);
    }
  };

  return (
    <>
      <span className="comments__box-delete" onClick={toggleModal}>
        <FontAwesomeIcon icon={faTrash} className="comments__box-icon-delete" />
        Usuń
      </span>
      {modal ? (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2 className="modal-title">
              Czy na pewno chcesz usunąć ten komentarz?
            </h2>
            <button
              className="button-modal button-modal--confirm"
              onClick={() => {
                delete_comment(id_comment);
              }}
            >
              Tak
            </button>
            {infoDelete}
            <button className="button-modal" onClick={toggleModal}>
              zamknij
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const Comments = ({ info }) => {
  const idText = info.id_text;
  const queryClient = useQueryClient();

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  let displayComments;

  const { status: isLogged, data } = useQuery("user", userAuth, { retry: 0 });

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

  const { status: isComments, data: comments } = useQuery(
    ["comments-data", idText],
    () => getComments(idText),
    {
      retry: 0,
    }
  );

  if (isComments === "success") {
    displayComments = comments
      .sort((a, b) => b.id_comment - a.id_comment)
      .map((comment) => (
        <div key={comment.id_comment} className="comments__box">
          <div className="comments__box-item-user">
            <NavLink
              to={{
                pathname: "/user/".concat(`${comment.username}`),
              }}
              className="comments__box-item-user-link"
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="comments__box-item-icon"
              />
              {comment.username}
            </NavLink>
            {comment.edited === 1 ? (
              <p className="comments__box-item-edited">Edytowany</p>
            ) : (
              ""
            )}
            <div className="comments__box-edit-delete">
              {isLogged === "success" &&
              data.user.username === comment.username ? (
                <EditComment commentInfo={{ comment }} />
              ) : (
                ""
              )}
              {(isLogged === "success" && data.user.user_type === "admin") ||
              (isLogged === "success" &&
                data.user.username === comment.username) ? (
                <DeleteComment commentInfo={{ comment }} />
              ) : (
                ""
              )}
            </div>
          </div>
          <p className="comments__box-item-content">
            {comment.content_comment}
          </p>
          <p className="comments__box-item-date">
            Komentarz dodany
            <span>{displayPublicationDate(comment.publication_date)}</span>
          </p>
        </div>
      ));
  }

  const { mutate: add_comment } = useMutation(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments-data"]);
    },
  });

  return (
    <>
      <p className="comment-title" id="commentTitle">
        Komentarze{" "}
        <span>
          {comments !== undefined && comments.length !== 0
            ? `(${comments.length})`
            : ""}
        </span>
      </p>
      <section className="comments">
        <Formik
          initialValues={{
            content_comment: "",
            id_text: idText,
          }}
          validationSchema={LoginSchemat}
          onSubmit={(values, onSubmitProps) => {
            add_comment(values);
            onSubmitProps.resetForm();
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="comments__form">
              <div className="comments__addContainer">
                <Field
                  as="textarea"
                  id="content_comment"
                  name="content_comment"
                  placeholder="Dodaj komentarz"
                  className="comments__form-input"
                />
                <button
                  type="submit"
                  onClick={() => {
                    if (isLogged !== "success") {
                      toggleModal();
                    }
                  }}
                  className="button-addComment"
                >
                  skomentuj
                </button>
              </div>
              <div className="errors">
                <ErrorMessage name="content_comment" />
              </div>
            </Form>
          )}
        </Formik>
      </section>
      <InfoToLog toggleModal={toggleModal} props={{ modal }} />
      <section className="display-comments">{displayComments}</section>
    </>
  );
};

export default Comments;
