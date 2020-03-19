import React, { useContext, useEffect } from "react";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import { GlobalContext } from "../context/GlobalState";

const NavigationBar = () => {
  const { loginUser, registerUser, logoutUser, user } = useContext(
    GlobalContext
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          to="/"
          style={{ flex: 1, textDecoration: "none", color: "white" }}
        >
          <Typography variant="h6" color="inherit">
            Crappit
          </Typography>
        </Link>
        {user === undefined ? (
          <>
            <Login loginUser={loginUser} />
            <Register registerUser={registerUser} />
          </>
        ) : (
          <Button onClick={() => logoutUser()} color="inherit">
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
