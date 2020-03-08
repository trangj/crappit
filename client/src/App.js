import React, { useState, useEffect } from "react";
import PostList from "./components/PostList";
import NavigationBar from "./components/NavigationBar";
import AddPost from "./components/AddPost";
import Container from "@material-ui/core/Container";

import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(res => setPosts(res));
  });

  const addPost = post => {
    fetch("http://localhost:5000/newpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    })
      .then(res => res.json())
      .then(res => console.log(res));
  };

  const deletePost = id => {
    fetch(`http://localhost:5000/${id}/deletepost`, { method: "DELETE" })
      .then(res => res.json())
      .then(res => console.log(res));
  };

  const updatePost = post => {
    fetch(`http://localhost:5000/${post.id}/updatepost`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    })
      .then(res => res.json())
      .then(res => console.log(res));
  };

  return (
    <div>
      <NavigationBar />
      <Container style={{ marginTop: "2rem" }}>
        <AddPost addPost={addPost} />
        <PostList
          posts={posts}
          deletePost={deletePost}
          updatePost={updatePost}
        />
      </Container>
    </div>
  );
}

export default App;
