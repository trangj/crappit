import { useColorModeValue } from "@chakra-ui/color-mode";
import { LinkBox } from "@chakra-ui/react";
import React from "react";

const LinkCard = ({ children, ...props }) => {
	return (
		<LinkBox
			{...props}
			p="2"
			border="1px"
			borderColor={useColorModeValue("gray.200", "gray.600")}
			backgroundColor={useColorModeValue("white", "gray.700")}
			_hover={{ borderColor: useColorModeValue("black", "white"), zIndex: "1" }}
		>
			{children}
		</LinkBox>
	);
};

export default LinkCard;
