import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Rule, Topic } from 'src/types/entities/topic';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  rule: {
    content: string,
    updated_at: Date,
  };
}

interface MutationParams {
  topic: string
  rule: Rule
}

async function addRule({ topic, rule }: MutationParams) {
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
  return useMutation<MutationResponse, Error, MutationParams>(addRule, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.rules.push(res.rule);
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
