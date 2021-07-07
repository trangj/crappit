import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import Link from "next/link";
import { User } from "src/types/entities/user";

type Props = {
	user: User,
	logoutUser: any;
};

const UserMenu = ({ user, logoutUser }: Props) => {
	return (
		<Menu>
			<MenuButton as={Button} display={{ base: "none", sm: "inherit" }}>{user.username}</MenuButton>
			<div style={{ zIndex: 2 }}>
				<MenuList>
					<Link passHref href={`/user/${user.id}`}>
						<MenuItem as="a">
							Profile
						</MenuItem>
					</Link>
					<Link passHref href={"/settings"}>
						<MenuItem as="a">
							Settings
						</MenuItem>
					</Link>
					<MenuItem
						onClick={async () => {
							await logoutUser();
						}}
						color="inherit"
					>
						Logout
					</MenuItem>
				</MenuList>
			</div>
		</Menu>
	);
};

export default UserMenu;
