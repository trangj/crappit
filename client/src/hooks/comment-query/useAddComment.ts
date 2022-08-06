import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutateResponse extends Response {
  comment: Comment;
}

interface MutateParams {
  newComment: {
    content: string,
    postId: string
  }
}

async function addComment({ newComment } : MutateParams) {
  try {
    const res = await axios.post('/api/comment', newComment);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddComment(id: string) {
  const queryClient = useQueryClient();
  return useMutation<MutateResponse, Error, MutateParams>(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
