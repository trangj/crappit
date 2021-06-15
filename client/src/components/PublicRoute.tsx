import React, { ReactNode, useContext } from "react";
import { UserContext } from "../context/UserState";
import { Route, Redirect } from "react-router";
import { RouteProps } from "react-router-dom";

type Props = RouteProps & {
	children?: ReactNode,
};

const PrivateRoute = ({ children, ...rest }: Props) => {
	const { user } = useContext(UserContext);
	return (
		<Route {...rest}>{user === null ? children : <Redirect to="/" />}</Route>
	);
};

export default PrivateRoute;
