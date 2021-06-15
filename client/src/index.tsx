import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

ReactDOM.render(
	<>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<App />
	</>,
	document.getElementById("root")
);
