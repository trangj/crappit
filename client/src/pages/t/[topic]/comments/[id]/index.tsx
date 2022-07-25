import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PostType } from 'src/types/entities/post';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import TopicModeratorCard from 'src/components/topic/TopicModeratorCard';
import SideBar from 'src/components/post/SideBar';
import TopicBanner from 'src/components/topic/TopicBanner';
import TopicRuleCard from 'src/components/topic/TopicRuleCard';
import PostSkeleton from 'src/components/util/PostSkeleton';
import TopicCardSkeleton from 'src/components/util/TopicCardSkeleton';
import { fetchComments } from '../../../../../hooks/comment-query/useComments';
import useTopic, {
  fetchTopic,
} from '../../../../../hooks/topic-query/useTopic';
import usePost, { fetchPost } from '../../../../../hooks/post-query/usePost';
import TopicPostCard from '../../../../../components/topic/TopicPostCard';
import CommentCard from '../../../../../components/comment/CommentCard';
import PostCard from '../../../../../components/post/PostCard';

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  if (!req.url?.startsWith('/_next/data')) {
    const sort = query.sort ? (query.sort as string) : '';
    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string)),
      queryClient.prefetchQuery(['post', query.id], () => fetchPost(query.id as string)),
      queryClient.prefetchInfiniteQuery(['comments', query.id, sort], () => fetchComments(query.id as string, 0, sort)),
    ]);
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }

  return {
    props: {},
  };
};

function PostPage() {
  const router = useRouter();
  const { id, topic } = router.query;
  const { data, isLoading } = usePost(id as string);
  const { data: topicData, isLoading: isTopicLoading } = useTopic(topic as string);

  return (
    <>
      {data && topicData && (
      <Head>
        <title>{`${data.title} : ${data.topic}`}</title>
        <meta
          name="description"
          content={`${data.vote} votes, ${data.number_of_comments} comments. ${
            data.type === PostType.TEXT
              ? data.content.split(' ').splice(0, 20).join(' ')
              : topicData.description.split(' ').splice(0, 20).join(' ')
          } ...`}
        />
        <meta property="og:title" content={`t/${data.topic} - ${data.title}`} />
        <meta
          property="og:type"
          content={data.type === PostType.PHOTO ? 'image' : 'website'}
        />
        {data.type === PostType.PHOTO ? (
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_IMAGE_LOADER_URL}${data.image_name}`}
            key="default"
          />
        ) : null}
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${topicData?.title}/comments/${data.id}`}
        />
        <meta
          property="og:description"
          content={`${data.vote} votes and ${data.number_of_comments} comments so far on Crappit`}
        />
      </Head>
      )}
      <div className="mt-12">
        {
          topicData && !isTopicLoading ? <TopicBanner topic={topicData} />
            : <div className="animate-pulse w-full h-36 bg-gray-200 dark:bg-gray-700 mt-12" />
        }
      </div>
      <div className="mt-4 max-w-7xl mx-auto sm:px-5 flex gap-6 justify-center">
        <div className="lg:max-w-3xl flex flex-col max-w-full w-full">
          {
              data && !isLoading ? (
                <PostCard post={data} />
              ) : (
                <PostSkeleton />
              )
            }
          <CommentCard />
        </div>
        <SideBar>
          {
              topicData && !isTopicLoading ? (
                <>
                  <TopicPostCard topicData={topicData} />
                  {topicData.rules.length !== 0 && (
                  <TopicRuleCard topicData={topicData} />
                  )}
                  <TopicModeratorCard topicData={topicData} />
                </>
              ) : (
                <TopicCardSkeleton />
              )
            }
        </SideBar>
      </div>
    </>
  );
}

export default PostPage;
