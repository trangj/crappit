import { useQuery } from "react-query";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

type FollowedTopics = {
    topics_followed: [{
        title: string;
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
    return useQuery<FollowedTopics, Error>(["followed_topics"], fetchTopicFollow);
}
