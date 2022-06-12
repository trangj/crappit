import React from 'react';
import Link from 'next/link';
import { Comment } from 'src/types/entities/comment';
import { Button } from 'src/ui/Button';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import useCommentVoting from '../../hooks/comment-query/useCommentVoting';
import { useUser } from '../../context/UserState';

type Props = {
  comment: Comment;
};

function CommentVoting({ comment }: Props) {
  const { user } = useUser();
  const { mutate } = useCommentVoting(comment);

  const handleUpvote = () => {
    mutate({
      commentId: comment.id,
      vote: 'like',
    });
  };

  const handleDownvote = () => {
    mutate({
      commentId: comment.id,
      vote: 'dislike',
    });
  };

  const getColor = () => {
    if (comment.user_vote === 1) return 'text-upvote';
    if (comment.user_vote === -1) return 'text-downvote';
    return '';
  };

  return (
    <div className="flex items-center">
      {user ? (
        <Button
          aria-label="Upvote"
          onClick={handleUpvote}
          icon={<ArrowUpIcon className="w-5 h-5" />}
          variant="ghost"
          border="rounded"
          size="sm"
          className={comment.user_vote === 1 ? 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 text-upvote dark:text-upvote' : ''}
        />
      ) : (
        <Link href="/login" passHref>
          <Button
            aria-label="Upvote"
            icon={<ArrowUpIcon className="w-5 h-5" />}
            variant="ghost"
            border="rounded"
            size="sm"
            as="a"
          />
        </Link>
      )}
      <div className={
        `mx-0.5 text-xs font-bold self-center ${user ? getColor() : ''}`
      }
      >
        {comment.vote}
      </div>
      {user ? (
        <Button
          aria-label="Upvote"
          onClick={handleDownvote}
          icon={<ArrowDownIcon className="w-5 h-5" />}
          variant="ghost"
          border="rounded"
          size="sm"
          className={comment.user_vote === -1 ? 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 text-downvote dark:text-downvote' : ''}
        />
      ) : (
        <Link passHref href="/login">
          <Button
            aria-label="Upvote"
            icon={<ArrowDownIcon className="w-5 h-5" />}
            variant="ghost"
            border="rounded"
            size="sm"
            as="a"
          />
        </Link>
      )}
    </div>
  );
}

export default CommentVoting;
