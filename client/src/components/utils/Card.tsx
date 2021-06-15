import { Box } from "@chakra-ui/layout";
import React, { HTMLAttributes, ReactNode } from "react";
import { ChakraProps, useColorModeValue } from "@chakra-ui/react";

type Props = HTMLAttributes<HTMLElement> & ChakraProps & {
	children?: ReactNode,
};

const Card = ({ children, ...props }: Props) => {
	return (
		<Box
			{...props}
			mb="3"
			p="3"
			border="1px"
			borderRadius="md"
			overflow="hidden"
			borderColor={useColorModeValue("gray.300", "gray.600")}
			backgroundColor={useColorModeValue("white", "gray.700")}
		>
			{children}
		</Box>
	);
};

export default Card;
