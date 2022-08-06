import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useQueryClient } from 'react-query';
import Head from 'next/head';
import useTopic from 'src/hooks/topic-query/useTopic';
import ModeratorLayout from 'src/components/moderator/ModeratorLayout';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';
import axios from 'src/axiosConfig';
import toast from 'react-hot-toast';
import type { NextPageWithLayout } from 'src/pages/_app';

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const TopicAppearance : NextPageWithLayout = function () {
  const router = useRouter();
  const { topic } = router.query;
  const queryClient = useQueryClient();
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );

  if (topicLoading || !topicData) return <div>Loading...</div>;
  if (!topicData.can_manage_settings) {
    return (
      <Card className="p-3 flex flex-col gap-3 ml-64">
        You do not have permission.
      </Card>
    );
  }

  const handleIcon : React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      if (!e.target.files) throw Error('No file was selected.');
      const file = e.target.files[0];
      if (
        file.type !== 'image/png'
        && file.type !== 'image/jpg'
        && file.type !== 'image/jpeg'
      ) throw Error('Invalid file type');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        `/api/moderation/${topicData.title}/icon`,
        formData,
      );
      queryClient.setQueryData(['topic', topicData.title], (initalData: any) => {
        initalData.icon_image_url = res.data.topic.icon_image_url;
        initalData.icon_image_name = res.data.topic.icon_image_name;
        return initalData;
      });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBanner : React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      if (!e.target.files) throw Error('No file was selected.');
      const file = e.target.files[0];
      if (
        file.type !== 'image/png'
        && file.type !== 'image/jpg'
        && file.type !== 'image/jpeg'
      ) throw Error('Invalid file type');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        `/api/moderation/${topicData.title}/banner`,
        formData,
      );
      queryClient.setQueryData(['topic', topicData.title], (initalData: any) => {
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
      <Head>
        <title>{topicData.title}</title>
      </Head>
      <Card className="p-3 flex flex-col gap-3 ml-64">
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
      </Card>
    </>
  );
};

TopicAppearance.getLayout = function getLayout(page) {
  return (
    <ModeratorLayout>
      {page}
    </ModeratorLayout>
  );
};

export default TopicAppearance;
