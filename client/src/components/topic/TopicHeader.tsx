import React from "react";
import { useUser } from "../../context/UserState";
import useAddTopicFollow from "../../hooks/topic-query/useAddTopicFollow";
import Link from "next/link";
import { Topic } from "src/types/entities/topic";
import Image from 'next/image';
import { Button } from "src/ui";
import { Avatar } from "src/ui";

type Props = {
	topic: Topic;
};

const TopicHeader = ({ topic }: Props) => {
	const { user } = useUser();
	const { isLoading, mutate } = useAddTopicFollow(topic);

	return (
		<div className="mt-12">
			{topic.image_url ? (
				<div style={{ position: 'relative', height: 96, zIndex: -10 }}>
					<Image
						alt="Topic banner"
						src={topic.image_name}
						layout="fill"
						objectFit="cover"
					/>
				</div>
			) : (
				<div className="w-full h-24 bg-blue-300" />
			)}
			<div className="bg-white dark:bg-gray-850 pt-4 px-4 pb-2">
				<div className="flex gap-6 -mt-6 container mx-auto max-w-5xl">
					<Avatar className="h-16 w-16 sm:inline-block hidden" />
					<div className="flex flex-col mt-4">
						<div className="flex gap-3">
							<h4>
								{topic.headline ? topic.headline : topic.title}
							</h4>
							{user ? (
								<Button
									loading={isLoading}
									onClick={() => mutate(topic.title)}
									variant={topic.user_followed_id ? "outline" : "filled"}
									className="w-24 self-center"
								>
									{topic.user_followed_id ? "Unfollow" : "Follow"}
								</Button>
							) : (
								<Link passHref href="/login">
									<Button
										as="a"
										className="w-24 self-center"
									>
										Follow
									</Button>
								</Link>
							)}
						</div>
						<p className="text-gray-500 dark:text-gray-400">t/{topic.title}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopicHeader;
