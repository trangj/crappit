import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// Initial state
const initialState = {
  posts: []
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getPost() {
    const res = await fetch("http://localhost:5000/");
    dispatch({
      type: "GET_POST",
      payload: res.json()
    });
  }

  async function addPost(post) {
    const res = await fetch("http://localhost:5000/newpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    dispatch({
      type: "ADD_POST",
      payload: post
    });
  }

  async function deletePost(id) {
    const res = await fetch(`http://localhost:5000/${id}/deletepost`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(res => console.log(res));
    dispatch({
      type: "DELETE_POST",
      payload: id
    });
  }

  async function updatePost(post) {
    const res = await fetch(`http://localhost:5000/${post.id}/updatepost`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    dispatch({
      type: "UPDATE_POST",
      payload: res.json()
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        posts: state.posts,
        addPost,
        deletePost,
        updatePost
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
