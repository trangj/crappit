import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  user: undefined,
  status: "",
  posts: [],
  post: {},
  topic: {}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  async function fetchTopic(topic) {
    try {
      const res = await fetch(`http://localhost:5000/api/index/t/${topic}`);
      const data = await res.json();
      dispatch({
        type: "GET_TOPIC",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERR",
        payload: err.data
      });
    }
  }

  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:5000/api/index");
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

  async function fetchPost(topic, id) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}`
      );
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
      const res = await fetch("http://localhost:5000/api/user", {
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
      const res = await fetch("http://localhost:5000/api/user/login", {
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
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      console.log(data);
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

  async function addPost(topic, newPost) {
    try {
      const res = await fetch(`http://localhost:5000/api/index/t/${topic}/p`, {
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

  async function addComment(topic, id, newComment) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}`,
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

  async function deletePost(topic, id) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token
          }
        }
      );
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

  async function deleteComment(topic, id, commentid) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}/c/${commentid}`,
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

  async function updatePost(topic, id, newPost) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}`,
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

  async function updateComment(topic, postid, commentid, newComment) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${postid}/c/${commentid}`,
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

  async function changeVote(topic, id, vote, userid) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.token
          },
          body: JSON.stringify(userid)
        }
      );
      const data = await res.json();
      dispatch({
        type: "CHANGE_VOTE",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "VOTE_ERROR",
        payload: err.data
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        posts: state.posts,
        post: state.post,
        user: state.user,
        status: state.status,
        topic: state.topic,
        fetchUser,
        fetchTopic,
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
