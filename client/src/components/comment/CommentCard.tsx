import React, { useState } from 'react';
import { Post } from 'src/types/entities/post';
import { Topic } from 'src/types/entities/topic';
import { useRouter } from 'next/router';
import useComments from '../../hooks/comment-query/useComments';
import { Card } from '../../ui/Card';
import { Divider } from '../../ui/Divider';
import AddComment from './AddComment';
import CommentList from './CommentList';
import SortComment from './SortComment';
import CommentSkeleton from '../util/CommentSkeleton';

type Props = {
  post: Post;
  topic: Topic;
};

function CommentCard({ post, topic }: Props) {
  const router = useRouter();

  const sort = router.query.sort ? (router.query.sort as string) : '';

  const [sortParam, setSortParam] = useState(sort);
  const {
    data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useComments(
    String(post.id),
    sortParam,
  );

  return (
    <Card id="comments" className="p-3">
      <div className="mx-6">
        <AddComment post={post} sortParam={sortParam} />
        <SortComment
          post={post}
          topic={topic}
          sortParam={sortParam}
          setSortParam={setSortParam}
        />
        <Divider className="mb-8 mt-1" />
      </div>
      {
        data && !isLoading ? (
          <CommentList
            data={data}
            topic={topic}
          />
        ) : (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )
      }
      {hasNextPage && (
      <button className="font-medium text-blue-600 dark:text-blue-400 text-xs capitalize" type="button" onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? 'Loading...' : 'Load more'}
      </button>
      )}
    </Card>
  );
}

export default CommentCard;
