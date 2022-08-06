import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Rule, Topic } from 'src/types/entities/topic';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  rule: Rule;
}

interface MutationParams {
  topic: string
  rule: Rule
}

async function deleteRule({ topic, rule }: MutationParams) {
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
  return useMutation<MutationResponse, Error, MutationParams>(deleteRule, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.rules = initialData.rules.filter(
          (rule: Rule) => rule.created_at !== res.rule.created_at,
        );
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
