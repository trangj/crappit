import React from "react";
import NavigationBar from "./components/NavigationBar";
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
import PublicRoute from "./components/PublicRoute";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { UserProvider } from "./context/UserState";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<ChakraProvider theme={theme}>
					<BrowserRouter>
						<NavigationBar />
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
								<Route path="/t/:topic/comments/:id" exact component={Post} />
								<PrivateRoute path="/submit" exact component={AddPost} />
								<Route path="/forgot" exact component={Forgot} />
								<PublicRoute path="/login" exact component={Login} />
								<PublicRoute path="/register" exact component={Register} />
								<Route path="/reset/:token" exact component={Reset} />
								<Route path="/user/:userid" exact component={Profile} />
								<Route path="/" component={NotFound} />
							</Switch>
						</Container>
					</BrowserRouter>
				</ChakraProvider>
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
