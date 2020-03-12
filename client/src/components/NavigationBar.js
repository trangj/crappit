import React from "react";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

const NavigationBar = ({ loginUser, registerUser, logoutUser, user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
          Crappit
        </Typography>
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
