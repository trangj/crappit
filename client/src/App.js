import React from "react";
import NavigationBar from "./components/navbar/NavigationBar";
import Home from "./components/pages/Home";
import Post from "./components/pages/Post";
import Topic from "./components/pages/Topic";
import Profile from "./components/pages/Profile";
import AllTopics from "./components/pages/AllTopics";
import NotFound from "./components/pages/NotFound";
import Reset from "./components/pages/Reset";
import Forgot from "./components/pages/Forgot";
import AddPost from "./components/pages/AddPost";
import AddTopic from "./components/pages/AddTopic";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Settings from "./components/pages/Settings";
import Moderation from "./components/pages/Moderation";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/UserState";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

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
						<div style={{ paddingTop: "57px" }}>
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/t" exact component={AllTopics} />
								<PrivateRoute path="/t/submit" exact component={AddTopic} />
								<Route path="/t/:topic" exact component={Topic} />
								<PrivateRoute
									path="/t/:topic/moderation"
									exact
									component={Moderation}
								/>
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
								<PrivateRoute path="/settings" exact component={Settings} />
								<Route path="/" component={NotFound} />
							</Switch>
						</div>
					</BrowserRouter>
				</ChakraProvider>
			</UserProvider>
		</QueryClientProvider>
	);
}

export default App;
