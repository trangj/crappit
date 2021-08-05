import React, { ReactNode } from "react";
import { Menu } from '@headlessui/react';
import Link from "next/link";
import { User } from "src/types/entities/user";
import useTopicFollow from '../../hooks/topic-query/useTopicFollow';
import { ChevronDownIcon, PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Avatar } from "src/ui/Avatar";
import { Divider } from 'src/ui/Divider';
import { HomeIcon } from "@heroicons/react/solid";
import Image from "next/image";

type Props = {
	user: User | null;
};

type NextLinkProps = {
	href: string,
	children: ReactNode,
	icon?: ReactNode;
};

const NextLink = ({ href, children, icon, ...props }: NextLinkProps) => {
	return (
		<Link href={href} passHref>
			<a {...props} className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2.5 px-6 flex gap-2 items-center text-sm">
				{icon ? icon : null}
				{children}
			</a>
		</Link>
	);
};

const BrowseMenu = ({ user }: Props) => {
	const { data, isLoading } = useTopicFollow();
	return (
		<Menu as="div" className="relative hidden sm:inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className={`flex text-sm gap-2 items-center border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left px-3 rounded border w-64 h-10 font-medium ${open ? 'border-gray-200 dark:border-gray-700 rounded-b-none' : ''}`}>
						Browse
						<ChevronDownIcon className="h-4 w-4 ml-auto" />
					</Menu.Button>
					<Menu.Items className="absolute w-64 left-0 origin-top-right border-t-0 border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 py-2 rounded-b flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll">
						<Menu.Item as={NextLink} href="/" icon={<HomeIcon className="h-5 w-5" />}>
							Home
						</Menu.Item>
						<Menu.Item as={NextLink} href="/t" icon={<SearchIcon className="h-5 w-5" />}>
							Discover Topics
						</Menu.Item>
						<Menu.Item as={NextLink} href="/submit" icon={<PlusIcon className="h-5 w-5" />}>
							Create Post
						</Menu.Item>
						<Menu.Item as={NextLink} href="/t/create" icon={<PlusIcon className="h-5 w-5" />}>
							Create Topic
						</Menu.Item>
						<Divider className="my-2" />
						{!user ? (
							<Menu.Item as={NextLink} href="/register">
								Sign up to follow topics!
							</Menu.Item>
						) : (
							!isLoading && data && data.topics_followed.map((topic, i) => (
								<Menu.Item as={NextLink} key={i} href={`/t/${topic.title}`} icon={topic.icon_image_name ? <Image alt="topic icon" src={topic.icon_image_name} width={20} height={20} className="rounded-full" /> : <Avatar className="h-5 w-5 flex-none" />}>
									t/{topic.title}
								</Menu.Item>
							))
						)}
					</Menu.Items>
				</>
			)}
		</Menu>
	);
};

export default BrowseMenu;
