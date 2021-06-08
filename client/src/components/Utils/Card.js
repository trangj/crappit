import { Box } from "@chakra-ui/layout";
import React from "react";
import { useColorModeValue } from "@chakra-ui/react";

const Card = ({ children, ...props }) => {
	return (
		<Box
			{...props}
			mb="2"
			p="3"
			borderRadius="lg"
			overflow="hidden"
			backgroundColor={useColorModeValue("gray.50", "gray.700")}
		>
			{children}
		</Box>
	);
};

export default Card;
