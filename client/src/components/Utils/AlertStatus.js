import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

const AlertStatus = () => {
	const [open, setOpen] = useState(false);
	const { status } = useContext(GlobalContext);

	useEffect(() => {
		setOpen(true);
	}, [status]);

	return status !== undefined
		? open && (
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
		: null;
};

export default AlertStatus;
