export default (state, action) => {
	switch (action.type) {
		case "GET_USER":
			return {
				...state,
				user: action.payload,
			};
		case "LOGOUT_USER":
			return {
				...state,
				user: undefined,
				status: { text: "Successfully logged out", severity: "success" },
			};
		case "LOGIN_USER":
			return {
				...state,
				user: action.payload.user,
				status: action.payload.status,
			};
		default:
			return state;
	}
};
