import { useQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchProfile(userid) {
	try {
		const res = await axios.get(`/api/user/${userid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useProfile(userid) {
	return useQuery(["profile", userid], () => fetchProfile(userid));
}
