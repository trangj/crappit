import axiosConfig from "../axiosConfig";

export async function fetchPost(topic, id) {
	try {
		const res = await axiosConfig.get(`/api/index/t/${topic}/p/${id}`);
		return res.data.post;
	} catch (err) {
		//
	}
}

export async function fetchTopic(topic, pageParam) {
	try {
		const res = await axiosConfig.get(
			`/api/index/t/${topic}?skip=${pageParam}`
		);
		return res.data;
	} catch (err) {
		//
	}
}

export async function fetchPosts(pageParam) {
	try {
		const res = await axiosConfig.get(`/api/index?skip=${pageParam}`);
		return res.data;
	} catch (err) {
		//
	}
}

export function addPost({ topic, formData }) {
	return axiosConfig.post(`/api/index/t/${topic}/p`, formData);
}

export function updatePost({ topic, postid, newPost }) {
	return axiosConfig.put(`/api/index/t/${topic}/p/${postid}`, newPost);
}

export function deletePost({ topic, postid }) {
	return axiosConfig.delete(`/api/index/t/${topic}/p/${postid}`);
}

export function voting({ topic, id, vote }) {
	return axiosConfig.put(
		`/api/index/t/${topic}/p/${id}/changevote?vote=${vote}`
	);
}
