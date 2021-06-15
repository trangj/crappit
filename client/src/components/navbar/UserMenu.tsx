import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
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
					<MenuItem as={Link} to={`/user/${user.id}`}>
						Profile
					</MenuItem>
					<MenuItem as={Link} to={"/settings"}>
						Settings
					</MenuItem>
					<MenuItem
						onClick={() => {
							logoutUser();
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
