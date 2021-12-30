import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PostItem from 'src/components/post/PostItem';
import SideBar from 'src/components/post/SideBar';
import SortPost from 'src/components/post/SortPostCard';
import PostLoaderSkeleton from 'src/components/util/PostLoaderSkeleton';
import PostSkeleton from 'src/components/util/PostSkeleton';
import useSearchPosts from 'src/hooks/search-query/useSearchPosts';
import { Card } from 'src/ui/Card';
import { Container } from 'src/ui/Container';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {}
    };
};

const Search = () => {
    const router = useRouter();
    const { q, s } = router.query;
    const sort = s ? s as string : "";

    const [sortParam, setSortParam] = useState(sort);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useSearchPosts(q as string, sortParam);

    return (
        <Container>
            <Head>
                <title>crappit: search results - {q}</title>
                <meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
                <meta property="og:title" content="crappit" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/`} />
                <meta property="og:description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
            </Head>
            <div className="flex gap-6">
                <div className='w-full'>
                    <SortPost sortParam={sortParam} setSortParam={setSortParam} url={`/search?q=${q}&`} />
                    {!isLoading && data && data.pages[0].posts.length === 0 &&
                        <Card>
                            <div className='p-4 text-center'>
                                <h6 className='pb-4'>
                                    If there aren&apos;t any search results for “{q}”, does it even exist?
                                </h6>
                                <div className='content'>
                                    Looks like there aren&apos;t any results for “{q}”. Try double-checking your spelling or searching for a related topic.
                                </div>
                            </div>
                        </Card>}
                    {!isLoading && data && (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => fetchNextPage({ cancelRefetch: false })}
                            hasMore={!isError && hasNextPage}
                            loader={<PostLoaderSkeleton key="loader" />}
                        >
                            {data.pages.map((group, i) => (
                                <React.Fragment key={i}>
                                    {group.posts.map((post) => (
                                        <PostItem
                                            post={post}
                                            key={post.id}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </InfiniteScroll>
                    )}
                    {isLoading && (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    )}
                </div>
                <SideBar>

                </SideBar>
            </div>
        </Container>
    );
};

export default Search;