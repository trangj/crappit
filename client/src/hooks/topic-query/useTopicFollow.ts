import { useQuery } from 'react-query';
import { TopicsFollowed } from 'src/types/entities/user';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';
import { useUser } from '../../context/UserState';

type FollowedTopics = {
    topics_followed: TopicsFollowed[];
};

async function fetchTopicFollow() {
  try {
    const res = await axios.get('/api/topics/followed_topics');
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useTopicFollow() {
  const { user } = useUser();
  return useQuery<FollowedTopics, Error>(['followed_topics'], fetchTopicFollow, { enabled: !!user, staleTime: Infinity });
}
