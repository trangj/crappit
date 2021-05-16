import axiosConfig from "../axiosConfig";

export function updateComment({ topic, postid, commentid, newComment }) {
	return axiosConfig.put(
		`/api/index/t/${topic}/p/${postid}/c/${commentid}`,
		newComment
	);
}

export function deleteComment({ topic, postid, commentid }) {
	return axiosConfig.delete(`/api/index/t/${topic}/p/${postid}/c/${commentid}`);
}

export function commentVoting({ topic, postid, commentid, vote }) {
	return axiosConfig.put(
		`/api/index/t/${topic}/p/${postid}/c/${commentid}/changevote?vote=${vote}`
	);
}

export function addReply({ topic, postid, commentid, reply }) {
	return axiosConfig.post(
		`/api/index/t/${topic}/p/${postid}/c/${commentid}/reply`,
		reply
	);
}

export function addComment({ topic, postid, newComment }) {
	return axiosConfig.post(`/api/index/t/${topic}/p/${postid}`, newComment);
}
