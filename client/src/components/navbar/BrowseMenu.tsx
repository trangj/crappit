import React from "react";
import { Menu } from '@headlessui/react';
import Link from "next/link";
import { User } from "src/types/entities/user";
import useTopicFollow from '../../hooks/topic-query/useTopicFollow';
import { ChevronDownIcon } from "@heroicons/react/outline";

type Props = {
	user: User | null;
};

const BrowseMenu = ({ user }: Props) => {
	const { data, isLoading } = useTopicFollow();
	return (
		<Menu as="div" className="relative hidden sm:inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className={`flex text-sm gap-2 items-center border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left px-3 rounded border w-64 h-10 font-medium ${open ? 'border-gray-200 dark:border-gray-700 rounded-b-none' : ''}`}>
						Browse
						<div className="h-6 w-6 ml-auto">
							<ChevronDownIcon />
						</div>
					</Menu.Button>
					<Menu.Items className="absolute w-64 left-0 origin-top-right border-t-0 border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 rounded-b flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll">
						<Menu.Item>
							<Link passHref href="/">
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Home
								</a>
							</Link>
						</Menu.Item>
						<Menu.Item >
							<Link passHref href="/t">
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Discover Topics
								</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link passHref href="/submit">
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Create a post
								</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link passHref href="/t/submit">
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Create a topic
								</a>
							</Link>
						</Menu.Item>
						{!user ? (
							<Menu.Item>
								<Link passHref href="/register">
									<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
										Sign up to follow topics!
									</a>
								</Link>
							</Menu.Item>
						) : (
							!isLoading && data && (<>
								{data.topics_followed.map((topic, i) => (
									<Menu.Item key={i}>
										<Link passHref href={`/t/${topic.title}`}>
											<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
												t/{topic.title}
											</a>
										</Link>
									</Menu.Item>
								))}
							</>)
						)}
					</Menu.Items>
				</>
			)}
		</Menu>
	);
};

export default BrowseMenu;
