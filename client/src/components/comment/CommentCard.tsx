import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useComments from '../../hooks/comment-query/useComments';
import { Card } from '../../ui/Card';
import { Divider } from '../../ui/Divider';
import AddComment from './AddComment';
import CommentList from './CommentList';
import SortComment from './SortComment';
import CommentSkeleton from '../util/CommentSkeleton';

function CommentCard() {
  const router = useRouter();
  const { id: post, topic } = router.query;
  const sort = router.query.sort ? (router.query.sort as string) : '';
  const [sortParam, setSortParam] = useState(sort);
  const {
    data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useComments(
    post as string,
    sortParam,
  );

  return (
    <Card id="comments" className="p-3">
      <div className="mx-6">
        <AddComment post={post as string} />
        <SortComment
          post={post as string}
          topic={topic as string}
          sortParam={sortParam}
          setSortParam={setSortParam}
        />
        <Divider className="mb-8 mt-1" />
      </div>
      {
        data && !isLoading ? (
          <CommentList
            data={data}
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
