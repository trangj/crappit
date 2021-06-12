import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const UserMenu = ({ user, logoutUser }) => {
	return (
		<Menu display={{ base: "none", sm: "inherit" }}>
			<MenuButton as={Button}>{user.username}</MenuButton>
			<div style={{ zIndex: "2" }}>
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
