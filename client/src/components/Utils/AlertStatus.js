import React, { useState, useEffect, useContext } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

const AlertStatus = ({ status }) => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(true);
	}, []);

	return (
		open && (
			<Alert className="alert" status={status.severity} variant="solid">
				<AlertIcon />
				{status.text}
				<CloseButton
					position="absolute"
					right="8px"
					top="8px"
					onClick={() => setOpen(false)}
				/>
			</Alert>
		)
	);
};

export default AlertStatus;
