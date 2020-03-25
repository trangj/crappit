import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const AlertStatus = () => {
  const [open, setOpen] = useState(false);
  const { status } = useContext(GlobalContext);

  useEffect(() => {
    setOpen(true);
  }, [status]);

  return status !== undefined ? (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    >
      <Alert severity={status.severity} onClose={() => setOpen(false)}>
        {status.text}
      </Alert>
    </Snackbar>
  ) : null;
};

export default AlertStatus;
