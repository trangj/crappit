import axiosConfig from "../axiosConfig";

export async function fetchPost(topic, id) {
	try {
		const res = await axiosConfig.get(`/api/index/t/${topic}/p/${id}`);
		return res.data.post;
	} catch (err) {
		throw err.response.data;
	}
}

export async function fetchTopic(topic, pageParam) {
	try {
		const res = await axiosConfig.get(
			`/api/index/t/${topic}?skip=${pageParam}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function fetchPosts(pageParam) {
	try {
		const res = await axiosConfig.get(`/api/index?skip=${pageParam}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function addPost({ topic, formData }) {
	try {
		const res = await axiosConfig.post(`/api/index/t/${topic}/p`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function updatePost({ topic, postid, newPost }) {
	try {
		const res = await axiosConfig.put(
			`/api/index/t/${topic}/p/${postid}`,
			newPost
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function deletePost({ topic, postid }) {
	try {
		const res = await axiosConfig.delete(`/api/index/t/${topic}/p/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function voting({ topic, id, vote }) {
	try {
		const res = await axiosConfig.put(
			`/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
