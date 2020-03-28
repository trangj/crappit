import React, { useContext, useState, useEffect } from "react";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import AddTopic from "../components/AddTopic";
import Search from "./Search";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Icon,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { GlobalContext } from "../context/GlobalState";

const NavigationBar = () => {
  const [drawer, setDrawer] = useState(false);
  const { fetchUser, logoutUser, user } = useContext(GlobalContext);

  useEffect(() => {
    if (localStorage.token) {
      fetchUser();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            style={{ marginRight: "1rem" }}
            onClick={() => setDrawer(true)}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" color="inherit">
            Crappit
          </Typography>
          <Search />
          {user === undefined ? (
            <>
              <Login />
              <Register />
            </>
          ) : (
            <Button onClick={() => logoutUser()} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
        <List style={{ width: 250 }}>
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => setDrawer(false)}
          >
            <ListItemIcon>
              <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/t"
            onClick={() => setDrawer(false)}
          >
            <ListItemIcon>
              <Icon>explore</Icon>
            </ListItemIcon>
            <ListItemText>Discover Topics</ListItemText>
          </ListItem>
          {user === undefined ? (
            <ListItem>Sign up to follow topics!</ListItem>
          ) : (
            <>
              <AddTopic />
              <Divider />
              {user.followedTopics.map(topic => (
                <ListItem
                  button
                  component={Link}
                  to={`/t/${topic}`}
                  onClick={() => setDrawer(false)}
                  key={topic}
                >
                  <ListItemIcon>
                    <Icon>forum</Icon>
                  </ListItemIcon>
                  <ListItemText>t/{topic}</ListItemText>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default NavigationBar;
