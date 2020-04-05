import React, { useContext, useState, useEffect } from "react";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import AddTopic from "../components/AddTopic";
import Search from "./Search";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { GlobalContext } from "../context/GlobalState";

const NavigationBar = ({ handleTheme }) => {
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
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
          <IconButton color="inherit" onClick={() => handleTheme()}>
            <Icon>brightness_4</Icon>
          </IconButton>
          {user === undefined ? (
            <>
              <Login />
              <Register />
            </>
          ) : (
            <>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchor(e.currentTarget)}
              >
                <Icon>account_circle</Icon>
              </IconButton>
              <Menu
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
              >
                <MenuItem
                  component={Link}
                  to={`/u/${user._id}`}
                  onClick={() => setAnchor(null)}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchor(null);
                    logoutUser();
                  }}
                  color="inherit"
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
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
            <ListItem>
              <ListItemText>Sign up to follow topics!</ListItemText>
            </ListItem>
          ) : (
            <>
              <AddTopic />
              <Divider />
              {user.followedTopics.map((topic) => (
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
