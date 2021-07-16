import React from "react";
import Link from "next/link";
import { User } from "src/types/entities/user";
import { Menu } from '@headlessui/react';
import Avatar from "src/ui/Avatar";
import { ChevronDownIcon } from "@heroicons/react/outline";

type Props = {
	user: User,
	logoutUser: any;
};

const UserMenu = ({ user, logoutUser }: Props) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className={`flex text-xs gap-2 items-center border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left px-3 rounded border w-56 h-10 font-medium ${open ? 'border-gray-200 dark:border-gray-700 rounded-b-none' : ''}`}>
						<div className="h-6 w-6">
							<Avatar />
						</div>
						{user.username}
						<div className="h-6 w-6 ml-auto">
							<ChevronDownIcon />
						</div>
					</Menu.Button>
					<Menu.Items className="absolute left-0 w-56 origin-top-right border-t-0 border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 rounded-b flex flex-col max-h-96 overflow-x-hidden overflow-y-scroll">
						<Menu.Item >
							<Link passHref href={`/user/${user.id}`}>
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Profile
								</a>
							</Link>
						</Menu.Item>
						<Menu.Item>
							<Link passHref href={"/settings"}>
								<a className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2">
									Settings
								</a>
							</Link>
						</Menu.Item>
						<Menu.Item
							onClick={async () => {
								await logoutUser();
							}}
							as="div"
							className="hover:bg-gray-300 dark:hover:bg-gray-800 p-2 cursor-pointer"
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
