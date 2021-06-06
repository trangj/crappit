import { createStandaloneToast } from "@chakra-ui/toast";
import { useContext } from "react";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { UserContext } from "../../context/UserState";

async function followTopic(topic) {
	try {
		const res = await axios.post(`/api/topic/${topic}/followtopic`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopicsFollow(topic) {
	const { user, setUser } = useContext(UserContext);
	return useMutation(followTopic, {
		onSuccess: (res) => {
			topic.user_followed_id = res.user_followed_id;
			if (res.user_followed_id) {
				setUser({
					...user,
					topics_followed: [...user.topics_followed, { title: res.topic }],
				});
			} else {
				setUser({
					...user,
					topics_followed: user.topics_followed.filter(
						(topic) => topic.title !== res.topic
					),
				});
			}
		},
		onSettled: (data, error) => {
			const res = data || error;
			const toast = createStandaloneToast();
			toast({
				description: res.status.text,
				status: res.status.severity,
			});
		},
	});
}
