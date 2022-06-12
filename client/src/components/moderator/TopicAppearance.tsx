import React from 'react';
import { Divider } from 'src/ui/Divider';
import { Topic } from 'src/types/entities/topic';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import axios from '../../axiosConfig';

type TopicAppearanceProps = {
  topic: Topic;
};

function TopicAppearance({ topic }: TopicAppearanceProps) {
  const queryClient = useQueryClient();

  const handleIcon = async (e: any) => {
    try {
      const file = e.target.files[0];
      if (
        file.type !== 'image/png'
        && file.type !== 'image/jpg'
        && file.type !== 'image/jpeg'
      ) throw Error('Invalid file type');
      const formData = new FormData();
      formData.append('file', file);
      const res: any = await axios.post(
        `/api/moderation/${topic.title}/icon`,
        formData,
      );
      queryClient.setQueryData(['topic', topic.title], (initalData: any) => {
        initalData.icon_image_url = res.data.topic.icon_image_url;
        initalData.icon_image_name = res.data.topic.icon_image_name;
        return initalData;
      });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBanner = async (e: any) => {
    try {
      const file = e.target.files[0];
      if (
        file.type !== 'image/png'
        && file.type !== 'image/jpg'
        && file.type !== 'image/jpeg'
      ) throw Error('Invalid file type');
      const formData = new FormData();
      formData.append('file', file);
      const res: any = await axios.post(
        `/api/moderation/${topic.title}/banner`,
        formData,
      );
      queryClient.setQueryData(['topic', topic.title], (initalData: any) => {
        initalData.image_url = res.data.topic.image_url;
        initalData.image_name = res.data.topic.image_name;
        return initalData;
      });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <h5>Topic Appearance</h5>
      <Divider className="my-1" />
      <div className="font-medium">Topic Icon</div>
      <input type="file" accept=".png,.jpg,.jpeg" onChange={handleIcon} />
      <small className="text-gray-500 dark:text-gray-400">
        Required Size: 256x256px
      </small>
      <div className="font-medium">Topic Banner</div>
      <input type="file" accept=".png,.jpg,.jpeg" onChange={handleBanner} />
      <small className="text-gray-500 dark:text-gray-400">
        Recommended upload size: 4,000x128px
      </small>
    </>
  );
}

export default TopicAppearance;
