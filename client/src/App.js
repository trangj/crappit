import React from "react";
import NavigationBar from "./components/NavigationBar";
import AlertStatus from "./components/Utils/AlertStatus";
import Home from "./components/Pages/Home";
import Post from "./components/Pages/Post";
import Topic from "./components/Pages/Topic";
import Profile from "./components/Pages/Profile";
import AllTopics from "./components/Pages/AllTopics";
import NotFound from "./components/Pages/NotFound";
import Reset from "./components/Pages/Reset";
import Forgot from "./components/Pages/Forgot";
import { Container, createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { GlobalProvider } from "./context/GlobalState";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { deepOrange, indigo } from "@material-ui/core/colors";
import "./App.css";

function App() {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: deepOrange,
      secondary: indigo,
    },
  });

  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <NavigationBar />
          <AlertStatus />
          <Container style={{ marginTop: "2rem" }} maxWidth="md">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/t" exact component={AllTopics} />
              <Route path="/t/:topic" exact component={Topic} />
              <Route path="/t/:topic/p/:id" exact component={Post} />
              <Route path="/forgot" exact component={Forgot} />
              <Route path="/reset/:token" exact component={Reset} />
              <Route path="/u/:userid" exact component={Profile} />
              <Route path="/" component={NotFound} />
            </Switch>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;
