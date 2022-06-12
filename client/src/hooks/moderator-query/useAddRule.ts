import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Topic, Rule } from 'src/types/entities/topic';
import axios from '../../axiosConfig';

async function addRule({ topic, rule }: { topic: string, rule: Rule }) {
  try {
    const res = await axios.post(`/api/moderation/${topic}/add_rule`, {
      rule,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddRule(topic: Topic) {
  const queryClient = useQueryClient();
  return useMutation(addRule, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.rules.push(res.rule);
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
