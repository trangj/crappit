import React, { ReactNode } from "react";
import Link from "next/link";
import { User } from "src/types/entities/user";
import { Menu } from '@headlessui/react';
import { Avatar } from "src/ui/Avatar";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Image from 'next/image';

type Props = {
	user: User,
	logoutUser: any;
	theme: string;
	setTheme: (arg: string) => void;
};

type NextLinkProps = {
	href: string,
	children: ReactNode,
};

const NextLink = ({ href, children, ...props }: NextLinkProps) => {
	return (
		<Link href={href} passHref>
			<a {...props} className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-6">
				{children}
			</a>
		</Link>
	);
};

const UserMenu = ({ user, logoutUser, theme, setTheme }: Props) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className={`flex text-xs gap-2 items-center border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left px-3 rounded border w-56 h-10 font-medium ${open ? 'border-gray-200 dark:border-gray-700 rounded-b-none' : ''}`}>
						{!user.avatar_image_name ? <Avatar className="h-6 w-6" /> : <Image alt="user avatar" src={user.avatar_image_name} width={24} height={24} className="rounded-full" />}
						{user.username}
						<ChevronDownIcon className="h-4 w-4 ml-auto" />
					</Menu.Button>
					<Menu.Items className="absolute left-0 w-56 origin-top-right border-t-0 border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 py-2 rounded-b flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll">
						<Menu.Item as={NextLink} href={`/user/${user.id}`}>
							Profile
						</Menu.Item>
						<Menu.Item as={NextLink} href={"/settings"}>
							Settings
						</Menu.Item>
						<Menu.Item
							as="div"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-6 cursor-pointer"
						>
							Dark Mode
						</Menu.Item>
						<Menu.Item
							onClick={async () => await logoutUser()}
							as="div"
							className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-6 cursor-pointer"
						>
							Logout
						</Menu.Item>
					</Menu.Items>
				</>
			)}
		</Menu>
	);
};

export default UserMenu;
