import { Box } from "@chakra-ui/layout";
import React from "react";
import { useColorModeValue } from "@chakra-ui/react";

const Card = ({ children, ...props }) => {
	return (
		<Box
			{...props}
			mb="3"
			p="3"
			border="1px"
			borderRadius="lg"
			overflow="hidden"
			borderColor={useColorModeValue("gray.300", "gray.600")}
			backgroundColor={useColorModeValue("white", "gray.700")}
		>
			{children}
		</Box>
	);
};

export default Card;
