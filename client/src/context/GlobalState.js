import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  user: undefined,
  loading: true,
  status: undefined,
  posts: [],
  post: {},
  topics: [],
  topic: {}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  async function fetchTopics() {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await fetch("http://localhost:5000/api/index/t");
      const data = await res.json();
      dispatch({
        type: "GET_TOPICS",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "TOPIC_ERROR",
        payload: err.data
      });
    }
  }

  async function fetchTopic(topic) {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}?skip=0`
      );
      const data = await res.json();
      if (!data.topic) throw Error("No topic exists");
      dispatch({
        type: "GET_TOPIC",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: { text: err.message, severity: "error" }
      });
    }
  }

  async function moreTopic(topic, length) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}?skip=${length}`
      );
      const data = await res.json();
      if (!data.topic) throw Error("No topic exists");
      dispatch({
        type: "MORE_TOPIC",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: { text: err.message, severity: "error" }
      });
    }
  }

  async function fetchPosts() {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await fetch(`http://localhost:5000/api/index?skip=0`);
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

  async function morePosts(length) {
    try {
      const res = await fetch(`http://localhost:5000/api/index?skip=${length}`);
      const data = await res.json();
      dispatch({
        type: "MORE_POSTS",
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
      dispatch({ type: "SET_LOADING" });
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}`
      );
      const data = await res.json();
      if (!data.post) throw Error("No post exists");
      dispatch({
        type: "GET_POST",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "POST_ERROR",
        payload: { text: err.message, severity: "error" }
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
        payload: data
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
      localStorage.setItem("token", data.token);
      dispatch({
        type: "REGISTER_USER",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "USER_ERROR",
        payload: err.data
      });
    }
  }

  async function addTopic(formData) {
    try {
      dispatch({ type: "CLEAR_STATUS" });
      const res = await fetch("http://localhost:5000/api/index/t", {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.token
        },
        body: formData
      });
      const data = await res.json();
      dispatch({
        type: "ADD_TOPIC",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "TOPIC_ERROR",
        payload: err.data
      });
    }
  }

  async function addPost(topic, formData) {
    try {
      dispatch({ type: "CLEAR_STATUS" });
      const res = await fetch(`http://localhost:5000/api/index/t/${topic}/p`, {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.token
        },
        body: formData
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
      dispatch({ type: "CLEAR_STATUS" });
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
      dispatch({ type: "CLEAR_STATUS" });

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
      dispatch({ type: "CLEAR_STATUS" });
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
      dispatch({ type: "CLEAR_STATUS" });

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
      console.log(data);
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
      dispatch({ type: "CLEAR_STATUS" });
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

  async function changeVote(topic, id, vote) {
    try {
      dispatch({ type: "CLEAR_STATUS" });
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": localStorage.token
          }
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

  async function changeCommentVote(topic, postid, commentid, vote) {
    try {
      dispatch({ type: "CLEAR_STATUS" });
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/p/${postid}/c/${commentid}/changevote?vote=${vote}`,
        {
          method: "PUT",
          headers: {
            "x-auth-token": localStorage.token
          }
        }
      );
      const data = await res.json();
      dispatch({
        type: "CHANGE_COMMENT_VOTE",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "VOTE_ERROR",
        payload: err.data
      });
    }
  }

  async function followTopic(topic) {
    try {
      dispatch({ type: "CLEAR_STATUS" });
      const res = await fetch(
        `http://localhost:5000/api/index/t/${topic}/followtopic`,
        {
          method: "POST",
          headers: {
            "x-auth-token": localStorage.token
          }
        }
      );
      const data = await res.json();
      dispatch({
        type: "FOLLOW_TOPIC",
        payload: data
      });
    } catch (err) {
      dispatch({
        type: "FOLLOW_ERROR",
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
        topics: state.topics,
        topic: state.topic,
        loading: state.loading,
        fetchUser,
        loginUser,
        logoutUser,
        registerUser,
        fetchTopics,
        fetchTopic,
        moreTopic,
        fetchPosts,
        morePosts,
        fetchPost,
        addPost,
        addComment,
        addTopic,
        updatePost,
        updateComment,
        deletePost,
        deleteComment,
        changeVote,
        changeCommentVote,
        followTopic
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
