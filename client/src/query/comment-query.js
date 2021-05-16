import axiosConfig from "../axiosConfig";

export async function updateComment({ topic, postid, commentid, newComment }) {
	try {
		const res = await axiosConfig.put(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}`,
			newComment
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function deleteComment({ topic, postid, commentid }) {
	try {
		const res = await axiosConfig.delete(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function commentVoting({ topic, postid, commentid, vote }) {
	try {
		const res = await axiosConfig.put(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}/changevote?vote=${vote}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function addReply({ topic, postid, commentid, reply }) {
	try {
		const res = await axiosConfig.post(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}/reply`,
			reply
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function addComment({ topic, postid, newComment }) {
	try {
		const res = await axiosConfig.post(
			`/api/index/t/${topic}/p/${postid}`,
			newComment
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
