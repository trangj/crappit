import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Topic } from 'src/types/entities/topic';

type TopicBannerProps = {
  topic: Topic;
};

function TopicBanner({ topic }: TopicBannerProps) {
  return (
    <Link href={`/t/${topic.title}`} passHref>
      <a>
        {topic.image_url ? (
          <div className="h-36 relative">
            <Image
              alt="Topic banner"
              src={topic.image_name}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        ) : (
          <div className="w-full h-36 bg-blue-300 mt-12" />
        )}
      </a>
    </Link>
  );
}

export default TopicBanner;
