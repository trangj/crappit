import React, { useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";

const AlertStatus = ({ status }) => {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    setClosed(false);
  }, [status]);

  return closed ? null : (
    <Alert severity="warning" onClose={() => setClosed(true)}>
      {status}
    </Alert>
  );
};

export default AlertStatus;
