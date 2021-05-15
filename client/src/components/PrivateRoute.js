import React from "react";
import { Route, Redirect, useLocation } from "react-router";

const PrivateRoute = ({ children, ...rest }) => {
	const location = useLocation();
	return (
		<Route {...rest}>
			{localStorage.token ? (
				children
			) : (
				<Redirect
					to={{
						pathname: "/login",
						state: {
							error: "Log in to access this feature",
							from: location.pathname,
						},
					}}
				/>
			)}
		</Route>
	);
};

export default PrivateRoute;
