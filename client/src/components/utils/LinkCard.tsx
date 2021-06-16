import { useColorModeValue } from "@chakra-ui/color-mode";
import { forwardRef, LinkBox, LinkBoxProps } from "@chakra-ui/react";
import React from "react";

const LinkCard = forwardRef<LinkBoxProps, "div">(({ children, ...props }, ref) => (
	<LinkBox
		{...props}
		ref={ref}
		p="2"
		border="1px"
		borderColor={useColorModeValue("gray.300", "gray.600")}
		backgroundColor={useColorModeValue("white", "gray.700")}
		_hover={{ borderColor: useColorModeValue("black", "white"), zIndex: "1" }}
	>
		{children}
	</LinkBox>
));

export default LinkCard;
