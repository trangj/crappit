import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Topic } from 'src/types/entities/topic';
import { Card } from 'src/ui/Card';
import { Avatar } from 'src/ui/Avatar';
import { Button } from 'src/ui/Button';
import { Divider } from 'src/ui/Divider';
import axios from '../../axiosConfig';

function ExploreTopicCard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/topics/top');
        setLoading(false);
        setTopics(res.data.top_topics);
      } catch (err) {
        //
      }
    };
    fetchTopics();
  }, []);

  return (
    <Card>
      {!loading && topics
        ? (
          <div className={`relative h-20 ${topics.length && !topics[0].image_url && 'bg-blue-400'}`}>
            {
              topics.length && topics[0].image_url ? (
                <Image
                  alt="Topic banner"
                  src={topics[0].image_name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              ) : null
            }
            <div className="h-full w-full absolute bg-gradient-to-t from-white dark:from-gray-850" />
            <h6 className="absolute bottom-2 left-4 font-medium text-base">Top Communities</h6>
          </div>
        )
        : (
          <div className="h-20 bg-gray-200 dark:bg-gray-700" />
        )}
      <ol>
        {!loading && topics ? topics.map((topic, ind) => (
          <li key={ind} className="border-b border-gray-300 dark:border-gray-700">
            <Link href={`/t/${topic.title}`} passHref>
              <a className="flex items-center h-12 px-3 justify-between">
                <div className="flex items-center">
                  <span className="font-medium w-5 text-right">{ind + 1}</span>
                  <div className="h-8 w-8 flex rounded-full mx-2">
                    {!topic.icon_image_name ? <Avatar /> : <Image alt="topic icon" src={topic.icon_image_name} width={32} height={32} className="rounded-full bg-white" />}
                  </div>
                  <span className="">
                    <span className="font-medium text-sm">
                      t/
                      {topic.title}
                    </span>
                  </span>
                </div>
              </a>
            </Link>
          </li>
        )) : (
          <div className="animate-pulse flex flex-col">
            {Array.from({ length: 5 }, (_, i) => (
              <React.Fragment key={i}>
                <div className="flex gap-2 m-2">
                  <div className="h-8 w-8 flex-none rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <Divider />
              </React.Fragment>
            ))}
          </div>
        )}
      </ol>
      <Link href="/t" passHref>
        <Button
          className="m-3"
          variant="filled"
          as="a"
        >
          View All
        </Button>
      </Link>
    </Card>
  );
}

export default ExploreTopicCard;
