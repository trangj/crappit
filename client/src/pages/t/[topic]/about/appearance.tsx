import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { QueryClient, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Head from 'next/head';
import { useUser } from 'src/context/UserState';
import useTopic, { fetchTopic } from 'src/hooks/topic-query/useTopic';
import ModeratorLayout from 'src/components/moderator/ModeratorLayout';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { NextPageWithLayout } from 'src/pages/_app';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const TopicAppearance : NextPageWithLayout = function () {
  const router = useRouter();
  const { topic } = router.query;
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );

  if (topicLoading || !topicData) return <div>Loading...</div>;

  if (topicData.user_moderator_id !== user?.id) {
    return (
      <>
        <Head>
          <title>{topicData.title}</title>
        </Head>
        <div className="fixed inset-y-1/2 w-full text-center">
          You must be a moderator of t/
          {topicData.title}
          {' '}
          to view this page
        </div>
      </>
    );
  }

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
