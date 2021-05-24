import { useColorModeValue } from "@chakra-ui/color-mode";
import { LinkBox } from "@chakra-ui/react";
import React from "react";

const LinkCard = ({ children }) => {
	return (
		<LinkBox
			mb="2"
			p="3"
			borderWidth="1px"
			borderRadius="lg"
			borderColor={useColorModeValue("gray.100", "gray.700")}
			backgroundColor={useColorModeValue("gray.100", "gray.700")}
			_hover={{ borderColor: "gray.400" }}
		>
			{children}
		</LinkBox>
	);
};

export default LinkCard;
