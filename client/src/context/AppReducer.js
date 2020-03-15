export default (state, action) => {
  switch (action.type) {
    case "GET_POSTS":
      return {
        ...state,
        posts: action.payload
      };
    case "GET_POST":
      return {
        ...state,
        post: action.payload
      };
    case "GET_USER":
      return {
        ...state,
        user: action.payload
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: undefined
      };
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload
      };
    case "REGISTER_USER":
      return {
        ...state,
        user: action.payload
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload.post],
        status: action.payload.status
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map(post => {
          if (action.payload.post._id === post._id) {
            post.title = action.payload.post.title;
            post.content = action.payload.post.content;
          }
          return post;
        }),
        status: action.payload.status
      };
    case "USER_ERROR":
      return {
        ...state,
        status: action.payload
      };
    case "POST_ERROR":
      return {
        ...state,
        status: action.payload
      };
    default:
      return state;
  }
};
