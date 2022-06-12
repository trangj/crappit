import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { User } from 'src/types/entities/user';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

export async function fetchProfile(userid: string) {
  try {
    const res = await axios.get(`/api/user/${userid}`);
    return res.data.user;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useProfile(userid: string) {
  return useQuery<User, Error>(['profile', userid], () => fetchProfile(userid), {
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
