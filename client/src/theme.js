import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
	styles: {
		global: (props) => ({
			body: {
				bg: mode("gray.50", "black")(props),
			},
		}),
	},
	colors: {
		gray: {
			50: "rgb(220,220,220)",
			100: "rgb(200,200,200)",
			200: "rgb(180,180,180)",
			300: "rgb(160,160,160)",
			400: "rgb(140,140,140)",
			500: "rgb(120,120,120)",
			600: "rgb(100,100,100)",
			700: "rgb(60,60,60)",
			800: "rgb(45,45,45)",
			900: "rgb(30,30,30)",
		},
	},
};

const theme = extendTheme(config);

export default theme;
