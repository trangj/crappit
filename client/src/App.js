import React from "react";
import NavigationBar from "./components/NavigationBar";
import AlertStatus from "./components/Utils/AlertStatus";
import Home from "./components/Pages/Home";
import Post from "./components/Pages/Post";
import Topic from "./components/Pages/Topic";
import Profile from "./components/Pages/Profile";
import AllTopics from "./components/Pages/AllTopics";
import NotFound from "./components/Pages/NotFound";
import Reset from "./components/Pages/Reset";
import Forgot from "./components/Pages/Forgot";
import AddPost from "./components/Pages/AddPost";
import AddTopic from "./components/Pages/AddTopic";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import PrivateRoute from "./components/PrivateRoute";
import { ChakraProvider, ColorModeScript, Container } from "@chakra-ui/react";
import { GlobalProvider } from "./context/GlobalState";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import "./App.css";

function App() {
	return (
		<>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<GlobalProvider>
				<ChakraProvider theme={theme}>
					<BrowserRouter>
						<NavigationBar />
						<AlertStatus />
						<Container style={{ marginTop: "2rem" }} maxW="container.lg">
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/t" exact component={AllTopics} />
								<PrivateRoute path="/t/submit" exact component={AddTopic} />
								<Route path="/t/:topic" exact component={Topic} />
								<PrivateRoute
									path="/t/:topic/submit"
									exact
									component={AddPost}
								/>
								<Route path="/t/:topic/p/:id" exact component={Post} />
								<PrivateRoute path="/submit" exact component={AddPost} />
								<Route path="/forgot" exact component={Forgot} />
								<Route path="/login" exact component={Login} />
								<Route path="/register" exact component={Register} />
								<Route path="/reset/:token" exact component={Reset} />
								<Route path="/u/:userid" exact component={Profile} />
								<Route path="/" component={NotFound} />
							</Switch>
						</Container>
					</BrowserRouter>
				</ChakraProvider>
			</GlobalProvider>
		</>
	);
}

export default App;
