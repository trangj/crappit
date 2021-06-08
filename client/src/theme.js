import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
	styles: {
		global: (props) => ({
			body: {
				bg: mode("gray.200", "gray.800")(props),
			},
		}),
	},
};

const theme = extendTheme(config);

export default theme;
