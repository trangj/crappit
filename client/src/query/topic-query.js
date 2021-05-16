import axiosConfig from "../axiosConfig";

export async function fetchTopics() {
	try {
		const res = await axiosConfig.get(`/api/index/t`);
		return res.data;
	} catch (err) {
		//
	}
}

export async function fetchTopicInfo(topic) {
	try {
		const res = await axiosConfig.get(`/api/index/t/${topic}/info`);
		return res.data;
	} catch (err) {
		//
	}
}

export function followTopic(topic) {
	return axiosConfig.post(`/api/index/t/${topic}/followtopic`);
}

export function addTopic({ formData }) {
	return axiosConfig.post(`/api/index/t`, formData);
}
