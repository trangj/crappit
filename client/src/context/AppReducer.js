export default (state, action) => {
  switch (action.type) {
    case "GET_TOPIC":
      return {
        ...state,
        posts: action.payload.topic.posts,
        topic: {
          _id: action.payload.topic._id,
          title: action.payload.topic.title,
          description: action.payload.topic.description,
          date: action.payload.topic.date
        }
      };
    case "GET_POSTS":
      return {
        ...state,
        posts: action.payload
      };
    case "GET_POST":
      return {
        ...state,
        post: action.payload.post,
        status: action.payload.status
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
        user: action.payload.user,
        status: action.payload.status
      };
    case "REGISTER_USER":
      return {
        ...state,
        user: action.payload.user,
        status: action.payload.status
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload.post],
        status: action.payload.status
      };
    case "ADD_COMMENT":
      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.post.comments, action.payload.comment]
        },
        status: action.payload.status
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload.id),
        status: action.payload.status
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== action.payload.id
          )
        }
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
    case "UPDATE_COMMENT":
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.map(comment => {
            if (action.payload.comment._id === comment._id) {
              comment.content = action.payload.comment.content;
            }
            return comment;
          })
        },
        status: action.payload.status
      };
    case "CHANGE_VOTE":
      return {
        ...state,
        posts: state.posts.map(post => {
          if (action.payload.post._id === post._id) {
            post.likes = action.payload.post.likes;
            post.dislikes = action.payload.post.dislikes;
          }
          return post;
        }),
        post: {
          ...state.post,
          likes: action.payload.post.likes,
          dislikes: action.payload.post.dislikes
        },
        status: action.payload.status
      };
    case "FOLLOW_TOPIC":
      return {
        ...state,
        user: {
          ...state.user,
          followedTopics: action.payload.user.followedTopics
        },
        status: action.payload.status
      };
    case "GET_TOPICS":
      return {
        ...state,
        topics: action.payload.topics
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
    case "COMMENT_ERROR":
      return {
        ...state,
        status: action.payload
      };
    default:
      return state;
  }
};
