import { ChatAltIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import { Comment } from 'src/types/entities/comment';
import { Button } from 'src/ui';
import { useUser } from '../../context/UserState';
import DeleteComment from './DeleteComment';
import DeleteCommentModerator from './DeleteCommentModerator';

type Props = {
    setOpenReply: (arg: boolean) => void,
    setOpenEdit: (arg: boolean) => void,
    openEdit: boolean,
    openReply: boolean,
    comment: Comment,
    topic: Topic;
};

const CommentToolBar = ({ setOpenReply, setOpenEdit, openEdit, openReply, comment, topic }: Props) => {
    const { user } = useUser();

    if (!user) {
        return (
            <Link passHref href="/login">
                <Button
                    variant="ghost"
                    border="rounded"
                    className="text-xs"
                    as="a"
                >
                    <ChatAltIcon className="h-5 w-5 mr-1" />
                    Reply
                </Button>
            </Link>
        );
    }

    return (
        <>
            <Button
                onClick={() => setOpenReply(!openReply)}
                variant="ghost"
                border="rounded"
                className="text-xs"
                icon={<ChatAltIcon className="h-5 w-5 mr-1" />}
            >
                Reply
            </Button>
            {user.id === comment.author_id && (
                <>
                    <DeleteComment comment={comment} />
                    <Button
                        onClick={() => setOpenEdit(!openEdit)}
                        variant="ghost"
                        border="rounded"
                        className="text-xs"
                    >
                        Edit
                    </Button>
                </>
            )}
            {topic &&
                user.id !== comment.author_id &&
                topic.user_moderator_id && (
                    <DeleteCommentModerator comment={comment} />
                )}
        </>
    );
};

export default CommentToolBar;
