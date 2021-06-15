import { useColorModeValue } from "@chakra-ui/color-mode";
import { ChakraProps, LinkBox } from "@chakra-ui/react";
import React, { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLElement> & ChakraProps & {
	children: ReactNode,
};

const LinkCard = ({ children, ...props }: Props) => {
	return (
		<LinkBox
			{...props}
			p="2"
			border="1px"
			borderColor={useColorModeValue("gray.300", "gray.600")}
			backgroundColor={useColorModeValue("white", "gray.700")}
			_hover={{ borderColor: useColorModeValue("black", "white"), zIndex: "1" }}
		>
			{children}
		</LinkBox>
	);
};

export default LinkCard;
