import React, { useContext } from "react";
import { UserContext } from "../context/UserState";
import { Route, Redirect } from "react-router";

const PrivateRoute = ({ children, ...rest }) => {
	const { user } = useContext(UserContext);
	return (
		<Route {...rest}>{user === null ? children : <Redirect to="/" />}</Route>
	);
};

export default PrivateRoute;
