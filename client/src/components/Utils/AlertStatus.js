import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";

const AlertStatus = ({ status }) => {
	return (
		<Alert className="alert" status={status.status.severity} variant="solid">
			<AlertIcon />
			{status.status.text}
		</Alert>
	);
};

export default AlertStatus;
