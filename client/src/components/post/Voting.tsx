import React from 'react';
import Link from 'next/link';
import { Post } from 'src/types/entities/post';
import { Button } from 'src/ui/Button';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import useVoting from '../../hooks/post-query/useVoting';
import { useUser } from '../../context/UserState';

type Props = {
  post: Post;
  orientation?: 'vertical' | 'horizontal';
};

function Voting({ post, orientation = 'vertical' }: Props) {
  const { user } = useUser();
  const { mutate } = useVoting(post);

  const handleUpvote = () => {
    mutate({ id: post.id, vote: 'like' });
  };

  const handleDownvote = () => {
    mutate({ id: post.id, vote: 'dislike' });
  };

  const getColor = () => {
    if (post.user_vote === 1) return 'text-upvote';
    if (post.user_vote === -1) return 'text-downvote';
    return '';
  };

  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : ''}`}>
      {user ? (
        <Button
          aria-label="Upvote"
          onClick={handleUpvote}
          icon={<ArrowUpIcon className="w-5 h-5" />}
          variant="ghost"
          border="rounded"
          size="sm"
          className={post.user_vote === 1 ? 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 text-upvote dark:text-upvote' : ''}
        />
      ) : (
        <Link passHref href="/login">
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
        {post.vote}
      </div>
      {user ? (
        <Button
          aria-label="Upvote"
          onClick={handleDownvote}
          icon={<ArrowDownIcon className="w-5 h-5" />}
          variant="ghost"
          size="sm"
          border="rounded"
          className={post.user_vote === -1 ? 'bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 text-downvote dark:text-downvote' : ''}
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

export default Voting;
