import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Post } from 'src/types/entities/post';
import { ChatAltIcon, ExternalLinkIcon, ReplyIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Avatar } from 'src/ui/Avatar';
import { useRouter } from 'next/router';
import ToolTip from 'src/ui/ToolTip';
import Embed from 'src/ui/Embed';
import { Button } from '../../ui/Button';
import { LinkCard, LinkCardOverlay } from '../../ui/LinkCard';
import Voting from './Voting';

type Props = {
  post: Post;
};

function PostItem({ post, ...props }: Props) {
  const router = useRouter();

  return (
    <LinkCard {...props} className="flex">
      <div className="pb-auto p-1 dark:bg-gray-900 bg-gray-50 hidden sm:flex">
        <Voting post={post} />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full p-2 pb-0">
          <small className="flex mb-2 items-center">
            {
              router.route !== '/t/[topic]'
            && (
            <Link passHref href={`/t/${post.topic}`}>
              <a className="h-5 w-5 flex-none mr-1">
                {!post.icon_image_name ? (
                  <Avatar />
                ) : (
                  <Image
                    alt="user avatar"
                    src={post.icon_image_name}
                    width={20}
                    height={20}
                    className="rounded-full bg-white"
                  />
                )}
              </a>
            </Link>
            )
            }
            <Link passHref href={`/t/${post.topic}`}>
              <a className="font-bold">
                t/
                {post.topic}
              </a>
            </Link>
            {' '}
            <div className="text-gray-500 dark:text-gray-400 ml-1">
              &bull; Posted by
              {' '}
              <Link passHref href={`/user/${post.author_id}`}>
                <a>
                  u/
                  {post.author}
                </a>
              </Link>
              {' '}
              <ToolTip className="inline" title={dayjs(post.created_at).format('llll')}>
                {dayjs(post.created_at).fromNow()}
              </ToolTip>
            </div>
          </small>
          <h6 className="font-medium">
            <Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
              <LinkCardOverlay>{post.title}</LinkCardOverlay>
            </Link>
          </h6>
          {post.type === 'text' && post.content && (
          <div
            className="pb-2 pt-1 content content-overlay"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          )}
        </div>
        {post.type === 'link' && (
        <div>
          <a
            href={post.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-xs px-2"
          >
            {`${post.content.slice(0, 30)}...`}
            <ExternalLinkIcon className="h-4 w-4 inline" />
          </a>
          <Embed url={post.content} />
        </div>
        )}
        {post.type === 'photo' && (
        <Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
          <a className="self-center mt-2">
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_LOADER_URL}${post.image_name}?auto=format&w=1920`}
              alt="post media"
              style={{ maxHeight: 512 }}
            />
          </a>
        </Link>
        )}
        <div className="flex px-2 mt-1">
          <div className="flex items-center sm:hidden">
            <Voting post={post} orientation="horizontal" />
          </div>
          <Link passHref href={`/t/${post.topic}/comments/${post.id}#comments`}>
            <Button
              variant="ghost"
              border="rounded"
              className="text-xs"
              size="lg"
              as="a"
              icon={<ChatAltIcon className="h-5 w-5 mr-1" />}
            >
              {post.number_of_comments}
              {post.number_of_comments === 1 ? ' Comment' : ' Comments'}
            </Button>
          </Link>
          <Button
            variant="ghost"
            border="rounded"
            className="text-xs"
            size="lg"
            icon={<ReplyIcon className="h-5 w-5 mr-1" />}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${post.topic}/comments/${post.id}`,
              );
              toast.success('Copied link!');
            }}
          >
            Share
          </Button>
        </div>
      </div>
    </LinkCard>
  );
}

export default PostItem;
