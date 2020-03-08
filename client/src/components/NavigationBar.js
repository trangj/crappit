import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const NavigationBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Crappit
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
