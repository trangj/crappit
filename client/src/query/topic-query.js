import axiosConfig from "../axiosConfig";

export async function fetchTopics() {
	try {
		const res = await axiosConfig.get(`/api/index/t`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function fetchTopicInfo(topic) {
	try {
		const res = await axiosConfig.get(`/api/index/t/${topic}/info`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function followTopic(topic) {
	try {
		const res = await axiosConfig.post(`/api/index/t/${topic}/followtopic`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export async function addTopic({ formData }) {
	try {
		const res = await axiosConfig.post(`/api/index/t`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
