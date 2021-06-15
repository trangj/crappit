import React, { ReactNode, useContext } from "react";
import { UserContext } from "../context/UserState";
import { Route, Redirect, useLocation } from "react-router";
import { RouteProps } from "react-router-dom";

type Props = RouteProps & {
	children?: ReactNode;
};

const PrivateRoute = ({ children, ...rest }: Props) => {
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
								status: {
									text: "Log in to access this feature",
									severity: "error",
								}
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
