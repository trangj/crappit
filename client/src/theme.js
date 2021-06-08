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
	components: {
		Container: {
			baseStyle: {
				px: { base: "0", sm: "1rem" },
				pt: "5",
				maxW: "container.md",
			},
		},
	},
};

const theme = extendTheme(config);

export default theme;
