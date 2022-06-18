import { ChatAlt2Icon } from '@heroicons/react/solid';
import React from 'react';
import { InfiniteData } from 'react-query';
import { Comment } from 'src/types/entities/comment';
import { Topic } from 'src/types/entities/topic';
import CommentItem from './CommentItem';

interface Response {
  comments: Comment[],
  nextCursor: number;
}

type Props = {
  data: InfiniteData<Response>;
  topic: Topic;
};

function CommentList({ data, topic }: Props) {
  if (data.pages[0].comments.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-400 text-center">
          <ChatAlt2Icon className="w-6 h-6 inline" />
          <div className="font-semibold">No Comments Yet</div>
          <small>Be the first to share what you think!</small>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.comments.map((comment) => (
            <CommentItem comment={comment} key={comment.id} topic={topic} />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

export default CommentList;
