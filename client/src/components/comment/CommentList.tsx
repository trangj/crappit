import { ChatAlt2Icon } from '@heroicons/react/solid';
import React from 'react';
import { Comment } from '../../types/entities/comment';
import { Topic } from '../../types/entities/topic';
import CommentSkeleton from '../util/CommentSkeleton';
import CommentItem from './CommentItem';

type Props = {
    isCommentsLoading: boolean,
    comments: Comment[];
    topic: Topic;
};

const CommentList = ({ isCommentsLoading, comments, topic }: Props) => {

    if (isCommentsLoading && !comments) {
        return (
            <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
            </>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-gray-400 text-center">
                    <ChatAlt2Icon className="w-6 h-6 inline" />
                    <p className="font-semibold">
                        No Comments Yet
                    </p>
                    <small>
                        Be the first to share what you think!
                    </small>
                </div>
            </div>
        );
    }

    return (
        <>
            {comments.map((comment) => (
                <CommentItem comment={comment} key={comment.id} topic={topic} />
            ))}
        </>
    );
};

export default CommentList;
