import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
  comment: Comment;
}

async function addComment({ newComment }: { newComment: Comment; }) {
  try {
    const res = await axios.post('/api/comment', newComment);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddComment(id: string, sortParam: string) {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, any, any>(addComment, {
    onSuccess: (res) => {
      queryClient.setQueryData(['comments', id, sortParam], (initialData: any) => {
        initialData.pages[0].comments = [res.comment, ...initialData.pages[0].comments];
        return initialData;
      });
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
