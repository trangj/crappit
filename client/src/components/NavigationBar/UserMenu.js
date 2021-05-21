import React from "react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";

const UserMenu = ({ user, logoutUser }) => {
	return (
		<Menu>
			<MenuButton as={IconButton} icon={<HamburgerIcon />}></MenuButton>
			<MenuList>
				<MenuItem as={Link} to={`/user/${user._id}`}>
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
		</Menu>
	);
};

export default UserMenu;
