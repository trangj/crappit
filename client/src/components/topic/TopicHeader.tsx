import React from "react";
import { useUser } from "../../context/UserState";
import useAddTopicFollow from "../../hooks/topic-query/useAddTopicFollow";
import Link from "next/link";
import { Topic } from "src/types/entities/topic";
import Image from "next/image";
import { Button } from "src/ui/Button";
import { Avatar } from "src/ui/Avatar";

type Props = {
	topic: Topic;
};

const TopicHeader = ({ topic }: Props) => {
	const { user } = useUser();
	const { isLoading, mutate } = useAddTopicFollow(topic);

	return (
		<div className="mt-12 bg-white dark:bg-gray-850">
			{topic.image_url ? (
				<div style={{ position: "relative", height: 164 }}>
					<Image
						alt="Topic banner"
						src={topic.image_name}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
					/>
				</div>
			) : (
				<div className="w-full h-24 bg-blue-300" />
			)}
			<div className="container mx-auto max-w-5xl px-5">
				<div className="flex pb-3 -mt-3.5">
					<div
						className="h-20 w-20 flex rounded-full border-4 border-white"
						style={{ zIndex: 1 }}
					>
						{!topic.icon_image_name ? (
							<Avatar />
						) : (
							<Image
								alt="topic icon"
								src={topic.icon_image_name}
								width={80}
								height={80}
								className="rounded-full"
							/>
						)}
					</div>
					<div
						className="flex mt-6 pl-4 w-full justify-between"
						style={{ width: "calc(100% - 80px)" }}
					>
						<div
							className="inline-block gap-3 min-h-10 pr-4 "
							style={{ maxWidth: "calc(100% - 96px)" }}
						>
							<h4 className="overflow-ellipsis whitespace-nowrap overflow-hidden">
								{topic.headline ? topic.headline : topic.title}
							</h4>
							<div className="text-gray-500 dark:text-gray-400 text-sm">
								t/{topic.title}
							</div>
						</div>
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
								<Button as="a" className="w-24 self-center">
									Follow
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TopicHeader;
