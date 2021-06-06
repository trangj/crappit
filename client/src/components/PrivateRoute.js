import React, { useContext } from "react";
import { UserContext } from "../context/UserState";
import { Route, Redirect, useLocation } from "react-router";

const PrivateRoute = ({ children, ...rest }) => {
	const { user } = useContext(UserContext);
	const location = useLocation();
	return (
		<Route {...rest}>
			{user !== null ? (
				children
			) : (
				<Redirect
					to={{
						pathname: "/login",
						state: {
							status: {
								text: "Log in to access this feature",
								severity: "error",
							},
							from: location.pathname,
						},
					}}
				/>
			)}
		</Route>
	);
};

export default PrivateRoute;
