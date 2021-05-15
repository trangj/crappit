import React, { createContext, useReducer } from "react";
import axiosConfig from "../axiosConfig";
import AppReducer from "./AppReducer";

const initialState = {
	user: undefined,
	loading: true,
	status: undefined,
	posts: [],
	post: {},
	topics: [],
	topic: {},
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	async function fetchTopics() {
		try {
			dispatch({ type: "SET_LOADING" });
			const res = await axiosConfig.get(`/api/index/t`);
			dispatch({
				type: "GET_TOPICS",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "TOPIC_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function fetchTopic(topic) {
		try {
			dispatch({ type: "SET_LOADING" });
			const res = await axiosConfig.get(`/api/index/t/${topic}?skip=0`);
			if (!res.data.topic) throw Error("No topic exists");
			dispatch({
				type: "GET_TOPIC",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function moreTopic(topic, length) {
		try {
			const res = await axiosConfig.get(`/api/index/t/${topic}?skip=${length}`);
			if (!res.data.topic) throw Error("No topic exists");
			dispatch({
				type: "MORE_TOPIC",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function fetchPosts() {
		try {
			dispatch({ type: "SET_LOADING" });
			const res = await axiosConfig.get(`/api/index?skip=0`);
			dispatch({
				type: "GET_POSTS",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function morePosts(length) {
		try {
			const res = await axiosConfig.get(`/api/index?skip=${length}`);
			dispatch({
				type: "MORE_POSTS",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function fetchPost(topic, id) {
		try {
			dispatch({ type: "SET_LOADING" });
			const res = await axiosConfig.get(`/api/index/t/${topic}/p/${id}`);
			if (!res.data.post) throw Error("No post exists");
			dispatch({
				type: "GET_POST",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function fetchUser() {
		try {
			const res = await axiosConfig.get(`/api/user`);
			dispatch({
				type: "GET_USER",
				payload: res.data.user,
			});
		} catch (err) {
			dispatch({
				type: "USER_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	function logoutUser() {
		localStorage.removeItem("token");
		dispatch({
			type: "LOGOUT_USER",
			payload: undefined,
		});
	}

	async function loginUser(user) {
		try {
			const res = await axiosConfig.post(`/api/user/login`, user);
			localStorage.setItem("token", res.data.token);
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
			return "success";
		} catch (err) {
			dispatch({
				type: "USER_ERROR",
				payload: err.response.data.status,
			});
			return "error";
		}
	}

	async function registerUser(user) {
		try {
			const res = await axiosConfig.post(`/api/user/register`, user);
			localStorage.setItem("token", res.data.token);
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
			return "success";
		} catch (err) {
			dispatch({
				type: "USER_ERROR",
				payload: err.response.data.status,
			});
			return "error";
		}
	}

	async function addTopic(formData) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.post(`/api/index/t`, formData);
			dispatch({
				type: "ADD_TOPIC",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "TOPIC_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function addPost(topic, formData) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.post(`/api/index/t/${topic}/p`, formData);
			dispatch({
				type: "ADD_POST",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function addComment(topic, id, newComment) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.post(
				`/api/index/t/${topic}/p/${id}`,
				newComment
			);
			dispatch({
				type: "ADD_COMMENT",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "COMMENT_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function addReply(topic, id, commentid, newReply) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.post(
				`/api/index/t/${topic}/p/${id}/c/${commentid}/reply`,
				newReply
			);
			dispatch({
				type: "ADD_REPLY",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "COMMENT_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function deletePost(topic, id) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.delete(`/api/index/t/${topic}/p/${id}`);
			dispatch({
				type: "DELETE_POST",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function deleteComment(topic, id, commentid) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.delete(
				`/api/index/t/${topic}/p/${id}/c/${commentid}`
			);
			console.log(res.data);
			dispatch({
				type: "DELETE_COMMENT",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "COMMENT_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function updatePost(topic, id, newPost) {
		try {
			dispatch({ type: "CLEAR_STATUS" });

			const res = await axiosConfig.put(
				`/api/index/t/${topic}/p/${id}`,
				newPost
			);
			dispatch({
				type: "UPDATE_POST",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "POST_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function updateComment(topic, postid, commentid, newComment) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.put(
				`/api/index/t/${topic}/p/${postid}/c/${commentid}`,
				newComment
			);
			dispatch({
				type: "UPDATE_COMMENT",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "COMMENT_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function changeVote(topic, id, vote) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.put(
				`/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`
			);
			dispatch({
				type: "CHANGE_VOTE",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "VOTE_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function changeCommentVote(topic, postid, commentid, vote) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.put(
				`/api/index/t/${topic}/p/${postid}/c/${commentid}/changevote?vote=${vote}`
			);
			dispatch({
				type: "CHANGE_COMMENT_VOTE",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "VOTE_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function followTopic(topic) {
		try {
			dispatch({ type: "CLEAR_STATUS" });
			const res = await axiosConfig.post(`/api/index/t/${topic}/followtopic`);
			dispatch({
				type: "FOLLOW_TOPIC",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "FOLLOW_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	function setStatus(status) {
		dispatch({
			type: "SET_STATUS",
			payload: status,
		});
	}

	return (
		<GlobalContext.Provider
			value={{
				posts: state.posts,
				post: state.post,
				user: state.user,
				status: state.status,
				topics: state.topics,
				topic: state.topic,
				loading: state.loading,
				fetchUser,
				loginUser,
				logoutUser,
				registerUser,
				fetchTopics,
				fetchTopic,
				moreTopic,
				fetchPosts,
				morePosts,
				fetchPost,
				addPost,
				addComment,
				addReply,
				addTopic,
				updatePost,
				updateComment,
				deletePost,
				deleteComment,
				changeVote,
				changeCommentVote,
				followTopic,
				setStatus,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
