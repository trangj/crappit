import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import TopicCard from 'src/components/topic/TopicCard';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import PostSkeleton from 'src/components/util/PostSkeleton';
import PostLoaderSkeleton from 'src/components/util/PostLoaderSkeleton';
import TopicModeratorCard from 'src/components/topic/TopicModeratorCard';
import SortPost from 'src/components/post/SortPostCard';
import SideBar from 'src/components/post/SideBar';
import CreatePost from 'src/components/post/CreatePostCard';
import TopicRuleCard from 'src/components/topic/TopicRuleCard';
import TopicCardSkeleton from 'src/components/util/TopicCardSkeleton';
import { Container } from 'src/ui/Container';
import useTopic, { fetchTopic } from '../../../hooks/topic-query/useTopic';
import usePosts, { fetchPosts } from '../../../hooks/post-query/usePosts';
import TopicHeader from '../../../components/topic/TopicHeader';
import PostItem from '../../../components/post/PostItem';

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  if (!req.url?.startsWith('/_next/data')) {
    const sort = query.sort ? (query.sort as string) : '';
    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string)),
      queryClient.prefetchInfiniteQuery(['posts', query.topic, sort], () => fetchPosts(query.topic as string, 0, sort)),
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

function TopicPage() {
  const router = useRouter();
  const { topic } = router.query;
  const sort = router.query.sort ? (router.query.sort as string) : '';
  const [sortParam, setSortParam] = useState(sort);
  const {
    data, fetchNextPage, hasNextPage, isLoading, isError,
  } = usePosts(
    topic as string,
    sortParam,
  );
  const { data: topicData, isLoading: isTopicLoading } = useTopic(topic as string);

  return (
    <>
      {topicData && (
      <Head>
        <title>{topicData?.headline || topicData?.title}</title>
        <meta
          name="description"
          content={`t/${topicData?.title}: ${topicData?.description
            .split(' ')
            .splice(0, 20)
            .join(' ')} ...`}
        />
        <meta property="og:title" content={`t/${topicData?.title}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${topicData?.title}`}
        />
        <meta
          property="og:description"
          content={`${topicData?.description
            .split(' ')
            .splice(0, 20)
            .join(' ')} ...`}
        />
      </Head>
      )}
      {
        topicData && !isTopicLoading ? <TopicHeader topic={topicData} />
          : (
            <div className="bg-white dark:bg-gray-850 h-56">
              <div className="animate-pulse w-full h-36 bg-gray-200 dark:bg-gray-700 mt-12" />
            </div>
          )
      }
      <Container className="pt-0 flex justify-center gap-6" topPadding="mt-4">
        <div className="lg:max-w-2xl max-w-full w-full">
          <CreatePost url={`/t/${topicData?.title}`} />
          <SortPost
            sortParam={sortParam}
            setSortParam={setSortParam}
            url={`/t/${topicData?.title}?`}
          />
          {!isLoading && data ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={() => fetchNextPage({ cancelRefetch: false })}
              hasMore={!isError && hasNextPage}
              loader={<PostLoaderSkeleton key="loader" />}
            >
              {data.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.posts.map((post) => (
                    <PostItem post={post} key={post.id} />
                  ))}
                </React.Fragment>
              ))}
            </InfiniteScroll>
          ) : (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
        </div>
        <SideBar>
          {
              topicData && !isTopicLoading ? (
                <>
                  <TopicCard topicData={topicData} />
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
      </Container>
    </>
  );
}

export default TopicPage;
