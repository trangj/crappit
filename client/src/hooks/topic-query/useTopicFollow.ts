import { useQuery } from "react-query";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";
import { useUser } from '../../context/UserState';

type FollowedTopics = {
    topics_followed: [{
        title: string;
        icon_image_name: string;
        icon_image_url: string;
    }];
};

async function fetchTopicFollow() {
    try {
        const res = await axios.get(`/api/topics/followed_topics`);
        return res.data;
    } catch (err) {
        throw err.response.data;
    }
}

export default function useTopicFollow() {
    const { user } = useUser();
    return useQuery<FollowedTopics, Error>(["followed_topics"], fetchTopicFollow, { enabled: !!user });
}
