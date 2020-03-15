import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import Alert from "@material-ui/lab/Alert";

const AlertStatus = () => {
  const [closed, setClosed] = useState(true);
  const { status } = useContext(GlobalContext);

  useEffect(() => {
    setClosed(false);
  }, [status]);

  return status ? (
    closed ? null : (
      <Alert severity="warning" onClose={() => setClosed(false)}>
        {status}
      </Alert>
    )
  ) : null;
};

export default AlertStatus;
