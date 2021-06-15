export default (state: any, action: any) => {
	switch (action.type) {
		case "GET_USER":
			return {
				...state,
				user: action.payload,
			};
		case "LOGOUT_USER":
			return {
				...state,
				user: null,
			};
		case "LOGIN_USER":
			return {
				...state,
				user: action.payload.user,
			};
		case "SET_USER":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
};
