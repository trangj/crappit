import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  user: undefined,
  status: "",
  posts: [],
  post: {}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:5000/");
      const data = await res.json();

      dispatch({
        type: "GET_POSTS",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: err.data
      });
    }
  }

  async function fetchPost(id) {
    try {
      const res = await fetch(`http://localhost:5000/${id}`);
      const data = await res.json();

      dispatch({
        type: "GET_POST",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: err.data
      });
    }
  }

  async function fetchUser() {
    try {
      const res = await fetch("http://localhost:5000/user/getuser", {
        headers: { "x-auth-token": localStorage.token }
      });
      const data = await res.json();
      dispatch({
        type: "GET_USER",
        payload: data.user
      });
    } catch (err) {
      dispatch({
        type: "USER_ERROR",
        payload: err.data
      });
    }
  }

  function logoutUser() {
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT_USER",
      payload: undefined
    });
  }

  async function loginUser(user) {
    try {
      const res = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);
      dispatch({
        type: "LOGIN_USER",
        payload: data.user
      });
    } catch (err) {
      dispatch({
        type: "USER_ERROR",
        payload: err.data
      });
    }
  }

  async function registerUser(user) {
    try {
      const res = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      localStorage.setItem("token", data.token);
      dispatch({
        type: "REGISTER_USER",
        payload: data.user
      });
    } catch (err) {
      dispatch({
        type: "USER_ERROR",
        payload: err.data
      });
    }
  }

  async function addPost(newPost) {
    try {
      const res = await fetch("http://localhost:5000/newpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.token
        },
        body: JSON.stringify(newPost)
      });
      const data = await res.json();
      dispatch({
        type: "ADD_POST",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: err.data
      });
    }
  }

  async function addComment(newComment) {
    try {
      const res = await fetch(
        `http://localhost:5000/${newComment.id}/newcomment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token
          },
          body: JSON.stringify(newComment)
        }
      );
      const data = await res.json();
      dispatch({
        type: "ADD_COMMENT",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "COMMENT_ERROR",
        payload: err.data
      });
    }
  }

  async function deletePost(id) {
    try {
      const res = await fetch(`http://localhost:5000/${id}/deletepost`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.token
        }
      });
      const data = await res.json();
      dispatch({
        type: "DELETE_POST",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: err.data
      });
    }
  }

  async function deleteComment(id, commentid) {
    try {
      const res = await fetch(
        `http://localhost:5000/${id}/c/${commentid}/deletecomment`,
        { method: "DELETE", headers: { "x-auth-token": localStorage.token } }
      );
      const data = await res.json();
      dispatch({
        type: "DELETE_COMMENT",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "COMMENT_ERROR",
        payload: err.data
      });
    }
  }

  async function updatePost(newPost) {
    try {
      const res = await fetch(
        `http://localhost:5000/${newPost.id}/updatepost`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token
          },
          body: JSON.stringify(newPost)
        }
      );
      const data = await res.json();
      dispatch({
        type: "UPDATE_POST",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: err.data
      });
    }
  }

  async function updateComment(newComment, id) {
    try {
      const res = await fetch(
        `http://localhost:5000/${id}/c/${newComment._id}/updatecomment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token
          },
          body: JSON.stringify(newComment)
        }
      );
      const data = await res.json();
      dispatch({
        type: "UPDATE_COMMENT",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "COMMENT_ERROR",
        payload: err.data
      });
    }
  }

  async function changeVote(vote, id) {
    const res = await fetch(
      `http://localhost:5000/${id.post}/changevote?vote=${vote}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.token
        },
        body: JSON.stringify(id)
      }
    );
    const data = await res.json();
    dispatch({
      type: "CHANGE_VOTE",
      payload: data
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        posts: state.posts,
        post: state.post,
        user: state.user,
        status: state.status,
        fetchUser,
        fetchPosts,
        fetchPost,
        loginUser,
        logoutUser,
        registerUser,
        addPost,
        addComment,
        updatePost,
        updateComment,
        deletePost,
        deleteComment,
        changeVote
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
