import axiosConfig from "../axiosConfig";

export async function fetchProfile(userid) {
	try {
		const res = await axiosConfig.get(`/api/user/u/${userid}`);
		return res.data;
	} catch (err) {
		//
	}
}
