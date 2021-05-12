export default (state, action) => {
	switch (action.type) {
		case "GET_TOPICS":
			return {
				...state,
				topics: action.payload.topics,
				loading: false,
			};
		case "GET_TOPIC":
			return {
				...state,
				posts: action.payload.posts,
				topic: action.payload.topic,
				loading: false,
			};
		case "MORE_TOPIC":
			return {
				...state,
				posts: [...state.posts, ...action.payload.posts],
			};
		case "GET_POSTS":
			return {
				...state,
				posts: action.payload,
				loading: false,
			};
		case "MORE_POSTS":
			return {
				...state,
				posts: [...state.posts, ...action.payload],
			};
		case "GET_POST":
			return {
				...state,
				post: action.payload.post,
				status: action.payload.status,
				loading: false,
			};
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
		case "REGISTER_USER":
			return {
				...state,
				user: action.payload.user,
				status: action.payload.status,
			};
		case "ADD_TOPIC":
			return {
				...state,
				topics: [...state.topics, action.payload.topic],
				status: action.payload.status,
			};
		case "ADD_POST":
			return {
				...state,
				posts: [...state.posts, action.payload.post],
				status: action.payload.status,
			};
		case "ADD_COMMENT":
			return {
				...state,
				post: {
					...state.post,
					comments: [...state.post.comments, action.payload.comment],
				},
				status: action.payload.status,
			};
		case "ADD_REPLY":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						const id = action.payload.reply.comment;
						function searchTree(comment, id) {
							if (comment._id === id) {
								comment.comments.push(action.payload.reply);
								return comment;
							}
							if (comment.comments.length === 0) return comment;

							comment.comments = comment.comments.map((comment) => {
								comment = searchTree(comment, id);
								return comment;
							});
							return comment;
						}
						comment = searchTree(comment, id);
						return comment;
					}),
				},
			};
		case "DELETE_POST":
			return {
				...state,
				post: {},
				status: action.payload.status,
			};
		case "DELETE_COMMENT":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.filter(
						(comment) => comment._id !== action.payload.comment._id
					),
				},
				status: action.payload.status,
			};
		case "DELETE_REPLY":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						const id = action.payload.comment.comment;
						function searchTree(comment, id) {
							if (comment._id === id) {
								comment.comments = comment.comments.filter(
									(comment) => comment._id !== action.payload.comment._id
								);
								return comment;
							}
							if (comment.comments.length === 0) return comment;

							comment.comments = comment.comments.map((comment) => {
								comment = searchTree(comment, id);
								return comment;
							});
							return comment;
						}
						comment = searchTree(comment, id);
						return comment;
					}),
				},
				status: action.payload.status,
			};
		case "UPDATE_POST":
			return {
				...state,
				post: action.payload.post,
				status: action.payload.status,
			};
		case "UPDATE_COMMENT":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						if (action.payload.comment._id === comment._id) {
							comment.content = action.payload.comment.content;
						}
						return comment;
					}),
				},
				status: action.payload.status,
			};
		case "UPDATE_REPLY":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						const id = action.payload.comment.comment;
						function searchTree(comment, id) {
							if (comment._id === id) {
								comment.comments = comment.comments.map((comment) => {
									if (comment._id === action.payload.comment._id) {
										comment.content = action.payload.comment.content;
									}
									return comment;
								});
								return comment;
							}
							if (comment.comments.length === 0) return comment;

							comment.comments = comment.comments.map((comment) => {
								comment = searchTree(comment, id);
								return comment;
							});
							return comment;
						}
						comment = searchTree(comment, id);
						return comment;
					}),
				},
				status: action.payload.status,
			};
		case "CHANGE_VOTE":
			return {
				...state,
				posts: state.posts.map((post) => {
					if (action.payload.post._id === post._id) {
						post.likes = action.payload.post.likes;
						post.dislikes = action.payload.post.dislikes;
					}
					return post;
				}),
				post: {
					...state.post,
					likes: action.payload.post.likes,
					dislikes: action.payload.post.dislikes,
				},
				status: action.payload.status,
			};
		case "CHANGE_COMMENT_VOTE":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						if (action.payload.comment._id === comment._id) {
							comment.likes = action.payload.comment.likes;
							comment.dislikes = action.payload.comment.dislikes;
						}
						return comment;
					}),
				},
				status: action.payload.status,
			};
		case "CHANGE_REPLY_VOTE":
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.map((comment) => {
						const id = action.payload.comment.comment;
						function searchTree(comment, id) {
							if (comment._id === id) {
								comment.comments = comment.comments.map((comment) => {
									if (comment._id === action.payload.comment._id) {
										comment.likes = action.payload.comment.likes;
										comment.dislikes = action.payload.comment.dislikes;
									}
									return comment;
								});
								return comment;
							}
							if (comment.comments.length === 0) return comment;

							comment.comments = comment.comments.map((comment) => {
								comment = searchTree(comment, id);
								return comment;
							});
							return comment;
						}
						comment = searchTree(comment, id);
						return comment;
					}),
				},
				status: action.payload.status,
			};
		case "FOLLOW_TOPIC":
			return {
				...state,
				user: {
					...state.user,
					followedTopics: action.payload.user.followedTopics,
				},
				status: action.payload.status,
			};
		case "USER_ERROR":
			return {
				...state,
				status: action.payload,
			};
		case "POST_ERROR":
			return {
				...state,
				status: action.payload,
			};
		case "COMMENT_ERROR":
			return {
				...state,
				status: action.payload,
			};
		case "SET_LOADING":
			return {
				...state,
				loading: true,
			};
		case "CLEAR_STATUS":
			return {
				...state,
				status: undefined,
			};
		case "SET_STATUS":
			return {
				...state,
				status: action.payload,
			};
		default:
			return state;
	}
};
