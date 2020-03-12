import React, { useState, useEffect } from "react";
import PostList from "./components/PostList";
import NavigationBar from "./components/NavigationBar";
import AddPost from "./components/AddPost";
import Container from "@material-ui/core/Container";
import AlertStatus from "./components/AlertStatus";

import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (localStorage.token) {
      fetch("http://localhost:5000/user", {
        headers: { "x-auth-token": localStorage.token }
      })
        .then(res => res.json())
        .then(res => setUser(res.user));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(res => setPosts(res));
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(undefined);
  };

  const loginUser = user => {
    fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(res => {
        setUser(res.user);
        localStorage.setItem("token", res.token);
      });
  };

  const registerUser = user => {
    fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(res => {
        setUser(res.user);
        localStorage.setItem("token", res.token);
      });
  };

  const addPost = newPost => {
    fetch("http://localhost:5000/newpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.token
      },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(res => {
        setPosts([...posts, res.post]);
        setStatus(res.status);
      });
  };

  const deletePost = id => {
    fetch(`http://localhost:5000/${id}/deletepost`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.token
      }
    })
      .then(res => res.json())
      .then(res => {
        setPosts(posts.filter(post => post._id !== id));
        setStatus(res.status);
      });
  };

  const updatePost = newPost => {
    fetch(`http://localhost:5000/${newPost.id}/updatepost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.token
      },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(res => {
        setPosts(
          posts.map(post => {
            if (res.post._id === post._id) {
              post.title = res.post.title;
              post.content = res.post.content;
            }
            return post;
          })
        );
        setStatus(res.status);
      });
  };

  return (
    <div>
      <NavigationBar
        loginUser={loginUser}
        registerUser={registerUser}
        logoutUser={logoutUser}
        user={user}
      />
      {status ? <AlertStatus status={status} /> : null}
      <Container style={{ marginTop: "2rem" }}>
        {user === undefined ? null : <AddPost addPost={addPost} user={user} />}
        <PostList
          posts={posts}
          deletePost={deletePost}
          updatePost={updatePost}
          user={user}
        />
      </Container>
    </div>
  );
}

export default App;
