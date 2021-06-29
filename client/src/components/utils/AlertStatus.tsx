import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { Error } from "src/types/error";

const AlertStatus = ({ status }: { status: Error | null; }) => {
	if (!status || !status.status) return null;
	return (
		<Alert mt="2" status={status.status.severity}>
			<AlertIcon />
			{status.status.text}
		</Alert>
	);
};

export default AlertStatus;
