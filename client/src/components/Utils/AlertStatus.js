import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";

const AlertStatus = ({ status }) => {
	if (!status.status) return <div>Something went wrong...</div>;
	return (
		<Alert mt="2" status={status.status.severity}>
			<AlertIcon />
			{status.status.text}
		</Alert>
	);
};

export default AlertStatus;
