import { Box } from "@chakra-ui/layout";
import React from "react";
import { useColorModeValue } from "@chakra-ui/react";

const Card = ({ children }) => {
	return (
		<Box
			mb="3"
			p="3"
			borderRadius="lg"
			overflow="hidden"
			backgroundColor={useColorModeValue("white", "gray.700")}
		>
			{children}
		</Box>
	);
};

export default Card;
