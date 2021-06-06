import React from "react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	MenuGroup,
	Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TriangleDownIcon } from "@chakra-ui/icons";

const BrowseMenu = ({ user }) => {
	return (
		<Menu>
			<MenuButton as={Button} rightIcon={<TriangleDownIcon />}>
				Browse
			</MenuButton>
			<div style={{ zIndex: "2" }}>
				<MenuList>
					<MenuItem as={Link} to="/">
						Home
					</MenuItem>
					<MenuItem as={Link} to="/t">
						Discover Topics
					</MenuItem>
					<MenuItem as={Link} to={`/submit`}>
						Create a post
					</MenuItem>
					<MenuItem as={Link} to={`/t/submit`}>
						Create a topic
					</MenuItem>
					<MenuDivider />
					{user === null ? (
						<MenuItem as={Link} to="/register">
							Sign up to follow topics!
						</MenuItem>
					) : (
						<MenuGroup title="Followed Topics">
							{user.topics_followed.map((topic, i) => (
								<MenuItem as={Link} to={`/t/${topic.title}`} key={i}>
									t/{topic.title}
								</MenuItem>
							))}
						</MenuGroup>
					)}
				</MenuList>
			</div>
		</Menu>
	);
};

export default BrowseMenu;
