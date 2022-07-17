import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Rule, Topic } from 'src/types/entities/topic';
import axios from '../../axiosConfig';

async function deleteRule({ topic, rule }: { topic: string, rule: Rule; }) {
  try {
    const res = await axios.post(`/api/moderation/${topic}/delete_rule`, {
      rule,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteRule(topic: Topic) {
  const queryClient = useQueryClient();
  return useMutation(deleteRule, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.rules = initialData.rules.filter(
          (rule: any) => rule.created_at !== res.rule.created_at,
        );
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
